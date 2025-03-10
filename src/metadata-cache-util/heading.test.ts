import { HeadingCache, SectionCache } from "obsidian";
import { getHeadingContentPosition } from "./heading";

describe("getHeadingContentPosition", () => {
  it("returns boundaries based on next heading", () => {
    const headings: HeadingCache[] = [
      {
        level: 2,
        position: {
          start: { line: 0, col: 0, offset: 0 },
          end: { line: 0, col: 10, offset: 10 },
        },
        heading: ""
      },
      {
        level: 3,
        position: {
          start: { line: 2, col: 0, offset: 15 },
          end: { line: 2, col: 10, offset: 25 },
        },
        heading: ""
      },
      {
        level: 2,
        position: {
          start: { line: 5, col: 0, offset: 35 },
          end: { line: 5, col: 10, offset: 45 },
        },
        heading: ""
      },
    ];

    const firstSection: SectionCache = {
      position: {
        start: { line: 1, col: 0, offset: 11 },
        end: { line: 1, col: 5, offset: 16 },
      },
      type: ""
    };

    // lastSection is after the next level 2 heading.
    const lastSection: SectionCache = {
      position: {
        start: { line: 6, col: 0, offset: 46 },
        end: { line: 6, col: 10, offset: 56 },
      },
      type: ""
    };

    const result = getHeadingContentPosition(0, headings, firstSection, lastSection);
    expect(result.start).toEqual(firstSection.position.start);
    expect(result.end).toEqual(headings[2].position.start);
  });

  it("returns boundaries based on last section when no following heading", () => {
    const headings: HeadingCache[] = [
      {
        level: 2,
        position: {
          start: { line: 0, col: 0, offset: 0 },
          end: { line: 0, col: 10, offset: 10 },
        },
        heading: ""
      },
    ];

    const firstSection: SectionCache = {
      position: {
        start: { line: 1, col: 0, offset: 11 },
        end: { line: 1, col: 5, offset: 16 },
      },
      type: ""
    };

    const lastSection: SectionCache = {
      position: {
        start: { line: 3, col: 0, offset: 28 },
        end: { line: 3, col: 10, offset: 38 },
      },
      type: ""
    };

    const result = getHeadingContentPosition(0, headings, firstSection, lastSection);
    expect(result.start).toEqual(firstSection.position.start);
    expect(result.end).toEqual(lastSection.position.end);
  });
});
