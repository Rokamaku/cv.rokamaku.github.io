import { useMemo } from 'react';

interface DataHaveSkills {
  keywords?: string[];
}

export interface SelectableKeyword {
  name: string;
  isSelected?: boolean;
}

export type WithSelectableKeywords<T extends DataHaveSkills> = Omit<
  T,
  'keywords'
> & {
  keywords?: SelectableKeyword[];
};

const isMatch = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * Derives the items to display: when keywords are selected, only items sharing
 * at least one keyword are kept, and matching keywords are flagged.
 * Computed during render (not in an effect) so the content is server-rendered.
 */
export const useFilteredSkills = <T extends DataHaveSkills>(
  data: T[],
  keywords: string[],
): WithSelectableKeywords<T>[] =>
  useMemo(() => {
    const isSelected = (kw: string) => keywords.some((g) => isMatch(g, kw));
    const visible = keywords.length
      ? data.filter((d) => d.keywords?.some(isSelected))
      : data;

    return visible.map((d) => ({
      ...d,
      keywords: d.keywords?.map((kw) => ({
        name: kw,
        isSelected: isSelected(kw) || undefined,
      })),
    }));
  }, [data, keywords]);
