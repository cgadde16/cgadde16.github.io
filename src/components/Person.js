// src/components/Person.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './Person.css';
import { CiMail, CiLocationOn } from "react-icons/ci";
import LanguageSwitcherIcon from './LanguageSwitcherIcon';

function Person() {
  const { t } = useTranslation();

  const name = t('person.name');
  const fullTitle = t('person.titleOrProfession');
  const location = t('person.location');
  const email = t('person.email');
  const bioShort = t('person.bioShort');

  const [animatedTitle, setAnimatedTitle] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);

  const titleRef = useRef(null);

  // Geschwindigkeit in ms
  const TYPING_SPEED = 40;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateTitle();
          setHasAnimated(true);
        }
      },
      { threshold: 0.6 } // erst ab 60% Sichtbarkeit
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, [hasAnimated, fullTitle]);

  const animateTitle = () => {
    let index = 0;
    const type = () => {
      if (index <= fullTitle.length) {
        setAnimatedTitle(fullTitle.substring(0, index));
        index++;
        setTimeout(type, TYPING_SPEED);
      }
    };
    type();
  };

  return (
    <div className="person-page-container">
      <header className="person-hero-section">
        <div className="language-switcher-container">
          <LanguageSwitcherIcon />
        </div>

        <div className="person-hero-text" ref={titleRef}>
          <h1>{name}</h1>
          <p className="person-hero-subtitle">
            {animatedTitle || '\u00A0'}
          </p>
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
