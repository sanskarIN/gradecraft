import { isTauri } from "@tauri-apps/api/core";

const WINDOWS_RESERVED_NAME = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;
const MAX_FILENAME_LENGTH = 180;

export function sanitizeDownloadFilename(filename: string): string {
  const cleaned = filename
    .trim()
    .replace(/[\u0000-\u001f<>:"/\\|?*]/g, "_")
    .replace(/[. ]+$/g, "");
  const withFallback = cleaned || "gradecraft-export.txt";
  const withSafeDeviceName = WINDOWS_RESERVED_NAME.test(withFallback) ? `_${withFallback}` : withFallback;
  if (withSafeDeviceName.length <= MAX_FILENAME_LENGTH) return withSafeDeviceName;

  const separator = withSafeDeviceName.lastIndexOf(".");
  if (separator > 0) {
    const extension = withSafeDeviceName.slice(separator);
    const stemLength = Math.max(1, MAX_FILENAME_LENGTH - extension.length);
    return `${withSafeDeviceName.slice(0, stemLength)}${extension.slice(0, MAX_FILENAME_LENGTH - stemLength)}`;
  }
  return withSafeDeviceName.slice(0, MAX_FILENAME_LENGTH);
}

function fileExtension(filename: string): string {
  const separator = filename.lastIndexOf(".");
  return separator >= 0 && separator < filename.length - 1 ? filename.slice(separator + 1) : "txt";
}

function filterName(type: string): string {
  if (type.includes("csv")) return "CSV";
  if (type.includes("json")) return "JSON";
  return "Text";
}

export async function downloadText(filename: string, content: string, type = "text/plain"): Promise<boolean> {
  const safeFilename = sanitizeDownloadFilename(filename);
  if (isTauri()) {
    const [{ save }, { writeTextFile }] = await Promise.all([
      import("@tauri-apps/plugin-dialog"),
      import("@tauri-apps/plugin-fs"),
    ]);
    const selectedPath = await save({
      defaultPath: safeFilename,
      filters: [{ name: filterName(type), extensions: [fileExtension(safeFilename)] }],
    });
    if (!selectedPath) return false;
    await writeTextFile(selectedPath, content);
    return true;
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeFilename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return true;
}
