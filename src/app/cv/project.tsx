import React from 'react';
import { BsFileCodeFill } from 'react-icons/bs';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';
import { useFilteredSkills } from '../hooks/useFilteredSkills';

export interface ProjectData {
  name?: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
}

export interface ProjectProps {
  data: ProjectData[];
  keywords?: string[];
  onKeywordSelect: (keyword: string, isSelected?: boolean) => void;
}

interface ProjectLocal extends Omit<ProjectData, 'keywords'> {
  keywords?: {
    name: string;
    isSelected?: boolean;
  }[];
}

export const Project: React.FunctionComponent<ProjectProps> = (props) => {
  const projectData = useFilteredSkills(props.data, props.keywords || []);

  return (
    <>
      <div className={`${styles.capsuleDivider} ${styles.capsuleSpacer}`}></div>
      <div className={styles.sectionHeading}>
        <BsFileCodeFill className={styles.icon} />
        <span className={styles.title}>Projects</span>
      </div>
      {(projectData as ProjectLocal[]).map((it) => (
        <div key={it.name} className={styles.experienceContainer}>
          <div className={styles.experienceTitleContainer}>
            <span className={styles.experienceTitle}>{it.name}</span>
            <span
              className={styles.experienceDuration}
            >{`${toFormatDateWithMonth(it.startDate)} - ${toFormatDateWithMonth(
              it.endDate,
            )}`}</span>
          </div>
          <div className={styles.experienceSubtitleContainer}>
            <span className={styles.customExperienceDescription}>
              {it.description}.
            </span>
            {it.url && (
              <a target="_blank" rel="noreferrer" href={it.url}>
                <span> Link</span>
              </a>
            )}
          </div>
          <div className={styles.experienceSkillContainerIndent}>
            {it.keywords?.map((kw) => (
              <span
                key={kw.name}
                className={`${styles.experienceSkill} ${
                  kw.isSelected ? styles.skillSelected : ''
                }`}
                onClick={() => props.onKeywordSelect(kw.name, !kw.isSelected)}
              >
                {kw.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
