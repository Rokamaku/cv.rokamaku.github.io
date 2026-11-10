import React from 'react';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import styles from '../../styles/Cv.module.scss';
import { toFormatDateWithMonth } from '../helper/time';
import { useFilteredSkills } from '../hooks/useFilteredSkills';
import { SkillChip } from '../components/SkillChip';

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

export const Certificate: React.FunctionComponent<CertificateProps> = (
  props,
) => {
  const certificateData = useFilteredSkills(props.data, props.keywords || []);
  if (!certificateData.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>
        <AiFillSafetyCertificate className={styles.icon} aria-hidden />
        <span className={styles.title}>Certifications</span>
      </h2>
      {certificateData.map((it) => (
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
                  </a>
                ) : (
                  it.name
                )}
              </h3>
              <div className={styles.experienceCompany}>{it.issuer}</div>
            </div>
            <span className={styles.experienceDuration}>
              {toFormatDateWithMonth(it.date)}
            </span>
          </div>
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
