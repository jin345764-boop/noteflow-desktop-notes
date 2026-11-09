use super::*;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

fn register(app: &AppHandle, memo: &str, todo: &str) -> Result<(),String> {
    for (key, plain) in [(memo,true),(todo,false)] {
        if key.is_empty() { continue; }
        app.global_shortcut().on_shortcut(key,move |app,_,event| {
            if event.state() != ShortcutState::Pressed { return; }
            let app=app.clone();
            tauri::async_runtime::spawn(async move {
                let template=if plain {Some(json!({"isPlainNote":true,"paperStyle":"cream","title":"随手记","width":320,"height":340,"richContent":"","content":""}))} else {None};
                if let Err(e)=desktop_create(app.clone(),template).await { let _=app.emit("desktop-error",e); }
            });
        }).map_err(|e|format!("无法使用 {key}，可能已被其他应用占用：{e}"))?;
    }
    Ok(())
}
pub fn initialize(app: &AppHandle) {
    let prefs=app.state::<Store>().data.lock().unwrap().preferences.clone();
    let memo=prefs["memoShortcut"].as_str().unwrap_or("Alt+N");
    let todo=prefs["todoShortcut"].as_str().unwrap_or("Alt+D");
    let result=register(app,memo,todo);
    if let Err(e)=result {
        let _=app.global_shortcut().unregister_all();
        let store=app.state::<Store>(); let mut data=store.data.lock().unwrap();
        if !data.preferences.is_object() {data.preferences=json!({});}
        data.preferences["shortcutError"]=json!(e);
    } else {
        let store=app.state::<Store>(); let mut data=store.data.lock().unwrap();
        if data.preferences.is_object() {data.preferences["shortcutError"]=Value::Null;}
    }
}
#[tauri::command]
pub fn desktop_shortcuts(app: AppHandle, memo: String, todo: String) -> Result<(),String> {
    if !memo.is_empty() && memo==todo { return Err("两个快捷键不能相同".into()); }
    let previous=app.state::<Store>().data.lock().unwrap().preferences.clone();
    app.global_shortcut().unregister_all().map_err(|e|e.to_string())?;
    if let Err(e)=register(&app,&memo,&todo) {
        let _=app.global_shortcut().unregister_all();
        let _=register(&app,previous["memoShortcut"].as_str().unwrap_or("Alt+N"),previous["todoShortcut"].as_str().unwrap_or("Alt+D"));
        return Err(e);
    }
    let result=controls::desktop_preferences(app.clone(),Some(json!({"memoShortcut":memo,"todoShortcut":todo,"shortcutError":null})));
    if let Err(e)=result { return Err(e); }
    Ok(())
}
