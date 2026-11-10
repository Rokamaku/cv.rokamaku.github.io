import React from 'react';
import { BsFileCodeFill } from 'react-icons/bs';
import { FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';
import { useFilteredSkills } from '../hooks/useFilteredSkills';
import { SkillChip } from '../components/SkillChip';

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

export const Project: React.FunctionComponent<ProjectProps> = (props) => {
  const projectData = useFilteredSkills(props.data, props.keywords || []);
  if (!projectData.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>
        <BsFileCodeFill className={styles.icon} aria-hidden />
        <span className={styles.title}>Projects</span>
      </h2>
      {projectData.map((it) => (
        <article key={it.name} className={styles.experienceContainer}>
          <div className={styles.experienceTitleContainer}>
            <div>
              <h3 className={styles.experienceTitle}>
                {it.url ? (
                  <a
                    className={styles.inlineLink}
                    target="_blank"
                    rel="noreferrer"
                    href={it.url}
                  >
                    {it.name}
                    <FaExternalLinkAlt
                      className={styles.externalIcon}
                      aria-label="(opens source)"
                    />
                  </a>
                ) : (
                  it.name
                )}
              </h3>
              {!!it.roles?.length && (
                <div className={styles.experienceCompany}>
                  {it.roles.join(', ')}
                </div>
              )}
            </div>
            {it.startDate && (
              <span className={styles.experienceDuration}>
                {toFormatDateWithMonth(it.startDate)} –{' '}
                {toFormatDateWithMonth(it.endDate)}
              </span>
            )}
          </div>
          <p className={styles.companySummary}>{it.description}</p>
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
