import React, { useMemo } from 'react';
import { FaTools } from 'react-icons/fa';
import styles from '../../styles/Cv.module.scss';
import { useSelectedSkill } from '../hooks/useSelectedSkills';
import { SkillChip } from '../components/SkillChip';

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
  const flattenSkills = useMemo(
    () => props.data.flatMap((group) => group.keywords ?? []),
    [props.data],
  );
  const skills = useSelectedSkill(flattenSkills, props.keywords || []);
  const isSelected = (name: string) =>
    skills.find((sk) => sk.name.toLowerCase() === name.toLowerCase())
      ?.isSelected;

  return (
    <section>
      <h2 className={styles.sectionHeading}>
        <FaTools className={styles.icon} aria-hidden />
        <span className={styles.title}>Skills</span>
      </h2>
      <p className={styles.filterHint}>
        Click a skill to filter my experience.
      </p>
      {props.data.map((it) => (
        <div key={it.name}>
          <h3 className={styles.skillType}>{it.name}</h3>
          <div className={styles.skillContainer}>
            {it.keywords?.map((skillName) => (
              <SkillChip
                key={skillName}
                name={skillName}
                isSelected={isSelected(skillName)}
                onToggle={props.onKeywordSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
