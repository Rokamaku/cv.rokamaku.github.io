import React from 'react';
import { FaHeart } from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';

export interface InterestData {
  keywords?: string[];
  name?: string;
}

export interface InterestProps {
  data: InterestData[];
  keywords?: string[];
}

export const Interest: React.FunctionComponent<InterestProps> = (props) => {
  const { data } = props;
  return (
    <>
      <div className={`${styles.capsuleDivider} ${styles.capsuleSpacer}`}></div>
      <div className={styles.sectionHeading}>
        <FaHeart className={styles.icon} />
        <span className={styles.title}>Interests</span>
      </div>
      {data.map((it) => (
        <div key={it.name} className={styles.capsuleSpacer}>
          {it.name}
          <ul>
            {it.keywords?.map((kw) => (
              <li key={kw}>{kw}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
