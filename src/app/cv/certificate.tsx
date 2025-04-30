import React, { useEffect, useState } from 'react';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';
import { useFilteredSkills } from '../hooks/useFilteredSkills';

export interface CertificateData {
  date?: string;
  issuer?: string;
  name?: string;
  url?: string;
  keywords?: string[];
}

export interface CertificateProps {
  data: CertificateData[];
  keywords?: string[];
  onKeywordSelect: (keyword: string, isSelected?: boolean) => void;
}

interface CertificateLocal extends Omit<CertificateData, 'keywords'> {
  keywords?: {
    name: string;
    isSelected?: boolean;
  }[];
}

export const Certificate: React.FunctionComponent<CertificateProps> = (
  props,
) => {
  const certificateData = useFilteredSkills(props.data, props.keywords || []);

  return (
    <>
      <div className={`${styles.capsuleDivider} ${styles.capsuleSpacer}`}></div>
      <div className={styles.sectionHeading}>
        <AiFillSafetyCertificate className={styles.icon} />
        <span className={styles.title}>Training and Certifications</span>
      </div>
      {(certificateData as CertificateLocal[]).map((it) => (
        <div key={it.name} className={styles.experienceContainer}>
          <div className={styles.experienceTitleContainer}>
            {it.url ? (
              <a target="_blank" rel="noreferrer" href={it.url}>
                <span className={styles.experienceTitle}>
                  {it.issuer} - {it.name}
                </span>
              </a>
            ) : (
              <span className={styles.experienceTitle}>
                {it.issuer} - {it.name}
              </span>
            )}
            <span className={styles.experienceDuration}>
              {toFormatDateWithMonth(it.date)}
            </span>
          </div>
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
