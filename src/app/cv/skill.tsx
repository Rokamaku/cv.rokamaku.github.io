import React, { useMemo } from 'react';
import { FaTools } from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';
import { useSelectedSkill } from '../hooks/useSelectedSkills';

export interface SkillData {
  name: string;
  level?: string;
  keywords?: string[];
}

export interface SkillProps {
  data: SkillData[];
  keywords?: string[];
  onKeywordSelect: (keyword: string, isSelected?: boolean) => void;
}

export const Skill: React.FunctionComponent<SkillProps> = (props) => {
  const flattenSkills = useMemo(() => {
    const flattenSkills: string[] = [];
    props.data.forEach((value) => {
      value.keywords?.forEach((kw) => {
        flattenSkills.push(kw);
      });
    });
    return flattenSkills;
  }, [props.data]);
  const skills = useSelectedSkill(flattenSkills, props.keywords || []);

  return (
    <>
      <div className={styles.sectionHeading}>
        <FaTools className={styles.icon} />
        <span className={styles.title}>Skills</span>
      </div>
      {props.data.map((it) => (
        <div key={it.name}>
          <div className={styles.skillType}>{it.name}</div>
          <div className={styles.skillContainer}>
            {it.keywords?.map((skillName) => {
              let currentSkill = skills.filter(
                (sk) => sk.name.toLowerCase() === skillName.toLowerCase(),
              )[0];
              return (
                <span
                  key={skillName}
                  className={`${styles.skill} ${
                    currentSkill?.isSelected ? styles.skillSelected : ''
                  }`}
                  onClick={() =>
                    props.onKeywordSelect(
                      currentSkill.name,
                      !currentSkill.isSelected,
                    )
                  }
                >
                  {skillName}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};
