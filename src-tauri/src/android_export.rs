use std::time::Duration;

#[tauri::command]
pub async fn write_android_content_uri(
    webview: tauri::Webview,
    uri: String,
    content: String,
) -> Result<(), String> {
    #[cfg(target_os = "android")]
    {
        use jni::objects::{JObject, JValue};
        use std::sync::mpsc::sync_channel;

        if !uri.starts_with("content://") {
            return Err("Android export requires a content URI.".to_string());
        }

        let (sender, receiver) = sync_channel(1);
        webview
            .with_webview(move |platform_webview| {
                platform_webview.jni_handle().exec(move |env, activity, _| {
                    let result = (|| -> Result<(), String> {
                        let resolver = env
                            .call_method(
                                activity,
                                "getContentResolver",
                                "()Landroid/content/ContentResolver;",
                                &[],
                            )
                            .map_err(|error| format!("Unable to access Android ContentResolver: {error}"))?
                            .l()
                            .map_err(|error| format!("Invalid Android ContentResolver result: {error}"))?;

                        let uri_string = env
                            .new_string(&uri)
                            .map_err(|error| format!("Unable to encode Android content URI: {error}"))?;
                        let uri_string_object = JObject::from(uri_string);
                        let parsed_uri = env
                            .call_static_method(
                                "android/net/Uri",
                                "parse",
                                "(Ljava/lang/String;)Landroid/net/Uri;",
                                &[JValue::Object(&uri_string_object)],
                            )
                            .map_err(|error| format!("Unable to parse Android content URI: {error}"))?
                            .l()
                            .map_err(|error| format!("Invalid Android Uri result: {error}"))?;

                        let mode = env
                            .new_string("wt")
                            .map_err(|error| format!("Unable to create Android write mode: {error}"))?;
                        let mode_object = JObject::from(mode);
                        let stream = env
                            .call_method(
                                &resolver,
                                "openOutputStream",
                                "(Landroid/net/Uri;Ljava/lang/String;)Ljava/io/OutputStream;",
                                &[
                                    JValue::Object(&parsed_uri),
                                    JValue::Object(&mode_object),
                                ],
                            )
                            .map_err(|error| format!("Unable to open Android export stream: {error}"))?
                            .l()
                            .map_err(|error| format!("Invalid Android output stream result: {error}"))?;

                        if stream.as_raw().is_null() {
                            return Err("Android document provider returned no output stream.".to_string());
                        }

                        let bytes = env
                            .byte_array_from_slice(content.as_bytes())
                            .map_err(|error| format!("Unable to encode Android export bytes: {error}"))?;
                        let bytes_object = JObject::from(bytes);

                        env.call_method(
                            &stream,
                            "write",
                            "([B)V",
                            &[JValue::Object(&bytes_object)],
                        )
                        .map_err(|error| format!("Unable to write Android export: {error}"))?;
                        env.call_method(&stream, "flush", "()V", &[])
                            .map_err(|error| format!("Unable to flush Android export: {error}"))?;
                        env.call_method(&stream, "close", "()V", &[])
                            .map_err(|error| format!("Unable to close Android export: {error}"))?;

                        Ok(())
                    })();

                    let _ = sender.send(result);
                });
            })
            .map_err(|error| format!("Unable to access the Android webview: {error}"))?;

        return receiver
            .recv_timeout(Duration::from_secs(15))
            .map_err(|_| "Timed out while saving the Android export.".to_string())?;
    }

    #[cfg(not(target_os = "android"))]
    {
        let _ = (webview, uri, content, Duration::from_secs(0));
        Err("Android content URI export is unavailable on this platform.".to_string())
    }
}
