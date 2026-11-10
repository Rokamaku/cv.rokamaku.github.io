import { useMemo } from 'react';
import type { SelectableKeyword } from './useFilteredSkills';

/** Flags which of `data` are currently selected (case-insensitive). */
export const useSelectedSkill = (
  data: string[],
  keywords: string[],
): SelectableKeyword[] =>
  useMemo(
    () =>
      data.map((sk) => ({
        name: sk,
        isSelected:
          keywords.some((kw) => kw.toLowerCase() === sk.toLowerCase()) ||
          undefined,
      })),
    [data, keywords],
  );
