import type { Locale } from "../domain/types";
interface ScaleProfileMessages{deleteProfile:string;inUse:string;lastRemaining:string;deleteConfirm:(name:string)=>string;}
const catalogs:Record<Locale,ScaleProfileMessages>={en:{deleteProfile:"Delete profile",inUse:"Used by a course",lastRemaining:"Last remaining profile",deleteConfirm:(name)=>`Delete the unused grading scale “${name}”?`},hi:{deleteProfile:"प्रोफ़ाइल हटाएँ",inUse:"किसी कोर्स में उपयोग हो रही है",lastRemaining:"अंतिम बची प्रोफ़ाइल",deleteConfirm:(name)=>`अप्रयुक्त ग्रेडिंग स्केल “${name}” हटाएँ?`}};
export function getScaleProfileMessages(locale:Locale|undefined):ScaleProfileMessages{return catalogs[locale??"en"]??catalogs.en;}
