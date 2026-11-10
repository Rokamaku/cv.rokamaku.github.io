import React from 'react';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';

export interface TimelineData {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
}

export interface TimelineProps {
  /** Newest first, as in resume.json; rendered oldest → newest. */
  data: TimelineData[];
  onHover: (index: number) => void;
  onLeave: () => void;
}

export const Timeline: React.FunctionComponent<TimelineProps> = (props) => {
  const items = props.data
    .map((item, index) => ({ item, index }))
    .reverse();

  return (
    <nav className={styles.timelineContainer} aria-label="Career timeline">
      <ol className={styles.timelineList}>
        {items.map(({ item, index }) => (
          <li key={`${item.name}-${item.startDate}`}>
            <a
              href={`#work-${index}`}
              className={styles.timelineSection}
              onMouseEnter={() => props.onHover(index)}
              onMouseLeave={props.onLeave}
              onFocus={() => props.onHover(index)}
              onBlur={props.onLeave}
            >
              <span className={styles.timelineDot} aria-hidden />
              <span className={styles.timelineDuration}>
                {toFormatDateWithMonth(item.startDate)} –{' '}
                {toFormatDateWithMonth(item.endDate)}
              </span>
              <span className={styles.timelineCompany}>{item.name}</span>
              <span className={styles.timelinePosition}>{item.position}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};
