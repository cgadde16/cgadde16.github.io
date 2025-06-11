// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['de', 'en'], // Unterstützte Sprachen
    fallbackLng: 'de',          // Standard-Sprache, wenn nichts anderes erkannt/gespeichert
    debug: process.env.NODE_ENV === 'development', // Nützlich während der Entwicklung

    detection: {
      // Reihenfolge, wie die Sprache ermittelt wird:
      // 1. localStorage (wenn der Nutzer schon mal manuell gewählt hat)
      // 2. cookie (alternative Speicherung der Nutzerauswahl)
      // Wichtig: 'navigator' (Browsersprache) ist hier absichtlich nicht an erster Stelle oder ganz weggelassen.
      order: ['localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'], // Hier wird die vom Nutzer gewählte Sprache gespeichert
    },
    backend: {
      // Pfad, wo deine Übersetzungsdateien liegen (im public-Ordner)
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React schützt bereits vor XSS
    },
    // Falls du später Namespaces (Unterteilungen deiner Übersetzungen) nutzen willst:
    // ns: ['translation'], // 'translation' ist der Default-Namespace
    // defaultNS: 'translation',
  });

export default i18n;