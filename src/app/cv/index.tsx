import React, { useCallback, useState } from 'react';
import { Basic, BasicData } from './basic';
import { Timeline, TimelineData } from './timeline';
import { Certificate, CertificateData } from './certificate';
import { Education, EducationData } from './education';
import { Interest, InterestData } from '../../app/cv/interest';
import { Project, ProjectData } from './project';
import { Skill, SkillData } from './skill';
import { Work, WorkData } from './work';
import styles from '../../styles/Cv.module.scss';
import { FaBriefcase } from 'react-icons/fa';

export interface CvData {
  basics: BasicData;
  work: WorkData[];
  certificates: CertificateData[];
  education: EducationData[];
  skills: SkillData[];
  projects: ProjectData[];
  interests: InterestData[];
}

interface CvProps {
  data: CvData;
}

export const Cv: React.FunctionComponent<CvProps> = (props) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<
    number | undefined
  >();
  let {
    basics,
    work,
    skills,
    education,
    certificates,
    projects,
    interests,
  }: CvData = props.data;

  const onKeywordSelect = (keyword: string, isSelected?: boolean) => {
    setKeywords((prev) => {
      let isKeywordExisted = false;
      if (prev.some((kw) => kw.toLowerCase() === keyword.toLowerCase())) {
        isKeywordExisted = true;
      }
      if (isSelected) {
        if (!isKeywordExisted) {
          return [...prev, keyword];
        }
      } else {
        if (isKeywordExisted) {
          return prev.filter(
            (kw) => kw.toLowerCase() !== keyword.toLowerCase(),
          );
        }
      }
      return prev;
    });
  };

  const timelineData: TimelineData[] = work.map((work) => ({
    name: work.name || '',
    position: work.position || '',
    startDate: work.startDate || '',
    endDate: work.endDate || '',
    summary: work.summary || '',
  }));

  return (
    <div className={styles.resume}>
      <Basic
        data={basics}
        keywords={keywords}
        onKeywordSelect={onKeywordSelect}
      />
      <Timeline
        data={timelineData}
        onHover={(index) => setHighlightedIndex(index)}
        onLeave={() => setHighlightedIndex(undefined)}
      />
      <div className={styles.capsule}>
        <div className={styles.capsuleBlock}>
          <div className={styles.mainPanel}>
            <div className={styles.sectionHeading}>
              <FaBriefcase className={styles.icon} />
              <span className={styles.title}>Work Experience</span>
            </div>
            <Work
              data={work}
              keywords={keywords}
              onKeywordSelect={onKeywordSelect}
              highlightedIndex={highlightedIndex}
            />
            <Education
              data={education}
              keywords={keywords}
              onKeywordSelect={onKeywordSelect}
            />
            <Certificate
              data={certificates}
              keywords={keywords}
              onKeywordSelect={onKeywordSelect}
            />
            <Project
              data={projects}
              keywords={keywords}
              onKeywordSelect={onKeywordSelect}
            />
          </div>
          <div className={styles.rightPanel}>
            <Skill
              data={skills}
              keywords={keywords}
              onKeywordSelect={onKeywordSelect}
            />
            <Interest data={interests} />
          </div>
        </div>
      </div>
    </div>
  );
};
