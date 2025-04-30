import React, { useEffect, useState } from 'react';
import { FaUniversity } from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';
import { useFilteredSkills } from '../hooks/useFilteredSkills';

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

interface EducationLocal extends Omit<EducationData, 'keywords'> {
  keywords?: {
    name: string;
    isSelected?: boolean;
  }[];
}

export const Education: React.FunctionComponent<EducationProps> = (props) => {
  const educationData = useFilteredSkills(props.data, props.keywords || []);

  return (
    <>
      <div className={`${styles.capsuleDivider} ${styles.capsuleSpacer}`}></div>
      <div className={styles.sectionHeading}>
        <FaUniversity className={styles.icon} />
        <span className={styles.title}>Education</span>
      </div>
      {(educationData as EducationLocal[]).map((it) => (
        <div
          key={`${it.area}${it.studyType}`}
          className={styles.experienceContainer}
        >
          <div className={styles.experienceTitleContainer}>
            <span
              className={styles.experienceTitle}
            >{`${it.studyType} in ${it.area}`}</span>
            <span
              className={styles.experienceDuration}
            >{`${toFormatDateWithMonth(it.startDate)} - ${toFormatDateWithMonth(
              it.endDate,
            )}`}</span>
          </div>
          <div className={styles.experienceSubtitleContainer}>
            <span className={styles.experienceSubtitle}>{it.institution}</span>
          </div>
          {it.score && (
            <div className={styles.experienceSubtitleContainer}>
              <span className={styles.experienceSubtitle}>GPA: {it.score}</span>
            </div>
          )}
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
      ))}
    </>
  );
};
