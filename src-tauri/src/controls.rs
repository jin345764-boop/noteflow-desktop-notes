use super::*;

#[tauri::command]
pub async fn desktop_panel(app: AppHandle, note_id: Option<String>, gallery: Option<bool>, focus: Option<bool>) -> Result<(), String> {
    let (label, url, title) = if focus.unwrap_or(false) { ("focus".into(), "index.html?focus=1".into(), "番茄钟") } else if gallery.unwrap_or(false) { ("themes".into(), "index.html?themes=1".into(), "40款便签主题") } else { match note_id {
        Some(id) => (format!("settings-{id}"), format!("index.html?settings={id}"), "便签设置"),
        None => ("manager".into(), "index.html?manager=1".into(), "管理便签"),
    } };
    if let Some(window) = app.get_webview_window(&label) {
        window.show().map_err(|e| e.to_string())?;
        return window.set_focus().map_err(|e| e.to_string());
    }
    WebviewWindowBuilder::new(&app, label, WebviewUrl::App(url.into())).title(title)
        .inner_size(if focus.unwrap_or(false) {490.0} else {760.0}, if focus.unwrap_or(false) {720.0} else {640.0}).min_inner_size(if focus.unwrap_or(false) {420.0} else {650.0},540.0).center().always_on_top(true)
        .build().map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
pub fn desktop_close_panel(window: tauri::WebviewWindow) -> Result<(), String> { window.destroy().map_err(|e| e.to_string()) }
#[tauri::command]
pub fn desktop_toolbar(app: AppHandle, collapsed: bool, menu_open: Option<bool>) -> Result<(), String> {
    let window = app.get_webview_window("main").ok_or("Control bar missing")?;
    let monitor = window.current_monitor().map_err(|e| e.to_string())?.ok_or("No monitor")?;
    let area = monitor.work_area(); let scale = monitor.scale_factor();
    let p = window.outer_position().map_err(|e| e.to_string())?;
    let store = app.state::<Store>();
    let mut home = store.toolbar_home.lock().unwrap();
    let width = if collapsed { 190.0 } else { 640.0 };
    let height = if !collapsed && menu_open.unwrap_or(false) { (area.size.height as f64 / scale).min(580.0) } else { 44.0 };
    let target = if collapsed {
        if home.is_none() { *home = Some([p.x,p.y]); }
        [area.position.x + area.size.width as i32 - (width * scale) as i32, p.y]
    } else { home.take().unwrap_or([p.x,p.y]) };
    drop(home);
    window.set_size(LogicalSize::new(width,height)).map_err(|e| e.to_string())?;
    let x = target[0].clamp(area.position.x,(area.position.x+area.size.width as i32-(width*scale) as i32).max(area.position.x));
    let y = target[1].clamp(area.position.y,(area.position.y+area.size.height as i32-(height*scale) as i32).max(area.position.y));
    window.set_position(PhysicalPosition::new(x,y)).map_err(|e| e.to_string())
}
#[tauri::command]
pub fn desktop_preferences(app: AppHandle, changes: Option<Value>) -> Result<Value,String> {
    let store = app.state::<Store>(); let mut data = store.data.lock().unwrap();
    if !data.preferences.is_object() { data.preferences = json!({}); }
    if let Some(changes) = changes {
        for (key,value) in changes.as_object().ok_or("Invalid preferences")? { data.preferences[key] = value.clone(); }
        save(&store,&data)?;
        app.emit("preferences-changed",data.preferences.clone()).map_err(|e| e.to_string())?;
    }
    Ok(data.preferences.clone())
}
#[tauri::command]
pub fn desktop_list(app: AppHandle) -> Notes { app.state::<Store>().data.lock().unwrap().clone() }
#[tauri::command]
pub async fn desktop_restore(app: AppHandle, note_id: String) -> Result<(), String> {
    let note = {
        let store = app.state::<Store>(); let mut data = store.data.lock().unwrap();
        let i = data.archived.iter().position(|n| id(n) == note_id).ok_or("Archived note missing")?;
        let note = data.archived.remove(i); data.notes.push(note.clone()); save(&store, &data)?; note
    };
    open_note(&app, &note)?;
    app.emit("notes-changed", ()).map_err(|e| e.to_string())
}
#[tauri::command]
pub fn desktop_visibility(app: AppHandle) -> Result<bool, String> {
    let windows: Vec<_> = app.webview_windows().into_values().filter(|w| w.label().starts_with("note-")).collect();
    let visible = windows.iter().any(|w| w.is_visible().unwrap_or(false));
    for window in windows { if visible { window.hide() } else { window.show() }.map_err(|e| e.to_string())?; }
    Ok(!visible)
}
#[tauri::command]
pub fn desktop_align(app: AppHandle) -> Result<(), String> {
    *app.state::<Store>().drag.lock().unwrap() = None;
    let monitor = app.primary_monitor().map_err(|e| e.to_string())?.ok_or("No monitor")?;
    let area = monitor.work_area(); let scale = monitor.scale_factor();
    let all_notes = app.state::<Store>().data.lock().unwrap().notes.clone();
    let mut obstacles = vec![];
    for note in all_notes.iter().filter(|note| note["sizeLocked"] == true) {
        if let Some(window) = app.get_webview_window(id(note)) {
            let p = window.outer_position().map_err(|e| e.to_string())?;
            let s = window.outer_size().map_err(|e| e.to_string())?;
            obstacles.push([p.x,p.y,p.x+s.width as i32,p.y+s.height as i32]);
        }
    }
    let notes: Vec<_> = all_notes.into_iter().filter(|note| note["sizeLocked"] != true).collect();
    app.state::<Store>().selected.lock().unwrap().clear();
    let sizes: Vec<_> = notes.iter().map(|note| { let (w,h) = dimensions(note); [(w*scale) as i32,(h*scale) as i32] }).collect();
    let positions = packed_positions(&sizes,[area.position.x,area.position.y+(68.0*scale) as i32,area.position.x+area.size.width as i32-(8.0*scale) as i32,area.position.y+area.size.height as i32],&obstacles);
    for (note,p) in notes.iter().zip(positions) {
        if let Some(window) = app.get_webview_window(id(note)) {
            let (width,height) = dimensions(note);
            window.set_size(LogicalSize::new(width,height)).map_err(|e| e.to_string())?;
            window.show().map_err(|e| e.to_string())?;
            window.set_position(PhysicalPosition::new(p[0],p[1])).map_err(|e| e.to_string())?;
        }
        app.emit("note-updated",json!({"note":note,"source":"layout"})).map_err(|e| e.to_string())?;
    }
    app.emit("notes-changed",()).map_err(|e| e.to_string())?;
    app.emit("selection-changed", Vec::<String>::new()).map_err(|e| e.to_string())
}
fn packed_positions(sizes: &[[i32;2]], bounds: [i32;4], obstacles: &[[i32;4]]) -> Vec<[i32;2]> {
    let Some(anchor) = obstacles.iter().min_by_key(|block| (block[1],block[0])) else {
        let mut right = bounds[2]; let mut y = bounds[1]; let mut column_width = 0;
        return sizes.iter().map(|size| {
            if y > bounds[1] && y+size[1] > bounds[3] { right -= column_width.max(1); y = bounds[1]; column_width = 0; }
            let p = [right-size[0],y]; y += size[1]; column_width = column_width.max(size[0]); p
        }).collect();
    };
    let mut direction = if anchor[2]+sizes.iter().map(|size|size[0]).max().unwrap_or(0) <= bounds[2] {1} else {-1};
    let mut edge = if direction == 1 {anchor[2]} else {anchor[0]};
    let mut y = anchor[1]; let mut column_width = 0;
    let mut occupied = obstacles.to_vec(); let mut positions = vec![];
    for size in sizes {
        loop {
            if y > anchor[1] && y+size[1] > bounds[3] { edge += direction*column_width.max(size[0]); y = anchor[1]; column_width = 0; }
            if direction == 1 && edge+size[0] > bounds[2] { direction = -1; edge = anchor[0]; y = anchor[1]; column_width = 0; }
            let x = if direction == 1 {edge} else {edge-size[0]};
            if let Some(block) = occupied.iter().find(|block| x < block[2] && x+size[0] > block[0] && y < block[3] && y+size[1] > block[1]) {
                y = block[3]; column_width = column_width.max(size[0]);
            } else {
                positions.push([x,y]); occupied.push([x,y,x+size[0],y+size[1]]);
                y += size[1]; column_width = column_width.max(size[0]); break;
            }
        }
    }
    positions
}
#[tauri::command]
pub fn desktop_selection(app: AppHandle) -> Vec<String> { app.state::<Store>().selected.lock().unwrap().clone() }
#[tauri::command]
pub fn desktop_toggle_selection(app: AppHandle, note_id: String) -> Result<(), String> {
    *app.state::<Store>().drag.lock().unwrap() = None;
    let store = app.state::<Store>(); let mut selected = store.selected.lock().unwrap();
    if selected.contains(&note_id) { selected.retain(|id| id != &note_id); } else { selected.push(note_id); }
    app.emit("selection-changed", selected.clone()).map_err(|e| e.to_string())
}
#[tauri::command]
pub async fn desktop_begin_selection(app: AppHandle) -> Result<(), String> {
    desktop_cancel_selection(app.clone())?;
    for (i, monitor) in app.available_monitors().map_err(|e| e.to_string())?.iter().enumerate() {
        let area = monitor.work_area(); let scale = monitor.scale_factor();
        let window = WebviewWindowBuilder::new(&app, format!("selection-{i}"), WebviewUrl::App("index.html?selection=1".into()))
            .title("框选便签").inner_size(area.size.width as f64 / scale, area.size.height as f64 / scale)
            .decorations(false).transparent(true).shadow(false).resizable(false).skip_taskbar(true).always_on_top(true)
            .build().map_err(|e| e.to_string())?;
        window.set_position(PhysicalPosition::new(area.position.x, area.position.y)).map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}
fn intersects(a: [f64;4], b: [f64;4]) -> bool { a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1] }
#[tauri::command]
pub fn desktop_finish_selection(app: AppHandle, window: tauri::WebviewWindow, rect: [f64;4], append: bool) -> Result<(), String> {
    let origin = window.outer_position().map_err(|e| e.to_string())?;
    let scale = window.scale_factor().map_err(|e| e.to_string())?;
    let area = [origin.x as f64 + rect[0]*scale, origin.y as f64 + rect[1]*scale, origin.x as f64 + rect[2]*scale, origin.y as f64 + rect[3]*scale];
    let mut ids = if append { desktop_selection(app.clone()) } else { vec![] };
    for note in app.webview_windows().into_values().filter(|w| w.label().starts_with("note-") && w.is_visible().unwrap_or(false)) {
        let p = note.outer_position().map_err(|e| e.to_string())?; let s = note.outer_size().map_err(|e| e.to_string())?;
        if intersects(area, [p.x as f64,p.y as f64,(p.x+s.width as i32) as f64,(p.y+s.height as i32) as f64]) && !ids.iter().any(|id| id == note.label()) { ids.push(note.label().into()); }
    }
    *app.state::<Store>().selected.lock().unwrap() = ids.clone();
    app.emit("selection-changed", ids).map_err(|e| e.to_string())?;
    desktop_cancel_selection(app)
}
#[tauri::command]
pub fn desktop_cancel_selection(app: AppHandle) -> Result<(), String> {
    *app.state::<Store>().drag.lock().unwrap() = None;
    for w in app.webview_windows().into_values().filter(|w| w.label().starts_with("selection-")) { w.destroy().map_err(|e| e.to_string())?; }
    Ok(())
}
#[tauri::command]
pub fn desktop_drag(app: AppHandle, window: tauri::WebviewWindow) -> Result<(), String> {
    let store = app.state::<Store>();
    let locked: Vec<_> = store.data.lock().unwrap().notes.iter().filter(|note| note["sizeLocked"] == true).map(|note| id(note).to_string()).collect();
    if locked.iter().any(|id| id == window.label()) { return Ok(()); }
    let selected: Vec<_> = store.selected.lock().unwrap().iter().filter(|id| !locked.contains(id)).cloned().collect();
    let group = if selected.iter().any(|id| id == window.label()) {
        let p = window.outer_position().map_err(|e| e.to_string())?;
        let mut peers = HashMap::new();
        for id in selected.iter().filter(|id| id.as_str() != window.label()) {
            if let Some(peer) = app.get_webview_window(id) {
                let p = peer.outer_position().map_err(|e| e.to_string())?;
                peers.insert(id.clone(), [p.x,p.y]);
            }
        }
        Some(DragGroup { leader: window.label().into(), origin: [p.x,p.y], peers })
    } else { None };
    *store.drag.lock().unwrap() = group;
    window.start_dragging().map_err(|e| e.to_string())
}
fn translated(origin: [i32;2], point: [i32;2], peer: [i32;2]) -> [i32;2] {
    [peer[0]+point[0]-origin[0], peer[1]+point[1]-origin[1]]
}
pub fn moved(window: &tauri::Window, point: [i32;2]) {
    let label = window.label();
    if label != "main" && !label.starts_with("note-") { return; }
    let store = window.state::<Store>();
    let peers: Vec<_> = store.drag.lock().unwrap().as_ref().filter(|group| group.leader == label)
        .map(|group| group.peers.iter().map(|(id,p)| (id.clone(), translated(group.origin,point,*p))).collect()).unwrap_or_default();
    {
        let mut data = store.data.lock().unwrap();
        for (id,p) in &peers { data.positions.insert(id.clone(), *p); }
        data.positions.insert(label.into(), point);
        if let Err(error) = save(&store, &data) { let _ = window.emit("desktop-error", error); }
    }
    for (id, p) in peers { if let Some(peer) = window.app_handle().get_webview_window(&id) { let _ = peer.set_position(PhysicalPosition::new(p[0],p[1])); } }
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn mixed_sizes_pack_without_gaps_or_changing_their_dimensions() {
        let sizes = [[268,228],[328,308],[228,188]];
        assert_eq!(packed_positions(&sizes,[0,68,1000,700],&[]), vec![[732,68],[672,296],[444,68]]);
        assert_eq!(sizes, [[268,228],[328,308],[228,188]]);
    }
    #[test]
    fn locked_notes_are_obstacles_for_unlocked_notes() {
        let locked = [[732,68,1000,296]];
        assert_eq!(packed_positions(&[[268,228],[328,308]],[0,68,1000,700],&locked),vec![[464,68],[404,296]]);
        assert_eq!(locked,[[732,68,1000,296]]);
    }
    #[test]
    fn locked_note_anchors_neighbor_top_and_spacing_at_original_position() {
        let anchor = [[72,103,334,861]];
        assert_eq!(packed_positions(&[[268,228],[268,228]],[0,68,1200,1000],&anchor),vec![[334,103],[334,331]]);
        assert_eq!(anchor,[[72,103,334,861]]);
    }
    #[test]
    fn multiple_locked_notes_are_preserved_and_not_overlapped() {
        let blocks = [[100,120,368,500],[368,120,636,348]];
        let result = packed_positions(&[[268,228]],[0,68,1200,900],&blocks);
        assert_eq!(result,vec![[368,348]]);
    }
    #[test]
    fn box_selection_includes_partial_overlap_but_not_distant_notes() {
        assert!(intersects([100.,100.,400.,400.],[350.,350.,610.,570.]));
        assert!(!intersects([100.,100.,400.,400.],[500.,500.,760.,720.]));
    }
    #[test]
    fn group_drag_preserves_offsets_from_the_original_positions() {
        assert_eq!(translated([100,100],[125,150],[300,200]), [325,250]);
        assert_eq!(translated([100,100],[150,175],[300,200]), [350,275]);
    }
}
