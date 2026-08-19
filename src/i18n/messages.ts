import type { Locale } from "../domain/types";
import { en } from "./en";
import { hi } from "./hi";
import type { Messages } from "./types";
const catalogs:Record<Locale,Messages>={en,hi};
export function getMessages(locale:Locale|undefined):Messages{return catalogs[locale??"en"]??en;}
