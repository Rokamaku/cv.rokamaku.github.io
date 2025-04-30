import React from 'react';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';

export interface TimelineData {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  summary?: string;
}

export interface TimelineProps {
  data: TimelineData[];
  onHover: (index: number) => void;
  onLeave: () => void;
}

export const Timeline: React.FunctionComponent<TimelineProps> = (props) => {
  const getTimelineYear = (date: string) => {
    if (!date || date.toLowerCase() === 'current') {
      return new Date().getFullYear();
    }
    return new Date(date).getFullYear();
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineLine} />
      {props.data.map((item, index) => (
        <div
          key={index}
          className={styles.timelineSection}
          onMouseEnter={() => props.onHover(index)}
          onMouseLeave={props.onLeave}
        >
          <div className={styles.timelineCompanyInfo}>
            <div className={styles.timelineCompany}>{item.name}</div>
            <div className={styles.timelinePosition}>{item.position}</div>
            <div className={styles.timelineDuration}>
              {toFormatDateWithMonth(item.startDate)} -{' '}
              {toFormatDateWithMonth(item.endDate)}
            </div>
            {item.summary && (
              <div
                className={styles.timelineSummary}
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
            )}
          </div>
          <div className={styles.timelineDot} />
          <div className={styles.timelineYear}>
            {getTimelineYear(item.startDate)}
          </div>
        </div>
      ))}
    </div>
  );
};
