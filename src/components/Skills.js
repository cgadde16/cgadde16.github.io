// src/components/Skills.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Skills.css';

// Icons importieren
import {
  // Software Icons
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
  FaFigma,
  // NEU: Hobby-Icons importieren
  FaCamera,
  FaHiking,
  FaUtensils,
  FaGamepad,
  FaBookOpen,
  // Standard-Icon
  FaQuestionCircle 
} from 'react-icons/fa';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiLibreofficedraw } from "react-icons/si";
import { CiTextAlignCenter } from "react-icons/ci";
import { RiBox3Fill } from "react-icons/ri";
import { IoMdFingerPrint } from "react-icons/io";

// Map, um Icon-Strings zu den Komponenten zuzuordnen
const iconMap = {
  // Software Icons
  FaReact: <FaReact />,
  IoLogoJavascript: <IoLogoJavascript />,
  FaNodeJs: <FaNodeJs />,
  FaHtml5: <FaHtml5 />,
  FaCss3Alt: <FaCss3Alt />,
  FaGithub: <FaGithub />,
  FaFigma: <FaFigma />,
  SiLibreofficedraw: <SiLibreofficedraw />,
  CiTextAlignCenter: <CiTextAlignCenter />,
  RiBox3Fill: <RiBox3Fill />,
  IoMdFingerPrint: <IoMdFingerPrint />,

  // NEU: Hobby-Icons zur Map hinzufügen
  FaCamera: <FaCamera />,
  FaHiking: <FaHiking />,
  FaUtensils: <FaUtensils />,
  FaGamepad: <FaGamepad />,
  FaBookOpen: <FaBookOpen />,
};

const getIcon = (iconName) => iconMap[iconName] || <FaQuestionCircle />;


function Skills() {
  const { t } = useTranslation();
  const [animateLanguageBars, setAnimateLanguageBars] = useState(false);
  const languageSectionRef = useRef(null);

  const softwareSkillsList = t('skills.softwareSkills', { returnObjects: true, defaultValue: [] });
  const languageSkillsList = t('skills.languageSkills', { returnObjects: true, defaultValue: [] });
  const hobbiesList = t('skills.hobbiesList', { returnObjects: true, defaultValue: [] });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setAnimateLanguageBars(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    const currentRef = languageSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="skills" className="skills-section">
      <div className="skills-categories-container">

        {/* Softwarekenntnisse Container */}
        <div className="skill-category">
          <h3>{t('skills.softwareHeadline', 'Softwarekenntnisse')}</h3>
          {Array.isArray(softwareSkillsList) && softwareSkillsList.length > 0 ? (
            <ul className="software-skills-list">
              {softwareSkillsList.map((skill, index) => (
                <li key={`software-${index}`} className="software-skill-item">
                  {getIcon(skill.icon)}
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('skills.noSoftwareSkills', 'Keine Softwarekenntnisse angegeben.')}</p>
          )}
        </div>

        {/* Hobbies & Interessen Container - GEÄNDERT */}
        <div className="skill-category">
          <h3>{t('skills.hobbiesHeadline', 'Hobbies & Interessen')}</h3>
          {Array.isArray(hobbiesList) && hobbiesList.length > 0 ? (
            <ul className="hobby-skills-list"> {/* Klasse hinzugefügt */}
              {hobbiesList.map((hobby, index) => (
                <li key={`hobby-${index}`} className="hobby-skill-item"> {/* GEÄNDERT */}
                  {getIcon(hobby.icon)} {/* Icon wird hier gerendert */}
                  <span>{hobby.name}</span> {/* Greift auf hobby.name zu */}
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('skills.noHobbies', 'Keine Hobbies angegeben.')}</p>
          )}
        </div>

        {/* Sprachkenntnisse Container */}
        <div className="skill-category" ref={languageSectionRef}>
          <h3>{t('skills.languageHeadline', 'Sprachkenntnisse')}</h3>
          {Array.isArray(languageSkillsList) && languageSkillsList.length > 0 ? (
            <ul className="language-skills-list">
              {languageSkillsList.map((skill, index) => (
                <li key={`language-${index}`} className="language-skill-item">
                  <div className="language-info">
                    <span className="language-name">{skill.language}</span>
                    <span className="language-level-text">{skill.level}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: animateLanguageBars ? `${skill.proficiency}%` : '0%',
                        transitionDelay: animateLanguageBars ? `${index * 0.15}s` : '0s',
                      }}
                    >
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('skills.noLanguageSkills', 'Keine Sprachkenntnisse angegeben.')}</p>
          )}
        </div>

      </div>
    </section>
  );
}

export default Skills;