use super::*;

pub fn play(app: &AppHandle) {
    if app.state::<Store>().data.lock().unwrap().preferences["soundEnabled"] == false { return; }
    #[cfg(windows)]
    {
        use windows_sys::Win32::Media::Audio::{PlaySoundW, SND_ASYNC, SND_MEMORY, SND_NODEFAULT};
        // The async memory buffer must remain alive until playback ends.
        static SOUND: &[u8] = include_bytes!("../sounds/new-note.wav");
        unsafe { PlaySoundW(SOUND.as_ptr().cast(), std::ptr::null_mut(), SND_MEMORY | SND_ASYNC | SND_NODEFAULT); }
    }
}
