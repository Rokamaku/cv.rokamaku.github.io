import React from 'react';
import { FaHeart } from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';

export interface InterestData {
  keywords?: string[];
  name?: string;
}

export interface InterestProps {
  data: InterestData[];
}

export const Interest: React.FunctionComponent<InterestProps> = ({ data }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionHeading}>
      <FaHeart className={styles.icon} aria-hidden />
      <span className={styles.title}>Interests</span>
    </h2>
    <ul className={styles.interestList}>
      {data.map((it) => (
        <li key={it.name}>
          <strong>{it.name}</strong>
          {!!it.keywords?.length && `: ${it.keywords.join(', ')}`}
        </li>
      ))}
    </ul>
  </section>
);
