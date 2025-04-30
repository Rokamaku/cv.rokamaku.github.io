import React from 'react';
import {
  FaHeart,
  FaBook,
  FaMusic,
  FaRunning,
  FaCode,
  FaGamepad,
  FaUtensils,
  FaGlobe,
  FaCamera,
} from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';

export interface InterestData {
  keywords?: string[];
  name?: string;
}

export interface InterestProps {
  data: InterestData[];
  keywords?: string[];
}

// Function to get the appropriate icon for each interest category
const getInterestIcon = (name: string = '') => {
  const lowerName = name.toLowerCase();
  if (
    lowerName.includes('book') ||
    lowerName.includes('reading') ||
    lowerName.includes('blog')
  )
    return <FaBook />;
  if (lowerName.includes('music') || lowerName.includes('song'))
    return <FaMusic />;
  if (
    lowerName.includes('sport') ||
    lowerName.includes('running') ||
    lowerName.includes('hiking')
  )
    return <FaRunning />;
  if (lowerName.includes('coding') || lowerName.includes('programming'))
    return <FaCode />;
  if (lowerName.includes('game') || lowerName.includes('gaming'))
    return <FaGamepad />;
  if (lowerName.includes('food') || lowerName.includes('cooking'))
    return <FaUtensils />;
  if (lowerName.includes('travel')) return <FaGlobe />;
  if (lowerName.includes('photo')) return <FaCamera />;
  return <FaHeart />;
};

export const Interest: React.FunctionComponent<InterestProps> = (props) => {
  const { data } = props;
  return (
    <>
      <div className={`${styles.capsuleDivider} ${styles.capsuleSpacer}`}></div>
      <div className={styles.sectionHeading}>
        <FaHeart className={styles.icon} />
        <span className={styles.title}>Interests</span>
      </div>
      <div className={styles.interestsContainer}>
        {data.map((it) => (
          <div key={it.name} className={styles.interestCategory}>
            <div className={styles.interestTitleWrapper}>
              <span className={styles.interestIcon}>
                {getInterestIcon(it.name)}
              </span>
              <span className={styles.interestTitle}>{it.name}</span>
            </div>
            <ul className={styles.interestList}>
              {it.keywords?.map((kw) => (
                <li key={kw} className={styles.interestItem}>
                  {kw}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};
