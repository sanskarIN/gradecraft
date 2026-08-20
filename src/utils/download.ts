import { isTauri } from "@tauri-apps/api/core";

const WINDOWS_RESERVED_NAME=/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;
const INVALID_FILENAME_CHARACTERS=/[\u0000-\u001f<>:"/\\|?*]/g;

export function sanitizeDownloadFilename(filename:string):string{
  const normalized=filename.normalize("NFC").replace(INVALID_FILENAME_CHARACTERS,"-").replace(/-+/g,"-").trim().replace(/^[. ]+/g,"").replace(/[. ]+$/g,"");
  const safeBase=normalized||"gradecraft-export";
  const reservedSafe=WINDOWS_RESERVED_NAME.test(safeBase)?`_${safeBase}`:safeBase;
  const separator=reservedSafe.lastIndexOf(".");
  if(separator<=0||separator===reservedSafe.length-1)return reservedSafe.slice(0,180)||"gradecraft-export";
  const extension=reservedSafe.slice(separator);
  const stem=reservedSafe.slice(0,separator).slice(0,Math.max(1,180-extension.length));
  return `${stem}${extension}`;
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
  const safeFilename=sanitizeDownloadFilename(filename);
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
