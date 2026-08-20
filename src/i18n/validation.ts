import type { Locale } from "../domain/types";
import type { ValidationIssue,ValidationIssueCode } from "../domain/validation";

type Formatter=(issue:ValidationIssue)=>string;

const hindi:Record<ValidationIssueCode,Formatter>={
  "categories.required":()=>"कम-से-कम एक श्रेणी आवश्यक है।",
  "categories.nameRequired":()=>"श्रेणी का नाम आवश्यक है।",
  "categories.nameUnique":()=>"श्रेणियों के नाम अलग-अलग होने चाहिए।",
  "categories.weightRange":()=>"श्रेणी का वेट 0 और 100 के बीच होना चाहिए।",
  "categories.idUnique":()=>"श्रेणी ID अलग-अलग होनी चाहिए।",
  "categories.total100":(item)=>`वेटेड श्रेणियों का कुल 100% होना चाहिए। वर्तमान कुल: ${Number(item.values?.total??0).toFixed(2)}%.`,
  "assignment.nameRequired":()=>"असाइनमेंट का नाम आवश्यक है।",
  "assignment.maxScorePositive":()=>"अधिकतम स्कोर शून्य से अधिक होना चाहिए।",
  "assignment.scoreNonNegative":()=>"स्कोर ऋणात्मक नहीं हो सकता।",
  "assignment.scoreWithinMaximum":()=>"स्कोर अधिकतम स्कोर से अधिक नहीं हो सकता।",
  "assignment.categoryValid":()=>"एक मान्य श्रेणी चुनें।",
  "scale.nameRequired":()=>"स्केल का नाम आवश्यक है।",
  "scale.bandsRequired":()=>"कम-से-कम एक ग्रेड बैंड आवश्यक है।",
  "scale.bandLabelRequired":()=>"बैंड लेबल आवश्यक है।",
  "scale.bandLabelUnique":()=>"बैंड लेबल अलग-अलग होने चाहिए।",
  "scale.bandIdUnique":()=>"बैंड ID अलग-अलग होनी चाहिए।",
  "scale.minimumPercentRange":()=>"न्यूनतम प्रतिशत 0 और 100 के बीच होना चाहिए।",
  "scale.minimumPercentUnique":()=>"न्यूनतम प्रतिशत अलग-अलग होने चाहिए।",
  "scale.gpaPointsRange":()=>"GPA पॉइंट्स 0 और 10 के बीच होने चाहिए।",
  "scale.zeroFloorRequired":()=>"ग्रेडिंग स्केल में 0% से शुरू होने वाला बैंड होना चाहिए।",
};

export function validationIssueMessage(issue:ValidationIssue,locale:Locale|undefined):string{
  return locale==="hi"?hindi[issue.code](issue):issue.message;
}
