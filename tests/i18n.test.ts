import { describe,expect,it } from "vitest";
import { en } from "../src/i18n/en";
import { hi } from "../src/i18n/hi";
import { getMessages } from "../src/i18n/messages";
describe("localization catalogs",()=>{it("keeps English and Hindi keys in parity",()=>{expect(Object.keys(hi).sort()).toEqual(Object.keys(en).sort());});it("falls back to English when no preference is stored",()=>{expect(getMessages(undefined).settingsTitle).toBe("Settings");});it("resolves Hindi and localized dynamic messages",()=>{const messages=getMessages("hi");expect(messages.settingsTitle).toBe("सेटिंग्स");expect(messages.courseCount(3)).toContain("3");expect(messages.whatIfNeeded(80,100,90)).toContain("90.0%");});});
