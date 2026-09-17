import { describe, expect, it } from "vitest";
import { clockTime, demoJourneys, interviewSteps, ratingSummary, total } from "./interviewData.js";

describe("interview calculations", () => {
  it("averages only rated criteria, never treats missing ratings as zero", () => {
    expect(ratingSummary({ Comunicação: 4, Organização: 2 })).toEqual({ count: 2, average: "3,0" });
    expect(ratingSummary({ Comunicação: 0 })).toEqual({ count: 0, average: null });
  });
  it("derives route totals and costs from candidate-specific legs", () => {
    expect(total(demoJourneys['Rafael Santos'].outbound, 'minutes')).toBe(42);
    expect(total(demoJourneys['Rafael Santos'].inbound, 'minutes')).toBe(46);
    expect(total(demoJourneys['Mariana Lima'].outbound, 'minutes')).toBe(38);
    expect(total(demoJourneys['Mariana Lima'].inbound, 'minutes')).toBe(42);
    const daily = total(demoJourneys['Mariana Lima'].outbound, 'fare') + total(demoJourneys['Mariana Lima'].inbound, 'fare');
    expect(daily * 26).toBeCloseTo(556.4, 2);
    expect(demoJourneys['André Cardoso']).toBeUndefined();
  });
  it("keeps pending stages visible and handles times across midnight", () => {
    expect(interviewSteps({ ratings: {}, notes: 'Anotação sem parecer', reviewed: {} }).every((step) => !step.done)).toBe(true);
    expect(clockTime(-10)).toBe('23:50');
    expect(clockTime(1465)).toBe('00:25');
  });
});
