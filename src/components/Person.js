// src/components/Person.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Person.css';
import { CiMail, CiLocationOn } from "react-icons/ci";
import LanguageSwitcherIcon from './LanguageSwitcherIcon'; // NEU: Importieren Sie den Switcher hier

function Person() {
  const { t } = useTranslation();

  const name = t('person.name');
  const titleOrProfession = t('person.titleOrProfession');
  const location = t('person.location');
  const email = t('person.email');
  const bioShort = t('person.bioShort');

  return (
    <div className="person-page-container">
      <header className="person-hero-section">
        {/* NEU: Der Language Switcher wird hier platziert */}
        {/* Wir packen ihn in einen Container für einfaches Styling. */}
        <div className="language-switcher-container">
          <LanguageSwitcherIcon />
        </div>

        <div className="person-hero-text">
          <h1>{name}</h1>
          <p className="person-hero-subtitle">{titleOrProfession}</p>
        </div>
      </header>

      <main className="person-content-section">
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