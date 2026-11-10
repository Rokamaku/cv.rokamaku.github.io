import React from 'react';
import styles from '../../styles/Cv.module.scss';

interface SkillChipProps {
  name: string;
  isSelected?: boolean;
  variant?: 'default' | 'top';
  onToggle: (keyword: string, isSelected: boolean) => void;
}

/** A keyboard-accessible skill tag that toggles the global skill filter. */
export const SkillChip: React.FC<SkillChipProps> = ({
  name,
  isSelected,
  variant = 'default',
  onToggle,
}) => (
  <button
    type="button"
    aria-pressed={!!isSelected}
    title={isSelected ? `Remove filter: ${name}` : `Filter by ${name}`}
    className={`${styles.chip} ${variant === 'top' ? styles.chipTop : ''} ${
      isSelected ? styles.skillSelected : ''
    }`}
    onClick={() => onToggle(name, !isSelected)}
  >
    {name}
  </button>
);
