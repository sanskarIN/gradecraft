import { describe, expect, it } from "vitest";
import { applyPlatformEnvironment, detectPlatformFromSignals } from "../src/platform/runtime";

describe("platform runtime detection", () => {
  it("detects an Android native phone", () => {
    expect(
      detectPlatformFromSignals({
        userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel)",
        navigatorPlatform: "Linux armv8l",
        maxTouchPoints: 5,
        viewportWidth: 412,
        coarsePointer: true,
        tauri: true,
      }),
    ).toEqual({
      target: "android",
      runtime: "native",
      formFactor: "phone",
      touch: true,
      standalone: true,
    });
  });

  it("detects iPadOS even when Safari reports MacIntel", () => {
    expect(
      detectPlatformFromSignals({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15",
        navigatorPlatform: "MacIntel",
        maxTouchPoints: 5,
        viewportWidth: 1024,
        coarsePointer: true,
        standalone: true,
      }),
    ).toMatchObject({ target: "ios", runtime: "pwa", formFactor: "tablet", touch: true });
  });

  it("detects a Windows native desktop", () => {
    expect(
      detectPlatformFromSignals({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        navigatorPlatform: "Win32",
        viewportWidth: 1440,
        tauri: true,
      }),
    ).toMatchObject({ target: "windows", runtime: "native", formFactor: "desktop" });
  });

  it("keeps an unknown desktop browser on the web target", () => {
    expect(
      detectPlatformFromSignals({
        userAgent: "CustomBrowser/1.0",
        viewportWidth: 1366,
      }),
    ).toEqual({
      target: "web",
      runtime: "browser",
      formFactor: "desktop",
      touch: false,
      standalone: false,
    });
  });

  it("publishes environment values as root data attributes", () => {
    const root = document.createElement("html");
    applyPlatformEnvironment(
      {
        target: "linux",
        runtime: "native",
        formFactor: "desktop",
        touch: false,
        standalone: true,
      },
      root,
    );

    expect(root.dataset.platform).toBe("linux");
    expect(root.dataset.runtime).toBe("native");
    expect(root.dataset.formFactor).toBe("desktop");
    expect(root.dataset.touch).toBe("false");
    expect(root.dataset.standalone).toBe("true");
  });
});
