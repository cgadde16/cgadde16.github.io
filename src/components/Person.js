import React, { useState, useEffect } from 'react';
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

  const [animatedTitle, setAnimatedTitle] = useState('');
  const [started, setStarted] = useState(false);
  
  // GEÄNDERT: Wir brauchen jetzt zwei getrennte States für die beiden Animationen.
  const [backgroundIsVisible, setBackgroundIsVisible] = useState(false);
  const [contentIsVisible, setContentIsVisible] = useState(false);

  const TYPING_SPEED = 40;

  useEffect(() => {
    // Dieser Effekt steuert jetzt alle drei sequenziellen Animationen.
    if (startTyping && !started && fullTitle.length > 0) {
      setStarted(true);
      let index = 0;

      // NEU: Zwei separate Trigger-Punkte definieren.
      // Der Hintergrund soll früh starten (z.B. bei 30% des Titels).
      const backgroundTriggerIndex = Math.floor(fullTitle.length * 0.01);
      // Der Inhalt soll später starten (z.B. bei 70% des Titels).
      const contentTriggerIndex = Math.floor(fullTitle.length * 0.7);

      const type = () => {
        if (index <= fullTitle.length) {
          // 1. Trigger-Punkt für den HINTERGRUND
          if (index === backgroundTriggerIndex) {
            setBackgroundIsVisible(true);
          }

          // 2. Trigger-Punkt für den INHALT
          if (index === contentTriggerIndex) {
            setContentIsVisible(true);
          }
          
          // Die Tipp-Animation läuft weiter wie bisher
          setAnimatedTitle(fullTitle.substring(0, index));
          index++;
          setTimeout(type, TYPING_SPEED);
        }
      };
      
      type();
    }
    // Wichtig: 'fullTitle' zur Abhängigkeitsliste hinzufügen, damit die Indizes neu berechnet werden,
    // wenn sich die Sprache und damit der Titel ändert.
  }, [startTyping, started, fullTitle]);


  return (
    <div className="person-page-container">
      {/* GEÄNDERT: Gesteuert durch 'backgroundIsVisible' */}
      <header className={`person-hero-section ${backgroundIsVisible ? 'is-visible' : ''}`}>
        <div className="language-switcher-container">
          <LanguageSwitcherIcon />
        </div>

        <div className="person-hero-text">
          <h1>{name}</h1>
          <p className="person-hero-subtitle">{animatedTitle || '\u00A0'}</p>
        </div>
      </header>

      {/* GEÄNDERT: Gesteuert durch 'contentIsVisible' */}
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