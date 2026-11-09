use super::*;

pub fn record_changes(records: &mut Vec<Value>, previous: &Value, next: &Value, now: u64) {
    if next["isPlainNote"] == true { return; }
    for item in next["items"].as_array().into_iter().flatten() {
        let old = previous["items"].as_array().and_then(|items| items.iter().find(|old| old["id"] == item["id"]));
        let cycle = item["completionCycle"].as_u64().unwrap_or_else(|| next["taskCycle"].as_u64().unwrap_or(0));
        if old.is_some_and(|old| old["completionCycle"].as_u64().unwrap_or_else(|| previous["taskCycle"].as_u64().unwrap_or(0)) != cycle) { continue; }
        if old.is_some_and(|old| old["done"] == item["done"]) || (old.is_none() && item["done"] != true) { continue; }
        if item["done"] == true {
            records.push(json!({"noteId": next["id"], "itemId": item["id"], "cycle":cycle,
                "project":next["title"], "text":item["text"], "theme":next["theme"], "completedAt":now}));
        } else {
            records.retain(|record| !(record["noteId"] == next["id"] && record["itemId"] == item["id"] && record["cycle"].as_u64().unwrap_or(0) == cycle));
        }
    }
}

#[tauri::command]
pub async fn desktop_calendar(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("calendar") {
        window.show().map_err(|e|e.to_string())?;
        return window.set_focus().map_err(|e|e.to_string());
    }
    WebviewWindowBuilder::new(&app,"calendar",WebviewUrl::App("index.html?calendar=1".into()))
        .title("完成日历").inner_size(880.,720.).min_inner_size(700.,580.).center()
        .build().map_err(|e|e.to_string())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn completions_keep_snapshot_and_survive_daily_reset() {
        let a=json!({"id":"note-1","title":"Project","items":[{"id":"a","text":"Review","done":false}]});
        let mut b=a.clone(); b["items"][0]["done"]=json!(true);
        let mut records=vec![]; record_changes(&mut records,&a,&b,1000);
        assert_eq!(records.len(),1);
        let mut c=b.clone(); c["title"]=json!("Renamed"); record_changes(&mut records,&b,&c,2000);
        assert_eq!(records[0]["project"],"Project");
        c["taskCycle"]=json!(1); c["items"][0]["done"]=json!(false);
        record_changes(&mut records,&b,&c,3000); assert_eq!(records.len(),1);
        let mut d=c.clone(); d["items"][0]["done"]=json!(true);
        record_changes(&mut records,&c,&d,4000); assert_eq!(records.len(),2);
        record_changes(&mut records,&d,&c,5000); assert_eq!(records.len(),1);
    }
    #[test]
    fn typing_and_new_unfinished_items_do_not_create_completions() {
        let a=json!({"id":"note-1","items":[]});
        let b=json!({"id":"note-1","items":[{"id":"a","text":"x","done":false}]});
        let mut records=vec![]; record_changes(&mut records,&a,&b,0); assert!(records.is_empty());
    }
    #[test]
    fn first_habit_check_creates_one_record() {
        let a=json!({"id":"note-1","title":"喝水","items":[]});
        let b=json!({"id":"note-1","title":"喝水","items":[{"id":"day-1","text":"喝水","done":true}]});
        let mut records=vec![];record_changes(&mut records,&a,&b,1000);
        assert_eq!(records.len(),1);
        record_changes(&mut records,&b,&b,2000);assert_eq!(records.len(),1);
    }
    #[test]
    fn scoped_resets_keep_other_days_and_weeks_reversible() {
        for (format, first, second) in [("timeline", "2026-10-16", "2026-10-17"), ("weekly", "2026-10-05", "2026-10-12"), ("habitMonth", "2026-09-01", "2026-10-01")] {
            let a = json!({"id":"note-1","format":format,"taskCycle":3,"items":[
                {"id":"old","text":"Earlier period","day":first,"done":false},
                {"id":"current","text":"Current period","day":second,"done":false}
            ]});
            let mut b = a.clone(); b["items"][0]["done"] = json!(true); b["items"][1]["done"] = json!(true);
            let mut records = vec![]; record_changes(&mut records, &a, &b, 1000);
            let mut reset = b.clone(); reset["items"][1]["done"] = json!(false); reset["items"][1]["completionCycle"] = json!(4);
            record_changes(&mut records, &b, &reset, 2000);
            assert_eq!(records.len(), 2, "{format}: reset preserves previous completions");
            let mut undone = reset.clone(); undone["items"][0]["done"] = json!(false);
            record_changes(&mut records, &reset, &undone, 3000);
            assert_eq!(records.len(), 1, "{format}: previous period can still undo its original completion");
            assert_eq!(records[0]["itemId"], "current");
            assert_eq!(records[0]["cycle"], 3);
        }
    }
    #[test]
    fn individual_cycle_preserves_history_and_undoes_only_new_completion() {
        let a = json!({"id":"note-1","items":[{"id":"a","text":"Task","done":false}]});
        let mut b = a.clone(); b["items"][0]["done"] = json!(true);
        let mut records = vec![]; record_changes(&mut records, &a, &b, 1000);
        let mut reset = b.clone(); reset["items"][0]["completionCycle"] = json!(1); reset["items"][0]["done"] = json!(false);
        record_changes(&mut records, &b, &reset, 2000);
        let mut complete = reset.clone(); complete["items"][0]["done"] = json!(true);
        record_changes(&mut records, &reset, &complete, 3000);
        assert_eq!(records.len(), 2);
        record_changes(&mut records, &complete, &reset, 4000);
        assert_eq!(records.len(), 1);
        assert_eq!(records[0]["cycle"], 0);
        assert_eq!(records[0]["completedAt"], 1000);
    }
}
