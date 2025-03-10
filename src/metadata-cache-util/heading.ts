import { HeadingCache, Pos, SectionCache } from "obsidian";

export function getHeadingIndexContaining(
  position: Pos,
  headings: HeadingCache[]
) {
  return headings.findIndex(
    (heading) => heading.position.start.line === position.start.line
  );
}

function getIndexOfHeadingAbove(position: Pos, headings: HeadingCache[]) {
  return headings.reduce(
    (previousIndex, lookingAtHeading, index) =>
      lookingAtHeading.position.start.line < position.start.line
        ? index
        : previousIndex,
    -1
  );
}

export function getHeadingBreadcrumbs(position: Pos, headings: HeadingCache[]) {
  const headingBreadcrumbs: HeadingCache[] = [];
  if (headings.length === 0) {
    return headingBreadcrumbs;
  }

  const collectAncestorHeadingsForHeadingAtIndex = (startIndex: number) => {
    let currentLevel = headings[startIndex].level;
    const previousHeadingIndex = startIndex - 1;

    for (let i = previousHeadingIndex; i >= 0; i--) {
      const lookingAtHeading = headings[i];

      if (lookingAtHeading.level < currentLevel) {
        currentLevel = lookingAtHeading.level;
        headingBreadcrumbs.unshift(lookingAtHeading);
      }
    }
  };

  const headingIndexAtPosition = getHeadingIndexContaining(position, headings);
  const positionIsInsideHeading = headingIndexAtPosition >= 0;

  if (positionIsInsideHeading) {
    headingBreadcrumbs.unshift(headings[headingIndexAtPosition]);
    collectAncestorHeadingsForHeadingAtIndex(headingIndexAtPosition);
    return headingBreadcrumbs;
  }

  const headingIndexAbovePosition = getIndexOfHeadingAbove(position, headings);
  const positionIsBelowHeading = headingIndexAbovePosition >= 0;

  if (positionIsBelowHeading) {
    const headingAbovePosition = headings[headingIndexAbovePosition];
    headingBreadcrumbs.unshift(headingAbovePosition);
    collectAncestorHeadingsForHeadingAtIndex(headingIndexAbovePosition);
    return headingBreadcrumbs;
  }

  return headingBreadcrumbs;
}

/**
 * Gets heading content boundaries
 * Start: first section under the heading.
 * End: end of the previous section before the next heading (or last section if none).
 */
export function getHeadingContentPosition(
  headingOffset: number, 
  headings: HeadingCache[], 
  firstSectionUnderHeading: SectionCache,
  lastSection: SectionCache
): Pos {
  const { level } = headings[headingOffset];
  const { start } = firstSectionUnderHeading.position;
  for (let i = headingOffset + 1; i < headings.length; i++) {
    if (headings[i].level <= level) {
      return { start, end: headings[i].position.start }
    }
  }
  return { start, end: lastSection.position.end }
}
