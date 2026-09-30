import type { Locale } from "../domain/types";

const en={
  trendLabel:"Assignment score trend chart",
  trendEmpty:"Add at least two graded assignments to see a trend.",
  contributionLabel:"Category contribution chart",
  fallbackCategory:"Category",
  noGrades:"No grades",
  contributionSummary:(weight:number,contribution:number)=>`${weight}% course weight · ${contribution.toFixed(1)} pts contributed`,
};

const hi={
  trendLabel:"असाइनमेंट स्कोर रुझान चार्ट",
  trendEmpty:"रुझान देखने के लिए कम-से-कम दो ग्रेड किए गए असाइनमेंट जोड़ें।",
  contributionLabel:"श्रेणी योगदान चार्ट",
  fallbackCategory:"श्रेणी",
  noGrades:"कोई ग्रेड नहीं",
  contributionSummary:(weight:number,contribution:number)=>`${weight}% कोर्स वेट · ${contribution.toFixed(1)} पॉइंट्स योगदान`,
} satisfies typeof en;

export function getChartMessages(locale:Locale|undefined){return locale==="hi"?hi:en;}
