import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Person.css';
import { CiMail, CiLocationOn } from "react-icons/ci";
import LanguageSwitcherIcon from './LanguageSwitcherIcon';

// NEU: onAnimationComplete als Prop hinzugefügt
function Person({ startTyping, onAnimationComplete }) {
  const { t } = useTranslation();

  const name = t('person.name');
  const fullTitle = t('person.titleOrProfession');
  const location = t('person.location');
  const email = t('person.email');
  const bioShort = t('person.bioShort');

  const [animatedTitle, setAnimatedTitle] = useState('');
  const [started, setStarted] = useState(false);
  
  const [backgroundIsVisible, setBackgroundIsVisible] = useState(false);
  const [contentIsVisible, setContentIsVisible] = useState(false);

  const TYPING_SPEED = 40;

  useEffect(() => {
    if (startTyping && !started && fullTitle.length > 0) {
      setStarted(true);
      let index = 0;

      const backgroundTriggerIndex = Math.floor(fullTitle.length * 0.01);
      const contentTriggerIndex = Math.floor(fullTitle.length * 0.7);

      const type = () => {
        if (index <= fullTitle.length) {
          if (index === backgroundTriggerIndex) {
            setBackgroundIsVisible(true);
          }

          if (index === contentTriggerIndex) {
            setContentIsVisible(true);

            // NEU: Nachdem die letzte Animation (content) getriggert wurde,
            // warten wir ihre Dauer ab und rufen dann die Callback-Funktion auf.
            // Die Animationsdauer in Person.css ist 0.6s, also 600ms.
            setTimeout(() => {
              if (onAnimationComplete) {
                onAnimationComplete();
              }
            }, 600); 
          }
          
          setAnimatedTitle(fullTitle.substring(0, index));
          index++;
          setTimeout(type, TYPING_SPEED);
        }
      };
      
      type();
    }
  }, [startTyping, started, fullTitle, onAnimationComplete]); // NEU: onAnimationComplete zur Abhängigkeitsliste hinzugefügt


  return (
    <div className="person-page-container">
      <header className={`person-hero-section ${backgroundIsVisible ? 'is-visible' : ''}`}>
        <div className="language-switcher-container">
          <LanguageSwitcherIcon />
        </div>

        <div className="person-hero-text">
          <h1>{name}</h1>
          <p className="person-hero-subtitle">{animatedTitle || '\u00A0'}</p>
        </div>
      </header>
      
      <main className={`person-content-section ${contentIsVisible ? 'is-visible' : ''}`}>
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