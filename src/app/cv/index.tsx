import React, { useCallback, useMemo, useState } from 'react';
import { Basic, BasicData } from './basic';
import { Timeline, TimelineData } from './timeline';
import { Certificate, CertificateData } from './certificate';
import { Education, EducationData } from './education';
import { Interest, InterestData } from './interest';
import { Project, ProjectData } from './project';
import { Skill, SkillData } from './skill';
import { Work, WorkData } from './work';
import { yearsSince } from '../helper/time';
import styles from '../../styles/Cv.module.scss';
import { FaBriefcase, FaTimes } from 'react-icons/fa';

export interface CvData {
  basics: BasicData;
  work: WorkData[];
  certificates: CertificateData[];
  education: EducationData[];
  skills: SkillData[];
  projects: ProjectData[];
  interests: InterestData[];
}

interface CvProps {
  data: CvData;
}

export const Cv: React.FunctionComponent<CvProps> = (props) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<
    number | undefined
  >();
  const { basics, work, skills, education, certificates, projects, interests } =
    props.data;

  const onKeywordSelect = useCallback(
    (keyword: string, isSelected?: boolean) => {
      setKeywords((prev) => {
        const exists = prev.some(
          (kw) => kw.toLowerCase() === keyword.toLowerCase(),
        );
        if (isSelected && !exists) return [...prev, keyword];
        if (!isSelected && exists) {
          return prev.filter(
            (kw) => kw.toLowerCase() !== keyword.toLowerCase(),
          );
        }
        return prev;
      });
    },
    [],
  );

  const timelineData: TimelineData[] = useMemo(
    () =>
      work.map((w) => ({
        name: w.name || '',
        position: w.position || '',
        startDate: w.startDate || '',
        endDate: w.endDate || '',
      })),
    [work],
  );

  // Derived from the earliest job so it never goes stale.
  const yearsOfExperience = useMemo(() => {
    const starts = work
      .map((w) => w.startDate)
      .filter((d): d is string => !!d)
      .sort();
    return starts.length ? yearsSince(starts[0]) : basics.yoe;
  }, [work, basics.yoe]);

  return (
    <div className={styles.resume}>
      <Basic
        data={basics}
        yearsOfExperience={yearsOfExperience}
        keywords={keywords}
        onKeywordSelect={onKeywordSelect}
      />
      <Timeline
        data={timelineData}
        onHover={setHighlightedIndex}
        onLeave={() => setHighlightedIndex(undefined)}
      />
      {keywords.length > 0 && (
        <div className={styles.filterBar} role="status">
          <span>Showing experience with:</span>
          {keywords.map((kw) => (
            <button
              key={kw}
              type="button"
              className={styles.filterTag}
              onClick={() => onKeywordSelect(kw, false)}
              aria-label={`Remove filter ${kw}`}
            >
              {kw} <FaTimes aria-hidden />
            </button>
          ))}
          <button
            type="button"
            className={styles.filterClear}
            onClick={() => setKeywords([])}
          >
            Clear all
          </button>
        </div>
      )}
      <div className={`${styles.capsule} ${styles.bodyGrid}`}>
        <main className={styles.mainPanel}>
          <section>
            <h2 className={styles.sectionHeading}>
              <FaBriefcase className={styles.icon} aria-hidden />
              <span className={styles.title}>Work Experience</span>
            </h2>
            <Work
              data={work}
              keywords={keywords}
              onKeywordSelect={onKeywordSelect}
              highlightedIndex={highlightedIndex}
            />
          </section>
          <Education
            data={education}
            keywords={keywords}
            onKeywordSelect={onKeywordSelect}
          />
          <Certificate
            data={certificates}
            keywords={keywords}
            onKeywordSelect={onKeywordSelect}
          />
          <Project
            data={projects}
            keywords={keywords}
            onKeywordSelect={onKeywordSelect}
          />
        </main>
        <aside className={styles.sidePanel}>
          <Skill
            data={skills}
            keywords={keywords}
            onKeywordSelect={onKeywordSelect}
          />
          <Interest data={interests} />
        </aside>
      </div>
    </div>
  );
};
