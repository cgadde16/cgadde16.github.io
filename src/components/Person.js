import React, { useState, useEffect } from 'react'; // useRef wird nicht mehr benötigt
import { useTranslation } from 'react-i18next';
import './Person.css';
import { CiMail, CiLocationOn } from "react-icons/ci";
import LanguageSwitcherIcon from './LanguageSwitcherIcon';

function Person({ startTyping }) {
  const { t } = useTranslation();

  const name = t('person.name');
  const fullTitle = t('person.titleOrProfession');
  const location = t('person.location');
  const email = t('person.email');
  const bioShort = t('person.bioShort');

  // State für die Tipp-Animation
  const [animatedTitle, setAnimatedTitle] = useState('');
  const [started, setStarted] = useState(false);
  
  // State für die Inhalts-Animation
  const [contentIsVisible, setContentIsVisible] = useState(false);

  const TYPING_SPEED = 40;

  // Dieser useEffect steuert jetzt BEIDE Animationen nacheinander
  useEffect(() => {
    if (startTyping && !started) {
      setStarted(true);
      let index = 0;

      const type = () => {
        if (index <= fullTitle.length) {
          // Tipp-Animation läuft...
          setAnimatedTitle(fullTitle.substring(0, index));
          index++;
          setTimeout(type, TYPING_SPEED);
        } else {
          // Tipp-Animation ist FERTIG!
          // Jetzt wird die zweite Animation für den Inhalt ausgelöst.
          setContentIsVisible(true);
        }
      };
      
      type();
    }
  }, [startTyping, started, fullTitle]);


  return (
    <div className="person-page-container">
      <header className="person-hero-section">
        <div className="language-switcher-container">
          <LanguageSwitcherIcon />
        </div>

        <div className="person-hero-text">
          <h1>{name}</h1>
          <p className="person-hero-subtitle">{animatedTitle || '\u00A0'}</p>
        </div>
      </header>

      {/* Die dynamische Klasse wird ausgelöst, wenn contentIsVisible true wird */}
      <main 
        className={`person-content-section ${contentIsVisible ? 'is-visible' : ''}`}
      >
        <p className="person-bio">{bioShort}</p>

        <div className="person-contact-info">
          {location && (
            <div className="person-info-item">
              <CiLocationOn className="icon" />
              <span>{location}</span>
            </div>
          )}
          {email && (
            <div className="person-info-item">
              <CiMail className="icon" />
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Person;