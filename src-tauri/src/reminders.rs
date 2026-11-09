use super::*;

fn now_ms() -> u64 { SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_millis() as u64 }

fn candidates(notes: &[Value]) -> Vec<(String, Value, u64)> {
    let mut result = vec![];
    for note in notes.iter().filter(|note| note["isPlainNote"] != true) {
        for item in note["items"].as_array().into_iter().flatten() {
            let Some(due) = item["dueAt"].as_u64().filter(|due| *due > 0) else { continue; };
            let minutes = item["remindMinutes"].as_i64().unwrap_or(10);
            if minutes < 0 || item["done"] == true { continue; }
            let cycle = item["completionCycle"].as_u64().unwrap_or_else(|| note["taskCycle"].as_u64().unwrap_or(0));
            let key = format!("{}:{}:{cycle}:{due}:{minutes}", id(note), item["id"].as_str().unwrap_or(""));
            let at = due.saturating_sub(minutes.min(43_200) as u64 * 60_000);
            result.push((key, json!({"noteId":note["id"],"itemId":item["id"],"text":item["text"],"project":note["title"],"dueAt":due}), at));
        }
    }
    result
}

fn collect(notes: &[Value], states: &Value) -> Vec<Value> {
    candidates(notes).into_iter().filter(|(key, _, _)| states[key]["pending"] == true).map(|(_, row, _)| row).collect()
}

fn advance(notes: &[Value], states: &mut Value, now: u64) -> bool {
    if !states.is_object() { *states = json!({}); }
    let mut changed = false;
    for (key, _, at) in candidates(notes) {
        let state = &states[&key];
        let snoozed = state["snoozedUntil"].as_u64().unwrap_or(0);
        if now >= at && ((state["delivered"] != true && snoozed == 0) || (snoozed > 0 && now >= snoozed)) {
            states[&key] = json!({"delivered":true,"pending":true,"snoozedUntil":0});
            changed = true;
        }
    }
    changed
}

fn display(app: &AppHandle, count: usize, reveal: bool) -> Result<(), String> {
    if count == 0 {
        if let Some(window) = app.get_webview_window("reminder") { window.hide().map_err(|error| error.to_string())?; }
        return Ok(());
    }
    if !reveal { return Ok(()); }
    let width = 360.0_f64;
    let height = (100.0 + count.min(4) as f64 * 98.0).min(492.0);
    let monitor = app.get_webview_window("main").and_then(|window| window.current_monitor().ok().flatten())
        .or_else(|| app.primary_monitor().ok().flatten()).ok_or("没有可用屏幕")?;
    let area = monitor.work_area();
    let scale = monitor.scale_factor();
    let width = width.min(area.size.width as f64 / scale);
    let height = height.min(area.size.height as f64 / scale);
    let window = if let Some(window) = app.get_webview_window("reminder") { window } else {
        WebviewWindowBuilder::new(app, "reminder", WebviewUrl::App("index.html?reminder=1".into()))
            .title("待办提醒").inner_size(width, height).decorations(false).resizable(false)
            .skip_taskbar(true).always_on_top(true).focused(false).visible(false)
            .build().map_err(|error| error.to_string())?
    };
    window.set_size(LogicalSize::new(width, height)).map_err(|error| error.to_string())?;
    window.set_position(PhysicalPosition::new(
        area.position.x + (area.size.width as i32 - ((width + 16.0) * scale) as i32).max(0),
        area.position.y + (area.size.height as i32 - ((height + 16.0) * scale) as i32).max(0),
    )).map_err(|error| error.to_string())?;
    window.show().map_err(|error| error.to_string())
}

fn tick(app: &AppHandle, reveal_pending: bool) -> Result<(), String> {
    let (changed, pending) = {
        let store = app.state::<Store>();
        let mut data = store.data.lock().unwrap();
        if !data.preferences.is_object() { data.preferences = json!({}); }
        let notes = data.notes.clone();
        let changed = advance(&notes, &mut data.preferences["reminders"], now_ms());
        let pending = collect(&notes, &data.preferences["reminders"]);
        if changed { save(&store, &data)?; }
        (changed, pending)
    };
    app.emit("reminders-changed", &pending).map_err(|error| error.to_string())?;
    let app_for_ui = app.clone();
    app.run_on_main_thread(move || { let _ = display(&app_for_ui, pending.len(), changed || reveal_pending); }).map_err(|error| error.to_string())
}

pub fn initialize(app: &AppHandle) {
    let app = app.clone();
    std::thread::spawn(move || {
        let mut first_tick = true;
        loop {
            match tick(&app, first_tick) {
                Ok(()) => first_tick = false,
                Err(error) => { let _ = app.emit("desktop-error", error); }
            }
            std::thread::sleep(std::time::Duration::from_secs(15));
        }
    });
}

#[tauri::command]
pub fn desktop_reminder_list(app: AppHandle) -> Vec<Value> {
    let store = app.state::<Store>();
    let data = store.data.lock().unwrap();
    collect(&data.notes, &data.preferences["reminders"])
}

