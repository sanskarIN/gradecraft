import { isTauri } from "@tauri-apps/api/core";

export type PlatformTarget = "web" | "windows" | "macos" | "linux" | "android" | "ios" | "unknown";
export type PlatformRuntime = "browser" | "pwa" | "native";
export type FormFactor = "phone" | "tablet" | "desktop";

export interface PlatformSignals {
  userAgent: string;
  navigatorPlatform?: string;
  maxTouchPoints?: number;
  viewportWidth?: number;
  coarsePointer?: boolean;
  standalone?: boolean;
  tauri?: boolean;
}

export interface PlatformEnvironment {
  target: PlatformTarget;
  runtime: PlatformRuntime;
  formFactor: FormFactor;
  touch: boolean;
  standalone: boolean;
}

function detectTarget(signals: PlatformSignals): PlatformTarget {
  const agent = signals.userAgent.toLowerCase();
  const platform = (signals.navigatorPlatform ?? "").toLowerCase();
  const touchPoints = signals.maxTouchPoints ?? 0;

  if (agent.includes("android")) return "android";
  if (/iphone|ipad|ipod/.test(agent) || (platform === "macintel" && touchPoints > 1)) return "ios";
  if (agent.includes("windows") || platform.startsWith("win")) return "windows";
  if (/macintosh|mac os x/.test(agent) || platform.startsWith("mac")) return "macos";
  if (/linux|x11/.test(agent) || platform.includes("linux")) return "linux";
  return signals.tauri ? "unknown" : "web";
}

function detectFormFactor(target: PlatformTarget, signals: PlatformSignals): FormFactor {
  const width = signals.viewportWidth ?? 1280;
  const touch = (signals.maxTouchPoints ?? 0) > 0 || Boolean(signals.coarsePointer);

  if (target === "android" || target === "ios") return width >= 768 ? "tablet" : "phone";
  if (["windows", "macos", "linux"].includes(target) && signals.tauri) return "desktop";
  if (touch && width < 768) return "phone";
  if (touch && width <= 1180) return "tablet";
  return "desktop";
}

export function detectPlatformFromSignals(signals: PlatformSignals): PlatformEnvironment {
  const target = detectTarget(signals);
  const standalone = Boolean(signals.standalone || signals.tauri);
  const runtime: PlatformRuntime = signals.tauri ? "native" : signals.standalone ? "pwa" : "browser";

  return {
    target,
    runtime,
    formFactor: detectFormFactor(target, signals),
    touch: (signals.maxTouchPoints ?? 0) > 0 || Boolean(signals.coarsePointer),
    standalone,
  };
}

export function readPlatformEnvironment(): PlatformEnvironment {
  const media = typeof window.matchMedia === "function" ? window.matchMedia.bind(window) : undefined;
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };

  return detectPlatformFromSignals({
    userAgent: navigator.userAgent,
    navigatorPlatform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
    viewportWidth: window.innerWidth,
    coarsePointer: media?.("(pointer: coarse)").matches ?? false,
    standalone: Boolean(navigatorWithStandalone.standalone || media?.("(display-mode: standalone)").matches),
    tauri: isTauri(),
  });
}

export function applyPlatformEnvironment(
  environment: PlatformEnvironment,
  root: HTMLElement = document.documentElement,
): void {
  root.dataset.platform = environment.target;
  root.dataset.runtime = environment.runtime;
  root.dataset.formFactor = environment.formFactor;
  root.dataset.touch = String(environment.touch);
  root.dataset.standalone = String(environment.standalone);
}

export function initializePlatformEnvironment(): PlatformEnvironment {
  const environment = readPlatformEnvironment();
  applyPlatformEnvironment(environment);
  return environment;
}
