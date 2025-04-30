import React, { useEffect, useState } from 'react';
import { FaBriefcase } from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';
import { useFilteredSkills } from '../hooks/useFilteredSkills';

export interface Project {
  name: string;
  summary?: string;
  teamSize?: number;
  startDate?: string;
  endDate?: string;
  keywords?: string[];
}

export interface WorkData {
  name?: string;
  projects?: Project[];
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  teamSize?: number;
  highlights?: {
    description?: string;
    keywords?: string[];
  }[];
  keywords?: string[];
}

export interface WorkProps {
  data: WorkData[];
  keywords?: string[];
  onKeywordSelect: (keyword: string, isSelected?: boolean) => void;
  highlightedIndex?: number;
}

interface ProjectLocal extends Omit<Project, 'keywords'> {
  keywords?: {
    name: string;
    isSelected?: boolean;
  }[];
}

interface WorkLocal extends Omit<WorkData, 'keywords'> {
  keywords?: {
    name: string;
    isSelected?: boolean;
  }[];
}

export const Work: React.FunctionComponent<WorkProps> = (props) => {
  const workData = useFilteredSkills(props.data, props.keywords || []);

  return (
    <>
      {(workData as WorkLocal[]).map((it, index) => (
        <div
          key={it.name}
          className={`${
            styles.experienceContainer
          } ${it.keywords?.toString()} ${
            props.highlightedIndex === index ? styles.highlighted : ''
          }`}
        >
          <div className={styles.experienceTitleContainer}>
            <span className={styles.experienceTitle}>{it.position}</span>
            <span className={styles.experienceDuration}>
              {toFormatDateWithMonth(it.startDate)} -{' '}
              {toFormatDateWithMonth(it.endDate)}
            </span>
          </div>
          <div className={styles.experienceSubtitleContainer}>
            <span className={styles.experienceSubtitle}>{it.name}</span>
          </div>
          <div className={styles.workSummaryStatement}>
            Projects:
            <div className={styles.projectList}>
              {it.projects?.map((project, index) => (
                <div key={index} className={styles.projectItem}>
                  <div className={styles.projectHeader}>
                    <div className={styles.projectName}>{project.name}</div>
                  </div>
                  <div className={styles.projectSummary}>{project.summary}</div>
                  <div className={styles.projectTeamSize}>
                    Team size: {project.teamSize}
                  </div>
                  <div className={styles.experienceSkillContainerIndent}>
                    {/* {(project as ProjectLocal).keywords?.map((kw) => (
                      <span
                        key={kw.name}
                        className={`${styles.experienceSkill} ${
                          kw.isSelected ? styles.skillSelected : ''
                        }`}
                        onClick={() =>
                          props.onKeywordSelect(kw.name, !kw.isSelected)
                        }
                      >
                        {kw.name}
                      </span>
                    ))} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.workSummaryStatement}>
            Responsibilities:
            <ul className={styles.experienceAccomplishmentList}>
              {it.highlights?.map((hl) => (
                <li
                  key={hl.description}
                  className={`${styles.experienceAccomplishment}`}
                >
                  {hl.description}
                </li>
              ))}
            </ul>
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
        </div>
      ))}
    </>
  );
};
