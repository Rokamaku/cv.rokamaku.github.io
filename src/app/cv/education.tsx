import React from 'react';
import { FaUniversity } from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';
import { useFilteredSkills } from '../hooks/useFilteredSkills';
import { SkillChip } from '../components/SkillChip';

export interface EducationData {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
  keywords?: string[];
}

export interface EducationProps {
  data: EducationData[];
  keywords?: string[];
  onKeywordSelect: (keyword: string, isSelected?: boolean) => void;
}

export const Education: React.FunctionComponent<EducationProps> = (props) => {
  const educationData = useFilteredSkills(props.data, props.keywords || []);
  if (!educationData.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>
        <FaUniversity className={styles.icon} aria-hidden />
        <span className={styles.title}>Education</span>
      </h2>
      {educationData.map((it) => (
        <article
          key={`${it.institution}${it.area}${it.studyType}`}
          className={styles.experienceContainer}
        >
          <div className={styles.experienceTitleContainer}>
            <div>
              <h3 className={styles.experienceTitle}>
                {`${it.studyType} in ${it.area}`}
              </h3>
              <div className={styles.experienceCompany}>{it.institution}</div>
            </div>
            <span className={styles.experienceDuration}>
              {`${toFormatDateWithMonth(it.startDate)} – ${toFormatDateWithMonth(
                it.endDate,
              )}`}
            </span>
          </div>
          {it.score && <p className={styles.companySummary}>GPA: {it.score}</p>}
          <div className={styles.chipRow}>
            {it.keywords?.map((kw) => (
              <SkillChip
                key={kw.name}
                name={kw.name}
                isSelected={kw.isSelected}
                onToggle={props.onKeywordSelect}
              />
            ))}
          </div>
        </article>
      ))}
    </section>
  );
};
