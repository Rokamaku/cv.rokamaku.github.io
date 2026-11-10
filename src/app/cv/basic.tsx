import React from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaSkype,
  FaLink,
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { GrStar } from 'react-icons/gr';
import styles from '../../styles/Cv.module.scss';
import { useSelectedSkill } from '../hooks/useSelectedSkills';
import { SkillChip } from '../components/SkillChip';

export interface BasicData {
  name?: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  cvPdf?: string;
  summary?: string;
  yoe?: number;
  location?: {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  };
  profiles?: {
    network?: string;
    username?: string;
    url?: string;
    iconName?: string;
  }[];
  topSkills?: string[];
}

interface BasicProps {
  data: BasicData;
  /** Years of experience; falls back to `data.yoe` when not provided. */
  yearsOfExperience?: number;
  keywords?: string[];
  onKeywordSelect: (keyword: string, isSelected?: boolean) => void;
}

const networkIcon: Record<string, React.ReactNode> = {
  Linkedin: <FaLinkedin className={styles.profileLinkIcon} />,
  Github: <FaGithub className={styles.profileLinkIcon} />,
  Twitter: <FaTwitter className={styles.profileLinkIcon} />,
  Skype: <FaSkype className={styles.profileLinkIcon} />,
};

const formatLocation = (location: BasicData['location']) => {
  if (!location) return '';
  let country = location.countryCode;
  if (country) {
    try {
      country =
        new Intl.DisplayNames(['en'], { type: 'region' }).of(country) ??
        country;
    } catch {
      // keep the raw country code
    }
  }
  return [location.city, country].filter(Boolean).join(', ');
};

export const Basic: React.FunctionComponent<BasicProps> = (props) => {
  const { data } = props;
  const topSkills = useSelectedSkill(data.topSkills || [], props.keywords || []);
  const yoe = props.yearsOfExperience ?? data.yoe;
  const location = formatLocation(data.location);

  return (
    <header className={styles.capsule}>
      <div className={styles.headerBlock}>
        <div className={styles.profileImageContainer}>
          <img
            className={styles.profileImage}
            src={data.image}
            alt={data.name ? `Photo of ${data.name}` : 'Profile photo'}
            width={160}
            height={160}
          />
        </div>
        <div className={styles.profileInfoContainer}>
          <div>
            <h1 className={styles.profileName}>{data.name}</h1>
            <div className={styles.profileTitle}>{data.label}</div>
          </div>
          <div className={styles.profileMeta}>
            {location && (
              <span className={styles.profileMetaItem}>
                <MdLocationOn className={styles.metaIcon} aria-hidden />
                {location}
              </span>
            )}
            {yoe !== undefined && (
              <span className={styles.profileMetaItem}>
                <GrStar className={styles.metaIcon} aria-hidden />
                {yoe}+ years of professional experience
              </span>
            )}
          </div>
          <p className={styles.profileSummaryStatement}>{data.summary}</p>
          <div className={styles.profileTopSkillContainer}>
            {topSkills.map((it) => (
              <SkillChip
                key={it.name}
                name={it.name}
                isSelected={it.isSelected}
                variant="top"
                onToggle={props.onKeywordSelect}
              />
            ))}
          </div>
        </div>
        <address className={styles.contactPanel}>
          {data.email && (
            <a className={styles.contactLink} href={`mailto:${data.email}`}>
              <FaEnvelope className={styles.profileLinkIcon} aria-hidden />
              <span>{data.email}</span>
            </a>
          )}
          {data.phone && (
            <a
              className={styles.contactLink}
              href={`tel:${data.phone.replace(/[^\d+]/g, '')}`}
            >
              <FaPhone className={styles.profileLinkIcon} aria-hidden />
              <span>{data.phone}</span>
            </a>
          )}
          {data.profiles?.map((pr) => (
            <a
              key={pr.network}
              className={styles.contactLink}
              target="_blank"
              rel="noreferrer"
              href={pr.url}
              aria-label={`${pr.network}: ${pr.username}`}
            >
              {networkIcon[pr.network ?? ''] ?? (
                <FaLink className={styles.profileLinkIcon} aria-hidden />
              )}
              <span>
                {pr.url?.replace(/^https?:\/\/(www\.)?/, '') ?? pr.username}
              </span>
            </a>
          ))}
        </address>
      </div>
    </header>
  );
};
