import React from 'react';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';
import { useFilteredSkills } from '../hooks/useFilteredSkills';
import { SkillChip } from '../components/SkillChip';

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

const workId = (work: Pick<WorkData, 'name' | 'startDate'>) =>
  `${work.name ?? ''}-${work.startDate ?? ''}`;

export const Work: React.FunctionComponent<WorkProps> = (props) => {
  const workData = useFilteredSkills(props.data, props.keywords || []);
  const highlightedId =
    props.highlightedIndex !== undefined
      ? workId(props.data[props.highlightedIndex] ?? {})
      : undefined;

  if (!workData.length) {
    return (
      <p className={styles.emptyState}>No roles match the selected skills.</p>
    );
  }

  return (
    <>
      {workData.map((it) => (
        <article
          key={workId(it)}
          id={`work-${props.data.findIndex((w) => workId(w) === workId(it))}`}
          className={`${styles.experienceContainer} ${
            highlightedId === workId(it) ? styles.highlighted : ''
          }`}
        >
          <div className={styles.experienceTitleContainer}>
            <div>
              <h3 className={styles.experienceTitle}>{it.position}</h3>
              <div className={styles.experienceCompany}>{it.name}</div>
            </div>
            <span className={styles.experienceDuration}>
              {toFormatDateWithMonth(it.startDate)} –{' '}
              {toFormatDateWithMonth(it.endDate)}
            </span>
          </div>
          {it.summary && (
            <p className={styles.companySummary}>{it.summary}</p>
          )}

          {!!it.highlights?.length && (
            <div className={styles.workSection}>
              <h4 className={styles.workSectionLabel}>Key achievements</h4>
              <ul className={styles.experienceAccomplishmentList}>
                {it.highlights.map((hl) => (
                  <li key={hl.description}>{hl.description}</li>
                ))}
              </ul>
            </div>
          )}

          {!!it.projects?.length && (
            <div className={styles.workSection}>
              <h4 className={styles.workSectionLabel}>Projects</h4>
              <div className={styles.projectList}>
                {it.projects.map((project) => (
                  <div key={project.name} className={styles.projectItem}>
                    <div className={styles.projectHeader}>
                      <span className={styles.projectName}>
                        {project.name}
                      </span>
                      <span className={styles.projectMeta}>
                        {project.startDate &&
                          `${toFormatDateWithMonth(
                            project.startDate,
                          )} – ${toFormatDateWithMonth(project.endDate)}`}
                        {project.startDate && project.teamSize && ' · '}
                        {project.teamSize && `Team of ${project.teamSize}`}
                      </span>
                    </div>
                    <div className={styles.projectSummary}>
                      {project.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
    </>
  );
};