fn update(app: &AppHandle, note_id: &str, item_id: &str, snooze: bool) -> Result<(), String> {
    {
        let store = app.state::<Store>();
        let mut data = store.data.lock().unwrap();
        let rows = candidates(&data.notes);
        let (key, _, _) = rows.iter().find(|(_, row, _)| row["noteId"] == note_id && row["itemId"] == item_id).ok_or("该事项已完成或提醒已更改")?;
        data.preferences["reminders"][key] = json!({"delivered":true,"pending":false,"snoozedUntil":if snooze { now_ms() + 600_000 } else { 0 }});
        save(&store, &data)?;
    }
    tick(app, false)
}

#[tauri::command]
pub fn desktop_reminder_snooze(app: AppHandle, note_id: String, item_id: String) -> Result<(), String> { update(&app, &note_id, &item_id, true) }

#[tauri::command]
pub fn desktop_reminder_dismiss(app: AppHandle, note_id: String, item_id: String) -> Result<(), String> { update(&app, &note_id, &item_id, false) }

#[cfg(test)]
mod tests {
    use super::*;
    fn note() -> Value { json!({"id":"note-a","title":"Project","items":[{"id":"task-a","text":"Prepare","dueAt":1_200_000,"done":false}]}) }
    #[test]
    fn warns_ten_minutes_early_once_and_persists_delivery() {
        let notes = vec![note()]; let mut states = Value::Null;
        assert!(!advance(&notes, &mut states, 599_999));
        assert!(advance(&notes, &mut states, 600_000));
        assert_eq!(collect(&notes, &states).len(), 1);
        let mut restored: Value = serde_json::from_str(&serde_json::to_string(&states).unwrap()).unwrap();
        assert!(!advance(&notes, &mut restored, 1_500_000));
        assert_eq!(collect(&notes, &restored).len(), 1);
    }
    #[test]
    fn batches_missed_reminders_but_skips_done_and_disabled() {
        let mut notes = vec![note(),note(),note()];
        notes[1]["id"] = json!("note-b"); notes[1]["items"][0]["done"] = json!(true);
        notes[2]["id"] = json!("note-c"); notes[2]["items"][0]["remindMinutes"] = json!(-1);
        let mut states = json!({}); advance(&notes, &mut states, 5_000_000);
        assert_eq!(collect(&notes, &states).len(), 1);
        notes[0]["items"][0]["done"] = json!(true);
        assert!(collect(&notes, &states).is_empty());
    }
    #[test]
    fn snooze_and_cycle_use_their_own_deadlines() {
        let mut notes = vec![note()]; let mut states = json!({});
        advance(&notes, &mut states, 600_000);
        let key = candidates(&notes)[0].0.clone();
        states[&key] = json!({"delivered":true,"pending":false,"snoozedUntil":1_800_000});
        assert!(!advance(&notes, &mut states, 1_799_999));
        assert!(advance(&notes, &mut states, 1_800_000));
        notes[0]["taskCycle"] = json!(1);
        assert!(collect(&notes, &states).is_empty());
        assert!(advance(&notes, &mut states, 1_800_000));
        assert_eq!(collect(&notes, &states).len(), 1);
    }
    #[test]
    fn resetting_another_period_preserves_snoozed_reminder_identity() {
        let mut notes = vec![note()];
        notes[0]["taskCycle"] = json!(3);
        notes[0]["items"].as_array_mut().unwrap().push(json!({"id":"next-week","text":"Later task","done":true,"dueAt":9_000_000}));
        let mut states = json!({}); advance(&notes, &mut states, 600_000);
        let key = candidates(&notes)[0].0.clone();
        states[&key] = json!({"delivered":true,"pending":false,"snoozedUntil":1_800_000});
        notes[0]["items"][1]["completionCycle"] = json!(4);
        notes[0]["items"][1]["done"] = json!(false);
        assert_eq!(candidates(&notes)[0].0, key);
        assert!(!advance(&notes, &mut states, 1_799_999));
        assert!(collect(&notes, &states).is_empty());
        assert!(advance(&notes, &mut states, 1_800_000));
        assert_eq!(collect(&notes, &states)[0]["itemId"], "task-a");
    }
    #[test]
    fn changing_reminder_lead_time_reschedules_after_dismissal() {
        let mut notes = vec![note()];
        notes[0]["items"][0]["dueAt"] = json!(7_200_000);
        notes[0]["items"][0]["remindMinutes"] = json!(60);
        let mut states = json!({}); assert!(advance(&notes, &mut states, 3_600_000));
        let old_key = candidates(&notes)[0].0.clone();
        states[&old_key] = json!({"delivered":true,"pending":false,"snoozedUntil":0});
        notes[0]["items"][0]["remindMinutes"] = json!(10);
        assert_ne!(candidates(&notes)[0].0, old_key);
        assert!(!advance(&notes, &mut states, 6_599_999));
        assert!(collect(&notes, &states).is_empty());
        assert!(advance(&notes, &mut states, 6_600_000));
        assert_eq!(collect(&notes, &states).len(), 1);
    }
}
