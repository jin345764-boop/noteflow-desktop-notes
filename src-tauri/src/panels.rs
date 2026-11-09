use super::*;
#[tauri::command]
pub async fn desktop_layout_panel(app:AppHandle)->Result<(),String>{
    if let Some(w)=app.get_webview_window("layout"){w.show().map_err(|e|e.to_string())?;return w.set_focus().map_err(|e|e.to_string());}
    WebviewWindowBuilder::new(&app,"layout",WebviewUrl::App("index.html?layout=1".into())).title("整理布局").inner_size(580.,560.).min_inner_size(500.,480.).center().build().map_err(|e|e.to_string())?;Ok(())
}
#[tauri::command]
pub async fn desktop_task_settings(app:AppHandle,note_id:String,item_id:String)->Result<(),String>{
    let note=desktop_note(app.clone(),note_id.clone())?;
    if !note["items"].as_array().is_some_and(|items|items.iter().any(|i|i["id"]==item_id)){return Err("事项已移除".into());}
    if let Some(w)=app.get_webview_window("tasksettings"){w.destroy().map_err(|e|e.to_string())?;}
    WebviewWindowBuilder::new(&app,"tasksettings",WebviewUrl::App(format!("index.html?task={note_id}&item={item_id}").into())).title("事项设置").inner_size(370.,510.).resizable(false).center().build().map_err(|e|e.to_string())?;Ok(())
}
#[tauri::command]
pub async fn desktop_focus_item(app:AppHandle,note_id:String,item_id:String)->Result<(),String>{
    let note=desktop_note(app.clone(),note_id.clone())?;
    let item=note["items"].as_array().and_then(|items|items.iter().find(|i|i["id"]==item_id)).ok_or("事项已移除")?;
    let old=app.state::<Store>().data.lock().unwrap().preferences["focus"].clone();
    if (!old["deadline"].is_null()||old["elapsed"].as_u64().unwrap_or(0)>0)&&(old["noteId"]!=note_id||old["itemId"]!=item_id){
        controls::desktop_panel(app,None,None,Some(true)).await?;
        return Err("已有专注正在进行，请先结束当前专注再切换事项".into());
    }
    let mut focus=if old.is_object(){old}else{json!({"minutes":25,"remaining":1500,"deadline":null,"elapsed":0,"records":[],"finishedAt":null})};
    focus["noteId"]=json!(note_id);focus["itemId"]=json!(item_id);focus["projectTitle"]=note["title"].clone();focus["itemTitle"]=item["text"].clone();
    controls::desktop_preferences(app.clone(),Some(json!({"focus":focus})))?;
    controls::desktop_panel(app,None,None,Some(true)).await
}
