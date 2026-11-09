use super::*;

fn saved_records(data: &Notes) -> Vec<Value> {
    data.preferences["memoRecords"].as_array().cloned().unwrap_or_default()
}

fn store_record(data: &mut Notes, note_id: &str, now: u64) -> Result<Value, String> {
    let note = data.notes.iter().chain(data.archived.iter()).find(|note| id(note) == note_id && note["isPlainNote"] == true)
        .cloned().ok_or("这篇随手记已不存在".to_string())?;
    let record = json!({"noteId":note_id,"note":note,"savedAt":now});
    let mut records = saved_records(data);
    records.retain(|record| record["noteId"] != note_id);
    records.push(record.clone());
    if !data.preferences.is_object() { data.preferences = json!({}); }
    data.preferences["memoRecords"] = json!(records);
    Ok(record)
}

fn history_entries(data: &Notes) -> Vec<Value> {
    let snapshots: HashMap<String,Value> = saved_records(data).into_iter()
        .filter(|record| record["note"]["isPlainNote"] == true && !id(&record["note"]).is_empty())
        .map(|record| (id(&record["note"]).to_string(),record)).collect();
    let mut notes:HashMap<String,(Value,&str)> = snapshots.iter().map(|(key,record)| (key.clone(),(record["note"].clone(),"record"))).collect();
    for note in data.archived.iter().filter(|note| note["isPlainNote"] == true) { notes.insert(id(note).into(),(note.clone(),"archived")); }
    for note in data.notes.iter().filter(|note| note["isPlainNote"] == true) { notes.insert(id(note).into(),(note.clone(),"desktop")); }
    notes.into_iter().map(|(note_id,(draft,status))| {
        let snapshot=snapshots.get(&note_id);
        let note=snapshot.map(|record|&record["note"]).unwrap_or(&draft);
        let changed=snapshot.is_some() && ["content","richContent","title"].iter().any(|key|note[*key]!=draft[*key]);
        json!({"noteId":note_id,"title":note["title"],"content":note["content"],"richContent":note["richContent"],"note":note,
            "savedAt":snapshot.map(|record|record["savedAt"].clone()),"createdAt":note["createdAt"],"status":status,"saved":snapshot.is_some(),"draftChanged":changed})
    }).collect()
}

#[tauri::command]
pub fn desktop_memo_save(app:AppHandle,note:Value)->Result<(),String>{
    {
        let store=app.state::<Store>();let mut data=store.data.lock().unwrap();
        // The caller first awaits its draft update queue. Capture the persisted note.
        let now=SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as u64;
        store_record(&mut data,id(&note),now)?;
        save(&store,&data)?;
    }
    app.emit("notes-changed",()).map_err(|error|error.to_string())
}

#[tauri::command]
pub fn desktop_memo_list(app:AppHandle)->Vec<Value>{
    history_entries(&app.state::<Store>().data.lock().unwrap())
}

#[tauri::command]
pub async fn desktop_memo_open(app:AppHandle,note_id:String)->Result<(),String>{
    let note={
        let store=app.state::<Store>();let mut data=store.data.lock().unwrap();
        let mut note=if let Some(note)=data.notes.iter().find(|note|id(note)==note_id&&note["isPlainNote"]==true){note.clone()}
            else if let Some(index)=data.archived.iter().position(|note|id(note)==note_id&&note["isPlainNote"]==true){data.archived.remove(index)}
            else {saved_records(&data).into_iter().find(|record|record["noteId"]==note_id&&record["note"]["isPlainNote"]==true)
                .map(|record|record["note"].clone()).ok_or("这篇随手记已不存在")?};
        if note["sizeLocked"]!=true {note["collapsed"]=json!(false);}
        if let Some(index)=data.notes.iter().position(|current|id(current)==note_id){data.notes[index]=note.clone();}else{data.notes.push(note.clone());}
        save(&store,&data)?;note
    };
    open_note(&app,&note)?;
    if let Some(window)=app.get_webview_window(&note_id){let (width,height)=dimensions(&note);window.set_size(LogicalSize::new(width,height)).map_err(|error|error.to_string())?;window.set_focus().map_err(|error|error.to_string())?;}
    app.emit("note-updated",json!({"note":note,"source":"memo-history"})).map_err(|error|error.to_string())?;
    app.emit("notes-changed",()).map_err(|error|error.to_string())
}

