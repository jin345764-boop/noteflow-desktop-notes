use super::*;

#[derive(Default)]
pub struct LayoutState(pub Mutex<Option<HashMap<String, [i32; 2]>>>);
#[derive(Clone)]
struct Card { id: String, x: i32, y: i32, width: i32, height: i32 }
#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Placement { note_id: String, x: i32, y: i32 }
#[derive(Serialize)]
pub struct LayoutInfo { movable: usize, locked: usize, scope: &'static str }
struct Scope { cards: Vec<Card>, obstacles: Vec<[i32; 4]>, bounds: [i32; 4], anchor: [i32; 4], gap: i32, info: LayoutInfo }

fn overlaps(a: [i32; 4], b: [i32; 4], gap: i32) -> bool {
    a[0] < b[2] + gap && a[2] + gap > b[0] && a[1] < b[3] + gap && a[3] + gap > b[1]
}

fn gather(app: &AppHandle) -> Result<Scope, String> {
    let store = app.state::<Store>();
    let selected = store.selected.lock().unwrap().clone();
    let notes = store.data.lock().unwrap().notes.clone();
    let monitor = selected.iter().find_map(|id| app.get_webview_window(id).and_then(|window| window.current_monitor().ok().flatten()))
        .or_else(|| app.get_webview_window("main").and_then(|window| window.current_monitor().ok().flatten()))
        .or_else(|| app.primary_monitor().ok().flatten()).ok_or("没有可用屏幕")?;
    let area = monitor.work_area();
    let gap = (12.0 * monitor.scale_factor()).round() as i32;
    let bounds = [area.position.x + gap, area.position.y + gap, area.position.x + area.size.width as i32 - gap, area.position.y + area.size.height as i32 - gap];
    let mut cards = vec![];
    let mut obstacles = vec![];
    let mut anchor: Option<[i32; 4]> = None;
    let mut locked = 0;
    for note in &notes {
        let Some(window) = app.get_webview_window(id(note)).filter(|window| window.is_visible().unwrap_or(false)) else { continue; };
        let p = window.outer_position().map_err(|error| error.to_string())?;
        let size = window.outer_size().map_err(|error| error.to_string())?;
        let rect = [p.x, p.y, p.x + size.width as i32, p.y + size.height as i32];
        if !overlaps(rect, bounds, 0) { continue; }
        let included = selected.is_empty() || selected.iter().any(|selected| selected == id(note));
        if included {
            anchor = Some(anchor.map_or(rect, |a| [a[0].min(rect[0]), a[1].min(rect[1]), a[2].max(rect[2]), a[3].max(rect[3])]));
        }
        if note["sizeLocked"] == true || !included {
            obstacles.push(rect);
            if included && note["sizeLocked"] == true { locked += 1; }
        } else {
            cards.push(Card { id: id(note).into(), x: p.x, y: p.y, width: size.width as i32, height: size.height as i32 });
        }
    }
    if let Some(main) = app.get_webview_window("main").filter(|window| window.is_visible().unwrap_or(false)) {
        if let (Ok(p), Ok(size)) = (main.outer_position(), main.outer_size()) {
            obstacles.push([p.x, p.y, p.x + size.width as i32, p.y + size.height.min((44.0 * monitor.scale_factor()).round() as u32) as i32]);
        }
    }
    let info = LayoutInfo { movable: cards.len(), locked, scope: if selected.is_empty() { "screen" } else { "selection" } };
    Ok(Scope { cards, obstacles, bounds, anchor: anchor.unwrap_or(bounds), gap, info })
}

fn direction_positions(mut cards: Vec<Card>, mode: &str, bounds: [i32; 4], anchor: [i32; 4], obstacles: &[[i32; 4]], gap: i32) -> Result<Vec<Placement>, String> {
    if cards.is_empty() { return Err("没有可移动的便签，请先选择便签或解锁需要整理的便签".into()); }
    let vertical = mode == "left" || mode == "right";
    if !vertical && mode != "top" && mode != "bottom" { return Err("请选择左、右、顶部或底部对齐".into()); }
    let max_width = cards.iter().map(|card| card.width).max().unwrap();
    let max_height = cards.iter().map(|card| card.height).max().unwrap();
    let length = cards.iter().map(|card| if vertical { card.height } else { card.width }).sum::<i32>() + gap * (cards.len() as i32 - 1);
    if max_width > bounds[2] - bounds[0] || max_height > bounds[3] - bounds[1] { return Err("有便签大于当前屏幕可用区域，请先缩小该便签".into()); }
    if length > if vertical { bounds[3] - bounds[1] } else { bounds[2] - bounds[0] } {
        return Err(if vertical { "这些便签竖排后超出屏幕高度，请减少选择，或使用下方的分列整理" } else { "这些便签横排后超出屏幕宽度，请减少选择，或改用左、右对齐竖排" }.into());
    }
    cards.sort_by_key(|card| if vertical { (card.y, card.x) } else { (card.x, card.y) });
    let edge = match mode {
        "left" => anchor[0].clamp(bounds[0], bounds[2] - max_width),
        "right" => anchor[2].clamp(bounds[0] + max_width, bounds[2]),
        "top" => anchor[1].clamp(bounds[1], bounds[3] - max_height),
        _ => anchor[3].clamp(bounds[1] + max_height, bounds[3]),
    };
    let mut cursor = if vertical { anchor[1].clamp(bounds[1], bounds[3] - length) } else { anchor[0].clamp(bounds[0], bounds[2] - length) };
    let mut result = vec![];
    for card in cards {
        loop {
            let (x, y) = match mode { "left" => (edge, cursor), "right" => (edge - card.width, cursor), "top" => (cursor, edge), _ => (cursor, edge - card.height) };
            let rect = [x, y, x + card.width, y + card.height];
            if let Some(end) = obstacles.iter().filter(|other| overlaps(rect, **other, gap)).map(|other| if vertical { other[3] } else { other[2] }).max() {
                cursor = end + gap;
                continue;
            }
            if rect[2] > bounds[2] || rect[3] > bounds[3] {
                return Err("锁定或未选中的便签挡住了排列位置，当前方向放不下；请减少选择、移动挡住的便签或改用分列整理".into());
            }
            result.push(Placement { note_id: card.id, x, y });
            cursor += if vertical { card.height + gap } else { card.width + gap };
            break;
        }
    }
    Ok(result)
}

fn column_positions(mut cards: Vec<Card>, count: usize, bounds: [i32; 4], anchor: [i32; 4], obstacles: &[[i32; 4]], gap: i32) -> Result<Vec<Placement>, String> {
    if cards.is_empty() { return Err("没有可移动的便签，请先选择便签或解锁需要整理的便签".into()); }
    cards.sort_by_key(|card| (card.y, card.x));
    let count = count.clamp(2, 4).min(cards.len());
    let mut groups = vec![vec![]; count];
    let mut heights = vec![0; count];
    for card in cards {
        let column = (0..count).min_by_key(|i| (heights[*i], *i)).unwrap();
        heights[column] += card.height + gap;
        groups[column].push(card);
    }
    let widths: Vec<_> = groups.iter().map(|group| group.iter().map(|card| card.width).max().unwrap()).collect();
    let width = widths.iter().sum::<i32>() + gap * (count as i32 - 1);
    let height = heights.iter().max().unwrap() - gap;
    if width > bounds[2] - bounds[0] || height > bounds[3] - bounds[1] { return Err("这些便签按当前列数放不下，请调整列数或减少选择；原布局未改变".into()); }
    let top = anchor[1].clamp(bounds[1], bounds[3] - height);
    let mut x = anchor[0].clamp(bounds[0], bounds[2] - width);
    let mut result = vec![];
    for (group, width) in groups.into_iter().zip(widths) {
        result.extend(direction_positions(group, "left", bounds, [x, top, x + width, bounds[3]], obstacles, gap)?);
        x += width + gap;
    }
    Ok(result)
}

#[tauri::command]
pub fn desktop_layout_info(app: AppHandle) -> Result<LayoutInfo, String> { Ok(gather(&app)?.info) }

#[tauri::command]
pub fn desktop_layout(app: AppHandle, mode: String, columns: Option<usize>, preview: Option<bool>) -> Result<Vec<Placement>, String> {
    let scope = gather(&app)?;
    let placements = if mode == "columns" { column_positions(scope.cards, columns.unwrap_or(2), scope.bounds, scope.anchor, &scope.obstacles, scope.gap)? }
        else { direction_positions(scope.cards, &mode, scope.bounds, scope.anchor, &scope.obstacles, scope.gap)? };
    if preview.unwrap_or(false) { return Ok(placements); }
    let store = app.state::<Store>();
    *store.drag.lock().unwrap() = None;
    let mut previous = HashMap::new();
    for placement in &placements {
        if let Some(window) = app.get_webview_window(&placement.note_id) {
            let p = window.outer_position().map_err(|error| error.to_string())?;
            previous.insert(placement.note_id.clone(), [p.x, p.y]);
        }
    }
    for placement in &placements {
        if let Some(window) = app.get_webview_window(&placement.note_id) {
            if let Err(error) = window.set_position(PhysicalPosition::new(placement.x, placement.y)) {
                for (id, point) in &previous { if let Some(window) = app.get_webview_window(id) { let _ = window.set_position(PhysicalPosition::new(point[0], point[1])); } }
                return Err(error.to_string());
            }
        }
    }
    { let mut data = store.data.lock().unwrap();
        for placement in &placements { data.positions.insert(placement.note_id.clone(), [placement.x, placement.y]); }
        save(&store, &data)?;
    }
    *app.state::<LayoutState>().0.lock().unwrap() = Some(previous);
    app.emit("notes-changed", ()).map_err(|error| error.to_string())?;
    Ok(placements)
}

#[tauri::command]
pub fn desktop_undo_layout(app: AppHandle) -> Result<(), String> {
    let previous = app.state::<LayoutState>().0.lock().unwrap().take().ok_or("没有可撤销的整理")?;
    let store = app.state::<Store>();
    let locked: Vec<String> = store.data.lock().unwrap().notes.iter().filter(|note| note["sizeLocked"] == true).map(|note| id(note).into()).collect();
    *store.drag.lock().unwrap() = None;
    let mut restored = vec![];
    for (id, point) in previous {
        if locked.contains(&id) { continue; }
        if let Some(window) = app.get_webview_window(&id) {
            window.set_position(PhysicalPosition::new(point[0], point[1])).map_err(|error| error.to_string())?;
            restored.push((id, point));
        }
    }
    let mut data = store.data.lock().unwrap();
    for (id, point) in restored { data.positions.insert(id, point); }
    save(&store, &data)
}

#[tauri::command]
pub fn desktop_show_notes(app: AppHandle, note_ids: Vec<String>) -> Result<(), String> {
    let notes = app.state::<Store>().data.lock().unwrap().notes.clone();
    for note in notes.iter().filter(|note| note_ids.iter().any(|requested| requested == id(note))) {
        open_note(&app, note)?;
        if let Some(window) = app.get_webview_window(id(note)) { let _ = window.set_focus(); }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    fn card(id: &str, x: i32, y: i32, width: i32, height: i32) -> Card { Card { id: id.into(), x, y, width, height } }
    fn cards() -> Vec<Card> { vec![card("a",100,100,240,180),card("b",380,320,300,250)] }
    #[test]
    fn mixed_sizes_align_left_or_right_with_vertical_gaps() {
        let left = direction_positions(cards(),"left",[0,0,1200,900],[100,100,680,570],&[],12).unwrap();
        assert_eq!(left.iter().map(|p|(p.x,p.y)).collect::<Vec<_>>(),vec![(100,100),(100,292)]);
        let right = direction_positions(cards(),"right",[0,0,1200,900],[100,100,680,570],&[],12).unwrap();
        assert_eq!(right.iter().map(|p|(p.x,p.y)).collect::<Vec<_>>(),vec![(440,100),(380,292)]);
    }
    #[test]
    fn mixed_sizes_align_top_or_bottom_with_horizontal_gaps() {
        let top = direction_positions(cards(),"top",[0,0,1200,900],[100,100,680,570],&[],12).unwrap();
        assert_eq!(top.iter().map(|p|(p.x,p.y)).collect::<Vec<_>>(),vec![(100,100),(352,100)]);
        let bottom = direction_positions(cards(),"bottom",[0,0,1200,900],[100,100,680,570],&[],12).unwrap();
        assert_eq!(bottom.iter().map(|p|(p.x,p.y)).collect::<Vec<_>>(),vec![(100,390),(352,320)]);
    }
    #[test]
    fn locked_obstacles_keep_position_and_are_not_overlapped() {
        let locked = [[100,100,400,300]];
        let result = direction_positions(cards(),"left",[0,0,1200,1000],[100,100,680,570],&locked,12).unwrap();
        assert_eq!((result[0].x,result[0].y),(100,312));
        assert_eq!((result[1].x,result[1].y),(100,504));
        assert_eq!(locked,[[100,100,400,300]]);
    }
    #[test]
    fn screen_edges_shift_the_whole_stack_inside_without_resizing() {
        let result = direction_positions(cards(),"left",[0,0,800,700],[750,600,1050,850],&[],12).unwrap();
        assert_eq!(result.iter().map(|p|(p.x,p.y)).collect::<Vec<_>>(),vec![(500,258),(500,450)]);
    }
    #[test]
    fn insufficient_space_rejects_requested_direction_instead_of_reflowing() {
        assert!(direction_positions(cards(),"left",[0,0,1200,400],[100,100,680,570],&[],12).unwrap_err().contains("分列"));
        assert!(direction_positions(cards(),"top",[0,0,500,900],[100,100,680,570],&[],12).unwrap_err().contains("横排"));
        assert!(direction_positions(cards(),"left",[0,0,800,700],[100,100,680,570],&[[100,0,400,600]],12).is_err());
    }
    #[test]
    fn explicit_columns_keep_independent_stacks() {
        let result = column_positions(vec![card("a",100,100,240,500),card("b",360,120,300,180),card("c",360,320,260,180)],2,[0,0,1200,900],[100,100,660,600],&[],12).unwrap();
        assert_eq!(result.iter().map(|p|(p.x,p.y)).collect::<Vec<_>>(),vec![(100,100),(352,100),(352,292)]);
    }
}

