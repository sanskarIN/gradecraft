import { describe,expect,it } from "vitest";
import { validateAssignment,validateCategories,validateGradeScale } from "../src/domain/validation";
import { validationIssueMessage } from "../src/i18n/validation";
import { DEFAULT_SCALE } from "../src/domain/defaults";

describe("localized validation feedback",()=>{
  it("preserves the domain English fallback",()=>{
    const item=validateAssignment({name:"",categoryId:"missing",score:-1,maxScore:0},{categories:[]})[0]!;
    expect(validationIssueMessage(item,"en")).toBe(item.message);
  });

  it("localizes assignment and grading-scale issues to Hindi",()=>{
    const assignmentIssue=validateAssignment({name:"",categoryId:"missing",score:0,maxScore:100},{categories:[]}).find((item)=>item.code==="assignment.nameRequired")!;
    expect(validationIssueMessage(assignmentIssue,"hi")).toBe("असाइनमेंट का नाम आवश्यक है।");
    const scaleIssue=validateGradeScale({...DEFAULT_SCALE,name:""}).find((item)=>item.code==="scale.nameRequired")!;
    expect(validationIssueMessage(scaleIssue,"hi")).toBe("स्केल का नाम आवश्यक है।");
  });

  it("localizes dynamic weighted-category totals",()=>{
    const item=validateCategories([{id:"a",name:"Assignments",weight:40}],"weighted").find((issue)=>issue.code==="categories.total100")!;
    expect(validationIssueMessage(item,"hi")).toContain("40.00%");
    expect(validationIssueMessage(item,"hi")).toContain("100%");
  });
});
