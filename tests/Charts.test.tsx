import { render,screen } from "@testing-library/react";
import { describe,expect,it } from "vitest";
import { ContributionChart } from "../src/components/ContributionChart";
import { TrendChart } from "../src/components/TrendChart";

describe("localized charts",()=>{
  it("localizes the empty score-trend state",()=>{
    render(<TrendChart assignments={[]} locale="hi"/>);
    expect(screen.getByText("रुझान देखने के लिए कम-से-कम दो ग्रेड किए गए असाइनमेंट जोड़ें।")).toBeInTheDocument();
  });

  it("localizes contribution chart semantics and summaries",()=>{
    render(<ContributionChart locale="hi" names={{}} results={[{categoryId:"category-1",earned:0,possible:0,percent:null,weight:40,contribution:0}]}/>);
    expect(screen.getByRole("group",{name:"श्रेणी योगदान चार्ट"})).toBeInTheDocument();
    expect(screen.getByText("श्रेणी")).toBeInTheDocument();
    expect(screen.getByText("कोई ग्रेड नहीं")).toBeInTheDocument();
    expect(screen.getByText("40% कोर्स वेट · 0.0 पॉइंट्स योगदान")).toBeInTheDocument();
  });
});
