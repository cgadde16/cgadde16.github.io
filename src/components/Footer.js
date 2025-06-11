// src/components/Footer.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
// Deine react-icons Importe
import { FaInstagram } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci"; // Korrekter Import für LinkedIn aus react-icons/ci (oft ist es FaLinkedin aus react-icons/fa)
// Alternativ für LinkedIn, falls CiLinkedin nicht das gewünschte Icon ist:
// import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

// ================================================================================
// HIER DEINE DATEN EINTRAGEN:
// ================================================================================
const MY_EMAIL_ADDRESS = "deine.email@example.com";       // <<< ERSETZE DIES!
const LINKEDIN_URL = "https://www.linkedin.com/in/deinprofil/"; // <<< ERSETZE DIES!
const INSTAGRAM_URL = "https://www.instagram.com/deinprofil/"; // <<< ERSETZE DIES!
const GITHUB_URL = "https://github.com/deinprofil/";         // <<< ERSETZE DIES!
// ================================================================================
// ================================================================================


// Stile für den Footer und die Icons (Inline-Stile als Beispiel)
const footerStyle = {
  textAlign: 'center',
  padding: '30px 20px',
  marginTop: '40px',
};

const socialIconsContainerStyle = {
  marginBottom: '20px', // Abstand zum Copyright-Text
  display: 'flex',
  justifyContent: 'center',
  gap: '25px', // Abstand zwischen den Icons
};

const iconLinkStyle = {
  color: '#333', // Standardfarbe der Icons
  textDecoration: 'none',
  fontSize: '1.8rem', // Größe der Icons anpassen (react-icons reagieren auf fontSize)
  transition: 'color 0.3s ease, transform 0.2s ease', // Für Hover-Effekte
};

const iconLinkHoverStyle = {
  color: '#007bff', // Farbe beim Hovern
  transform: 'scale(1.15)', // Leichtes Vergrößern beim Hovern
};


function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: `mailto:${MY_EMAIL_ADDRESS}`,
      IconComponent: CiMail, // react-icon Komponente
      labelKey: 'footer.iconAltEmail',
      defaultLabel: 'E-Mail senden',
    },
    {
      href: LINKEDIN_URL,
      IconComponent: CiLinkedin, // Oder FaLinkedin, je nach gewünschtem Icon
      labelKey: 'footer.iconAltLinkedIn',
      defaultLabel: 'LinkedIn Profil',
    },
    {
      href: INSTAGRAM_URL,
      IconComponent: FaInstagram,
      labelKey: 'footer.iconAltInstagram',
      defaultLabel: 'Instagram Profil',
    },
    {
      href: GITHUB_URL,
      IconComponent: FaGithub,
      labelKey: 'footer.iconAltGitHub',
      defaultLabel: 'GitHub Profil',
    },
  ];

  return (
    <footer style={footerStyle}>
      <div style={socialIconsContainerStyle}>
        {socialLinks.map((linkInfo, index) => (
          <a
            key={index}
            href={linkInfo.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(linkInfo.labelKey, linkInfo.defaultLabel)}
            title={t(linkInfo.labelKey, linkInfo.defaultLabel)} // Tooltip
            style={iconLinkStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.color = iconLinkHoverStyle.color;
              e.currentTarget.style.transform = iconLinkHoverStyle.transform;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = iconLinkStyle.color;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Die react-icon Komponente wird hier direkt gerendert */}
            <linkInfo.IconComponent />
          </a>
        ))}
      </div>

      <p style={{ fontSize: '0.9em', color: '#6c757d', margin: 0 }}>
        {t('footer.copyrightText', { year: currentYear })}
      </p>
    </footer>
  );
}

export default Footer;