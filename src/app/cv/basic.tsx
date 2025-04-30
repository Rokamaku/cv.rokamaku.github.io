import React, { useCallback, useEffect, useState } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaSkype,
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { GrStar } from 'react-icons/gr';
import styles from '../../styles/Cv.module.scss';
import { useSelectedSkill } from '../hooks/useSelectedSkills';

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
  keywords?: string[];
  onKeywordSelect: (keyword: string, isSelected?: boolean) => void;
}

export const Basic: React.FunctionComponent<BasicProps> = (props) => {
  const topSkills = useSelectedSkill(
    props.data.topSkills || [],
    props.keywords || [],
  );

  const networkIcon: Record<string, any> = {
    Linkedin: <FaLinkedin className={styles.profileLinkIcon} />,
    Github: <FaGithub className={styles.profileLinkIcon} />,
    Twitter: <FaTwitter className={styles.profileLinkIcon} />,
    Skype: <FaSkype className={styles.profileLinkIcon} />,
  };

  return (
    <div className={styles.capsule}>
      <div className={styles.capsuleBlock}>
        <div className={styles.profileImageContainer}>
          <img
            className={styles.profileImage}
            src={props.data.image}
            alt="My Avatar"
            width={150}
            height={150}
          />
        </div>
        <div className={styles.profileInfoContainer}>
          <h1 className={styles.profileName}>{props.data.name}</h1>
          <div className={styles.profileTitle}>{props.data.label}</div>
          <div className={styles.profileSummaryStatement}>
            {props.data.summary}
          </div>
          <div className={styles.profileTopSkillContainer}>
            {topSkills?.map((it) => (
              <span
                key={it.name}
                className={`${styles.profileTopSkill} ${
                  it.isSelected ? styles.skillSelected : ''
                }`}
                onClick={() => props.onKeywordSelect(it.name, !it.isSelected)}
              >
                {it.name}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.contactInfoContainer}>
            <div className={styles.contactInfo}>
              <a
                className={styles.profileLink}
                target="_blank"
                rel="noreferrer"
                href={`mailto:${props.data.email}`}
              >
                <FaEnvelope className={styles.profileLinkIcon} />
                <span className={styles.contactInfoEmail}>
                  {props.data.email}
                </span>
              </a>
            </div>
            <div className={styles.contactInfo}>
              <FaPhone className={styles.profileLinkIcon} />
              <span>{props.data.phone}</span>
            </div>
          </div>
          {props.data.profiles?.map((pr) => (
            <div key={pr.network} className={styles.profileLinkContainer}>
              <a
                className={styles.profileLink}
                target="_blank"
                rel="noreferrer"
                href={pr.url}
              >
                {networkIcon[pr?.network ?? '']}
                <span className={styles.profileLinkText}>{pr.network}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.mobileHide}>
        <div className={styles.capsuleDivider}></div>
        <div className={styles.capsuleBotton}>
          <span className={styles.sectionHalf}>
            <MdLocationOn className={styles.icon} size={35} />
            <span
              className={styles.iconText}
            >{`${props.data.location?.address}, ${props.data.location?.city}, ${props.data.location?.countryCode}`}</span>
          </span>
          <span className={styles.sectionHalf}>
            <GrStar className={styles.icon} size={35} />
            <span className={styles.iconText}>
              {props.data.yoe} years professional experience
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
