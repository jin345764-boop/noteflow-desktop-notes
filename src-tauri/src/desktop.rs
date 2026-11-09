use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{collections::HashMap, fs, path::PathBuf, sync::Mutex, time::{SystemTime, UNIX_EPOCH}};
use tauri::{AppHandle, Emitter, LogicalSize, Manager, PhysicalPosition, WebviewUrl, WebviewWindowBuilder};
#[path = "controls.rs"]
mod controls;
#[path = "journal.rs"]
mod journal;
#[path = "shortcuts.rs"]
mod shortcuts;
#[path="layout.rs"] mod layout;
#[path="reminders.rs"] mod reminders;
#[path="voice.rs"] mod voice;
#[path="creation_sound.rs"] mod creation_sound;
#[path="panels.rs"] mod panels;
#[path="memo.rs"] mod memo;

#[derive(Default, Clone, Serialize, Deserialize)]
struct Notes {
    notes: Vec<Value>,
    archived: Vec<Value>,
    positions: HashMap<String, [i32; 2]>,
    #[serde(default)]
    preferences: Value,
    #[serde(default)]
    completions: Vec<Value>,
}
struct DragGroup { leader: String, origin: [i32;2], peers: HashMap<String,[i32;2]> }
struct Store { data: Mutex<Notes>, selected: Mutex<Vec<String>>, drag: Mutex<Option<DragGroup>>, toolbar_home: Mutex<Option<[i32;2]>>, path: PathBuf }
fn save(store: &Store, data: &Notes) -> Result<(), String> {
    let bytes = serde_json::to_vec_pretty(data).map_err(|e| e.to_string())?;
    if store.path.exists() {
        fs::copy(&store.path, store.path.with_extension("json.bak")).map_err(|e| e.to_string())?;
    }
    let temporary = store.path.with_extension("json.tmp");
    fs::write(&temporary, bytes).map_err(|e| e.to_string())?;
    fs::rename(temporary, &store.path).map_err(|e| e.to_string())
}
fn id(note: &Value) -> &str { note["id"].as_str().unwrap_or("") }
fn checklist(note: &Value) -> bool { note["isPlainNote"] != true && (note["format"].is_null() || note["format"] == "checklist") }
fn minimum_height(note: &mut Value) -> bool {
    if checklist(note) && note["sizeLocked"] != true && note["height"].as_f64().unwrap_or(220.0) < 280.0 {
        note["height"] = json!(280); return true;
    }
    false
}
fn migrate_notes(data: &mut Notes) -> bool {
    let mut changed = false;
    for note in data.notes.iter_mut().chain(data.archived.iter_mut()) {
        if note["theme"] == "folder" { note["theme"] = json!("minimal"); changed = true; }
    }
    for note in &mut data.notes { changed |= minimum_height(note); }
    changed
}
fn dimensions(note: &Value) -> (f64, f64) {
    let width = note["width"].as_f64().unwrap_or(260.0).clamp(220.0, 600.0);
    let collapsed = note["collapsed"].as_bool().unwrap_or(false);
    let top = 4.0;
    let minimum = if checklist(note) && note["sizeLocked"] != true { 280.0 } else { 160.0 };
    let fallback_height = if checklist(note) && note["sizeLocked"] != true { 280.0 } else { 220.0 };
    let height = if collapsed { 32.0 } else { note["height"].as_f64().unwrap_or(fallback_height).clamp(minimum, 750.0) };
    (width + 8.0, height + top + 4.0)
}
fn update_launcher(app: &AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        main.show().map_err(|e| e.to_string())?;
    }
    Ok(())
}
fn open_note(app: &AppHandle, note: &Value) -> Result<(), String> {
    let label = id(note).to_string();
    if let Some(window) = app.get_webview_window(&label) { return window.show().map_err(|e| e.to_string()); }
    let (width, height) = dimensions(note);
    let monitor = app.primary_monitor().map_err(|e| e.to_string())?.ok_or("No monitor")?;
    let area = monitor.work_area();
    let scale = monitor.scale_factor();
    let store = app.state::<Store>();
    let data = store.data.lock().unwrap();
    let index = data.notes.iter().position(|n| id(n) == label).unwrap_or(0);
    let rows = ((area.size.height as f64 / scale - 24.0) / 250.0).floor().max(1.0) as usize;
    let fallback = [area.position.x + area.size.width as i32 - ((width + 12.0 + (index / rows) as f64 * 280.0) * scale) as i32,
        area.position.y + ((68.0 + (index % rows) as f64 * 250.0) * scale) as i32];
    let saved = data.positions.get(&label).copied().unwrap_or(fallback);
    drop(data);
    let monitors = app.available_monitors().map_err(|e| e.to_string())?;
    let target = monitors.iter().find(|m| {
        let a = m.work_area();
        saved[0] >= a.position.x && saved[1] >= a.position.y && saved[0] < a.position.x + a.size.width as i32 && saved[1] < a.position.y + a.size.height as i32
    }).unwrap_or(&monitor);
    let a = target.work_area();
    let x = saved[0].clamp(a.position.x, (a.position.x + a.size.width as i32 - (width * target.scale_factor()) as i32).max(a.position.x));
    let mut y = saved[1].clamp(a.position.y, (a.position.y + a.size.height as i32 - (height * target.scale_factor()) as i32).max(a.position.y));
    if let Some(main) = app.get_webview_window("main").filter(|_| note["sizeLocked"] != true) {
        let p = main.outer_position().map_err(|e| e.to_string())?;
        let s = main.outer_size().map_err(|e| e.to_string())?;
        if x < p.x + s.width as i32 && x + (width * target.scale_factor()) as i32 > p.x && y < p.y + s.height as i32 && y + (32.0 * target.scale_factor()) as i32 > p.y {
            let gap = (8.0 * target.scale_factor()).round() as i32;
            let below = p.y + s.height as i32 + gap;
            y = if below + (height * target.scale_factor()).round() as i32 <= a.position.y + a.size.height as i32 { below }
                else { (p.y - (height * target.scale_factor()).round() as i32 - gap).max(a.position.y) };
        }
    }
    let window = WebviewWindowBuilder::new(app, &label, WebviewUrl::App(format!("index.html?note={label}").into()))
        .title(note["title"].as_str().unwrap_or("便利贴"))
        .inner_size(width, height).decorations(false).transparent(true).shadow(false)
        .resizable(false).skip_taskbar(true).visible(false)
        .always_on_top(note["pinned"].as_bool().unwrap_or(false)).build().map_err(|e| e.to_string())?;
    window.set_position(PhysicalPosition::new(x, y)).map_err(|e| e.to_string())?;
    window.show().map_err(|e| e.to_string())
}
#[tauri::command]
async fn desktop_init(app: AppHandle, legacy: Vec<Value>) -> Result<(), String> {
    let notes = {
        let store = app.state::<Store>();
        let mut data = store.data.lock().unwrap();
        if !store.path.exists() {
            data.notes = legacy.into_iter().filter(|n| id(n).starts_with("note-")).collect();
            for note in &mut data.notes { note["width"] = json!(260); if note["isPlainNote"] != true { note["height"] = json!(280); } }
            migrate_notes(&mut data);
            save(&store, &data)?;
        }
        data.notes.clone()
    };
    for note in notes { open_note(&app, &note)?; }
    let shortcut_error = { app.state::<Store>().data.lock().unwrap().preferences["shortcutError"].is_string() };
    if shortcut_error {
        controls::desktop_panel(app.clone(), None, None, None).await?;
    }
    update_launcher(&app)
}
#[tauri::command]
fn desktop_note(app: AppHandle, note_id: String) -> Result<Value, String> {
    app.state::<Store>().data.lock().unwrap().notes.iter().find(|n| id(n) == note_id).cloned().ok_or("Note not found".into())
}
#[tauri::command]
async fn desktop_create(app: AppHandle, template: Option<Value>) -> Result<(), String> {
    let stamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();
    let mut note = json!({"id": format!("note-{stamp}"), "title": "新便签", "theme": "minimal", "category": "work",
        "items": [], "x": 0, "y": 0, "width": 260, "height": 280, "zIndex": 1,
        "pinned": false, "collapsed": false, "opacity": 1, "borderRadius": 12,
        "fontSize": "base", "fontFamily": "sans", "sticker": "none", "hideSpeechBubble": true,
        "washiTape": false, "customBgColor": "#ffffff", "customTextColor": "#343a40",
        "customAccentColor": "#879b8b", "createdAt": stamp.to_string()});
    if let Some(template) = template {
        for (key,value) in template.as_object().ok_or("Invalid theme template")? {
            if key != "id" && key != "createdAt" { note[key] = value.clone(); }
        }
        if note.get("customBgColor").is_none() || template.get("customBgColor").is_none() {
            note.as_object_mut().unwrap().remove("customBgColor");
            note.as_object_mut().unwrap().remove("customTextColor");
            note.as_object_mut().unwrap().remove("customAccentColor");
        }
    }
    if note["isPlainNote"] != true && note["height"].as_f64().unwrap_or(280.0) < 280.0 { note["height"] = json!(280); }
    { let store = app.state::<Store>(); let mut data = store.data.lock().unwrap(); data.notes.push(note.clone());
        if let Ok(cursor)=app.cursor_position() {
            data.positions.insert(id(&note).into(),[cursor.x as i32+12,cursor.y as i32+12]);
        }
        save(&store, &data)?; }
    open_note(&app, &note)?;
    creation_sound::play(&app);
    if let Some(window) = app.get_webview_window(id(&note)) { let _ = window.set_focus(); }
    app.emit("notes-changed", ()).map_err(|e| e.to_string())?;
    update_launcher(&app)
}
#[tauri::command]
async fn desktop_update(app: AppHandle, window: tauri::WebviewWindow, note: Value) -> Result<(), String> {
    let (previous, note) = {
        let store = app.state::<Store>(); let mut data = store.data.lock().unwrap();
        let target = data.notes.iter_mut().find(|n| id(n) == id(&note)).ok_or("Note not found")?;
        let previous = target.clone();
        for (key, value) in note.as_object().ok_or("Invalid note changes")? {
            if (key == "width" || key == "height" || key == "collapsed") && previous["sizeLocked"] == true && note["sizeLocked"] != false { continue; }
            target[key] = value.clone();
        }
        minimum_height(target);
        let note = target.clone();
        let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as u64;
        journal::record_changes(&mut data.completions, &previous, &note, now);
        save(&store, &data)?;
        (previous, note)
    };
    if let Some(window) = app.get_webview_window(id(&note)) {
        let (width, height) = dimensions(&note);
        if dimensions(&previous) != (width, height) {
            window.set_size(LogicalSize::new(width, height)).map_err(|e| e.to_string())?;
            if note["sizeLocked"] != true {
                if let Some(monitor) = window.current_monitor().map_err(|e| e.to_string())? {
                    let area = monitor.work_area(); let point = window.outer_position().map_err(|e| e.to_string())?; let scale = monitor.scale_factor();
                    let x = point.x.clamp(area.position.x, (area.position.x + area.size.width as i32 - (width * scale).round() as i32).max(area.position.x));
                    let y = point.y.clamp(area.position.y, (area.position.y + area.size.height as i32 - (height * scale).round() as i32).max(area.position.y));
                    window.set_position(PhysicalPosition::new(x,y)).map_err(|e| e.to_string())?;
                }
            }
        }
        if previous["pinned"] != note["pinned"] { window.set_always_on_top(note["pinned"].as_bool().unwrap_or(false)).map_err(|e| e.to_string())?; }
        if previous["title"] != note["title"] { window.set_title(note["title"].as_str().unwrap_or("便利贴")).map_err(|e| e.to_string())?; }
    }
    app.emit("note-updated", json!({"note":note,"source":window.label()})).map_err(|e| e.to_string())?;
    app.emit("notes-changed", ()).map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
async fn desktop_archive(app: AppHandle, note_id: String) -> Result<(), String> {
    {
        let store = app.state::<Store>(); let mut data = store.data.lock().unwrap();
        if let Some(index) = data.notes.iter().position(|n| id(n) == note_id) {
            let note = data.notes.remove(index); data.archived.push(note); save(&store, &data)?;
        }
    }
    if let Some(window) = app.get_webview_window(&note_id) { window.destroy().map_err(|e| e.to_string())?; }
    if let Some(window) = app.get_webview_window(&format!("settings-{note_id}")) { window.destroy().map_err(|e| e.to_string())?; }
    app.state::<Store>().selected.lock().unwrap().retain(|label| label != &note_id);
    app.emit("selection-changed", app.state::<Store>().selected.lock().unwrap().clone()).map_err(|e| e.to_string())?;
    app.emit("notes-changed", ()).map_err(|e| e.to_string())?;
    update_launcher(&app)
}
async fn show_notes(app: AppHandle) -> Result<(), String> {
    let notes = app.state::<Store>().data.lock().unwrap().notes.clone();
    for note in notes { open_note(&app, &note)?; if let Some(w) = app.get_webview_window(id(&note)) { let _ = w.set_focus(); } }
    update_launcher(&app)
}
async fn restore_note(app: AppHandle) -> Result<(), String> {
    let note = {
        let store = app.state::<Store>(); let mut data = store.data.lock().unwrap();
        let mut note = data.archived.pop();
        if let Some(ref mut note) = note { minimum_height(note); }
        if let Some(ref note) = note { data.notes.push(note.clone()); save(&store, &data)?; }
        note
    };
    if let Some(note) = note { open_note(&app, &note)?; }
    app.emit("notes-changed", ()).map_err(|e| e.to_string())?;
    update_launcher(&app)
}
#[tauri::command]
fn desktop_exit(app: AppHandle) { app.exit(0); }

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            let app = app.clone(); tauri::async_runtime::spawn(async move { let _ = show_notes(app).await; });
        }))
        .setup(|app| {
            let directory = app.path().app_data_dir()?; fs::create_dir_all(&directory)?;
            let path = directory.join("desktop-notes.json");
            let mut data = if path.exists() { serde_json::from_slice(&fs::read(&path)?)? } else { Notes::default() };
            let migrated = migrate_notes(&mut data);
            app.manage(Store { data: Mutex::new(data), selected: Mutex::new(vec![]), drag: Mutex::new(None), toolbar_home: Mutex::new(None), path });
            if migrated { let store = app.state::<Store>(); let data = store.data.lock().unwrap(); save(&store,&data).map_err(std::io::Error::other)?; }
            if let (Some(main), Some(monitor)) = (app.get_webview_window("main"), app.primary_monitor()?) {
                let area = monitor.work_area();
                main.set_size(LogicalSize::new(560.0,44.0))?;
                let saved = app.state::<Store>().data.lock().unwrap().positions.get("main").copied();
                let mut position = saved.unwrap_or([area.position.x + area.size.width as i32 - (562.0 * monitor.scale_factor()) as i32, area.position.y + 12]);
                position[0] = position[0].clamp(area.position.x, (area.position.x + area.size.width as i32 - (560.0 * monitor.scale_factor()) as i32).max(area.position.x));
                position[1] = position[1].clamp(area.position.y, (area.position.y + area.size.height as i32 - (44.0 * monitor.scale_factor()) as i32).max(area.position.y));
                main.set_position(PhysicalPosition::new(position[0], position[1]))?;
            }
            app.manage(layout::LayoutState::default());
            app.manage(controls::PanelState::default());
            reminders::initialize(app.handle());
            shortcuts::initialize(app.handle());
            use tauri::{menu::{Menu, MenuItem}, tray::TrayIconBuilder};
            let new = MenuItem::with_id(app, "new", "新建便签", true, None::<&str>)?;
            let show = MenuItem::with_id(app, "show", "显示全部便签", true, None::<&str>)?;
            let restore = MenuItem::with_id(app, "restore", "恢复最近关闭的便签", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let manage = MenuItem::with_id(app, "manage", "管理与恢复便签", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&new, &show, &manage, &restore, &quit])?;
            TrayIconBuilder::new().icon(app.default_window_icon().unwrap().clone()).tooltip("阿金便利贴").menu(&menu)
                .on_menu_event(|app, event| {
                    let app = app.clone(); let action = event.id.as_ref().to_string();
                    tauri::async_runtime::spawn(async move {
                        let result = match action.as_str() {
                            "new" => desktop_create(app.clone(), None).await,
                            "show" => show_notes(app.clone()).await,
                            "manage" => controls::desktop_panel(app.clone(), None, None, None).await,
                            "restore" => restore_note(app.clone()).await,
                            "quit" => { app.exit(0); Ok(()) }, _ => Ok(()),
                        };
                        if let Err(error) = result { let _ = app.emit("desktop-error", error); }
                    });
                }).build(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Moved(position) = event { controls::moved(window, [position.x, position.y]); }
            if let tauri::WindowEvent::CloseRequested { api, .. } = event { api.prevent_close(); let _ = window.hide(); }
        })
        .invoke_handler(tauri::generate_handler![desktop_init, desktop_note, desktop_create, desktop_update, desktop_archive, desktop_exit,
            controls::desktop_panel, controls::desktop_close_panel, controls::desktop_toolbar,
            controls::desktop_list, controls::desktop_restore, controls::desktop_visibility, controls::desktop_align,
            controls::desktop_begin_selection, controls::desktop_finish_selection, controls::desktop_cancel_selection,
            controls::desktop_selection, controls::desktop_toggle_selection, controls::desktop_drag,
            controls::desktop_preferences, journal::desktop_calendar, shortcuts::desktop_shortcuts,
            layout::desktop_layout,layout::desktop_layout_info,layout::desktop_undo_layout,layout::desktop_show_notes,
            reminders::desktop_reminder_list,reminders::desktop_reminder_snooze,reminders::desktop_reminder_dismiss,
            voice::desktop_dictation,panels::desktop_layout_panel,panels::desktop_task_settings,panels::desktop_focus_item,
            memo::desktop_memo_save,memo::desktop_memo_list,memo::desktop_memo_open,memo::desktop_memo_history,memo::desktop_manager_rename])
        .run(tauri::generate_context!()).expect("error while running NoteFlow");
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn collapse_releases_desktop_space() {
        let mut note = json!({"width":260,"height":220,"sticker":"none"});
        assert_eq!(dimensions(&note), (268.0, 288.0));
        note["collapsed"] = json!(true);
        assert_eq!(dimensions(&note), (268.0, 40.0));
    }
    #[test]
    fn separate_notes_and_positions_persist() {
        let original = Notes { notes: vec![json!({"id":"note-a","title":"A"}),json!({"id":"note-b","title":"B"})], archived: vec![], positions: HashMap::from([("note-a".into(), [100,200])]), preferences: Value::Null, completions: vec![] };
        let restored: Notes = serde_json::from_slice(&serde_json::to_vec(&original).unwrap()).unwrap();
        assert_eq!(restored.notes, original.notes);
        assert_eq!(restored.positions["note-a"], [100,200]);
    }
    #[test]
    fn startup_migration_preserves_locked_quick_notes_and_completion_history() {
        let locked = json!({"id":"locked","theme":"grid","height":220,"sizeLocked":true,"items":[{"id":"a","done":true}]});
        let quick = json!({"id":"quick","isPlainNote":true,"height":200,"theme":"minimal","richContent":"<p>Keep</p>"});
        let archive = json!({"id":"archived","theme":"folder","title":"Keep","height":220,"customBgColor":"#123456","items":[{"id":"b","done":true}]});
        let mut data = Notes { notes:vec![json!({"id":"todo","theme":"folder","height":220}),locked.clone(),quick.clone()], archived:vec![archive.clone()], completions:vec![json!({"itemId":"a","completedAt":1000})], ..Notes::default() };
        assert!(migrate_notes(&mut data));
        assert_eq!(data.notes[0]["height"],280);
        assert_eq!(data.notes[0]["theme"],"minimal");
        assert_eq!(data.notes[1],locked);
        assert_eq!(data.notes[2],quick);
        let mut expected = archive; expected["theme"] = json!("minimal");
        assert_eq!(data.archived[0],expected);
        assert_eq!(data.completions[0]["completedAt"],1000);
        assert!(!migrate_notes(&mut data));
    }
    #[test]
    fn version_12_data_loads_without_preferences_and_keeps_notes() {
        let legacy = br#"{"notes":[{"id":"note-old","title":"Keep me"}],"archived":[],"positions":{"note-old":[42,84]}}"#;
        let mut restored: Notes = serde_json::from_slice(legacy).unwrap();
        assert_eq!(restored.notes[0]["title"], "Keep me");
        assert_eq!(restored.positions["note-old"], [42,84]);
        restored.preferences = json!({"lang":"en","soundEnabled":false,"title":"My notes"});
        let upgraded: Notes = serde_json::from_slice(&serde_json::to_vec(&restored).unwrap()).unwrap();
        assert_eq!(upgraded.preferences["lang"], "en");
        assert_eq!(upgraded.notes, restored.notes);
    }
    #[test]
    fn saving_empty_notes_does_not_restore_examples() {
        let stamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();
        let path = std::env::temp_dir().join(format!("noteflow-test-{stamp}.json"));
        let store = Store { data: Mutex::new(Notes::default()), selected: Mutex::new(vec![]), drag: Mutex::new(None), toolbar_home: Mutex::new(None), path: path.clone() };
        let mut data = Notes::default();
        data.notes.push(json!({"id":"note-test","title":"My note"}));
        save(&store, &data).unwrap();
        data.archived.push(data.notes.pop().unwrap());
        save(&store, &data).unwrap();
        let restored: Notes = serde_json::from_slice(&fs::read(&path).unwrap()).unwrap();
        assert!(restored.notes.is_empty());
        assert_eq!(restored.archived[0]["title"], "My note");
        fs::remove_file(&path).unwrap();
        fs::remove_file(path.with_extension("json.bak")).unwrap();
    }
}
