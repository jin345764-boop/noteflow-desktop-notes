#[tauri::command]
pub fn desktop_dictation(window: tauri::WebviewWindow) -> Result<(), String> {
    window.set_focus().map_err(|error| error.to_string())?;
    #[cfg(windows)]
    {
        use windows_sys::Win32::UI::Input::KeyboardAndMouse::{SendInput, INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, KEYEVENTF_KEYUP, VK_LWIN};
        fn key(code: u16, flags: u32) -> INPUT {
            INPUT { r#type: INPUT_KEYBOARD, Anonymous: INPUT_0 { ki: KEYBDINPUT { wVk: code, wScan: 0, dwFlags: flags, time: 0, dwExtraInfo: 0 } } }
        }
        // Only invoked by the user's microphone button. Windows owns microphone consent and transcription.
        let inputs = [key(VK_LWIN, 0), key(b'H' as u16, 0), key(b'H' as u16, KEYEVENTF_KEYUP), key(VK_LWIN, KEYEVENTF_KEYUP)];
        let sent = unsafe { SendInput(inputs.len() as u32, inputs.as_ptr(), std::mem::size_of::<INPUT>() as i32) };
        if sent != inputs.len() as u32 { return Err("无法打开系统语音输入，请将光标放在输入框内后按 Win + H".into()); }
        Ok(())
    }
    #[cfg(not(windows))]
    { Err("请使用系统提供的语音输入功能".into()) }
}
