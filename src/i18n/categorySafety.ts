import type { Locale } from "../domain/types";
interface CategorySafetyMessages{inUse:string;removeBlocked:string;}
const catalogs:Record<Locale,CategorySafetyMessages>={en:{inUse:"Contains saved assignments",removeBlocked:"Move or delete assignments in this category before removing it."},hi:{inUse:"इसमें सहेजे गए असाइनमेंट हैं",removeBlocked:"इस श्रेणी को हटाने से पहले इसके असाइनमेंट दूसरी श्रेणी में ले जाएँ या हटाएँ।"}};
export function getCategorySafetyMessages(locale:Locale|undefined):CategorySafetyMessages{return catalogs[locale??"en"]??catalogs.en;}