#[tauri::command]
pub async fn desktop_memo_history(app:AppHandle,note_id:Option<String>)->Result<(),String>{
    let panels=app.state::<controls::PanelState>();let _guard=panels.0.lock().unwrap();
    if let Some(window)=app.get_webview_window("memo-history"){
        window.emit("memo-history-select",note_id).map_err(|error|error.to_string())?;
        return controls::reveal_panel(&app,&window);
    }
    let selected=note_id.map(|id|format!("&note={id}")).unwrap_or_default();
    let window=WebviewWindowBuilder::new(&app,"memo-history",WebviewUrl::App(format!("index.html?memoHistory=1{selected}").into()))
        .title("随手记记录").inner_size(860.,660.).min_inner_size(640.,480.).center().visible(false).build().map_err(|error|error.to_string())?;
    controls::reveal_panel(&app,&window)
}

#[tauri::command]
pub fn desktop_manager_rename(app:AppHandle,note_id:String,name:String)->Result<(),String>{
    let name=name.trim();if name.is_empty(){return Err("名称不能为空".into());}
    let note={
        let store=app.state::<Store>();let mut data=store.data.lock().unwrap();
        let note=if let Some(index)=data.notes.iter().position(|note|id(note)==note_id){&mut data.notes[index]}
            else if let Some(index)=data.archived.iter().position(|note|id(note)==note_id){&mut data.archived[index]}
            else {return Err("这张便签已不存在".into());};
        if note["isPlainNote"]==true{note["title"]=json!(name);}else{note["headerName"]=json!(name);}
        let note=note.clone();save(&store,&data)?;note
    };
    app.emit("note-updated",json!({"note":note,"source":"manager"})).map_err(|error|error.to_string())?;
    app.emit("notes-changed",()).map_err(|error|error.to_string())
}

#[cfg(test)]
mod tests{
    use super::*;
    fn memo(id:&str,text:&str)->Value{json!({"id":id,"isPlainNote":true,"title":"随手记","content":text,"richContent":format!("<b>{text}</b>"),"createdAt":"1792152000000000000"})}
    #[test]
    fn repeated_save_updates_one_record_and_uses_persisted_draft(){
        let mut data=Notes{notes:vec![memo("note-1","第一版")],..Default::default()};
        store_record(&mut data,"note-1",100).unwrap();data.notes[0]["content"]=json!("第二版");
        store_record(&mut data,"note-1",200).unwrap();
        let entries=history_entries(&data);assert_eq!(entries.len(),1);assert_eq!(entries[0]["content"],"第二版");assert_eq!(entries[0]["savedAt"],200);
        assert_eq!(entries[0]["createdAt"],"1792152000000000000");
    }
    #[test]
    fn existing_active_and_archived_memos_are_not_given_fake_save_dates(){
        let data=Notes{notes:vec![memo("note-a","草稿"),json!({"id":"task","items":[]})],archived:vec![memo("note-b","旧记")],..Default::default()};
        let entries=history_entries(&data);assert_eq!(entries.len(),2);assert!(entries.iter().all(|record|record["savedAt"].is_null()&&record["saved"]==false));
        assert!(entries.iter().any(|record|record["status"]=="archived"));
    }
    #[test]
    fn saved_snapshot_survives_new_draft_and_archiving_without_duplicates(){
        let mut data=Notes{notes:vec![memo("note-a","已保存")],..Default::default()};
        store_record(&mut data,"note-a",100).unwrap();data.notes[0]["content"]=json!("未保存的修改");
        let entries=history_entries(&data);assert_eq!(entries[0]["content"],"已保存");assert_eq!(entries[0]["draftChanged"],true);
        let note=data.notes.remove(0);data.archived.push(note);let entries=history_entries(&data);assert_eq!(entries.len(),1);assert_eq!(entries[0]["status"],"archived");
        data.archived.clear();let entries=history_entries(&data);assert_eq!(entries.len(),1);assert_eq!(entries[0]["status"],"record");
    }
    #[test]
    fn only_existing_memos_can_be_saved(){
        let mut data=Notes::default();assert!(store_record(&mut data,"missing",100).is_err());
        data.notes.push(json!({"id":"task","isPlainNote":false}));assert!(store_record(&mut data,"task",100).is_err());
    }
}
