import { isTauri } from "@tauri-apps/api/core";

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
  if (isTauri()) {
    const [{ save }, { writeTextFile }] = await Promise.all([
      import("@tauri-apps/plugin-dialog"),
      import("@tauri-apps/plugin-fs"),
    ]);
    const selectedPath = await save({
      defaultPath: filename,
      filters: [{ name: filterName(type), extensions: [fileExtension(filename)] }],
    });
    if (!selectedPath) return false;
    await writeTextFile(selectedPath, content);
    return true;
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return true;
}
