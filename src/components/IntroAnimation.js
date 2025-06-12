// src/components/IntroAnimation.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SyntaxHighlighter from 'react-syntax-highlighter';
import './IntroAnimation.css';

// Das Theme für den SyntaxHighlighter (unverändert)
const modernLightTheme = {
  hljs: { display: 'block', overflowX: 'auto', padding: '0.5em', background: '#ffffff', color: '#383a42' },
  'hljs-comment': { color: '#a0a1a7', fontStyle: 'italic' }, 'hljs-quote': { color: '#a0a1a7', fontStyle: 'italic' }, 'hljs-doctag': { color: '#a626a4' }, 'hljs-keyword': { color: '#a626a4' }, 'hljs-formula': { color: '#a626a4' }, 'hljs-section': { color: '#e45649' }, 'hljs-name': { color: '#e45649' }, 'hljs-selector-tag': { color: '#e45649' }, 'hljs-deletion': { color: '#e45649' }, 'hljs-subst': { color: '#e45649' }, 'hljs-literal': { color: '#0184bb' }, 'hljs-string': { color: '#50a14f' }, 'hljs-regexp': { color: '#50a14f' }, 'hljs-addition': { color: '#50a14f' }, 'hljs-attribute': { color: '#50a14f' }, 'hljs-meta-string': { color: '#50a14f' }, 'hljs-built_in': { color: '#c18401' }, 'hljs-class .hljs-title': { color: '#c18401' }, 'hljs-attr': { color: '#986801' }, 'hljs-variable': { color: '#986801' }, 'hljs-template-variable': { color: '#986801' }, 'hljs-type': { color: '#986801' }, 'hljs-selector-class': { color: '#986801' }, 'hljs-selector-attr': { color: '#986801' }, 'hljs-selector-pseudo': { color: '#986801' }, 'hljs-number': { color: '#986801' }, 'hljs-symbol': { color: '#4078f2' }, 'hljs-bullet': { color: '#4078f2' }, 'hljs-link': { color: '#4078f2' }, 'hljs-meta': { color: '#4078f2' }, 'hljs-selector-id': { color: '#4078f2' }, 'hljs-title': { color: '#4078f2' }
};

const IntroAnimation = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  
  // Hole Name und Titel aus den Übersetzungen
  const personName = t('person.name');
  // ===== NEU: Hole den Titel aus den Übersetzungen =====
  const titleOrProfession = t('person.titleOrProfession');

  const codeLines = [
    "import React, { useState, useEffect } from 'react';",
    "import './styles/App.css';",
    '',
    `// Initializing portfolio for ${personName}`,
    'const HomePage = () => {',
    '  const [contentReady, setContentReady] = useState(false);',
    '',
    '  useEffect(() => {',
    '    const timer = setTimeout(() => setContentReady(true), 1500);',
    '    return () => clearTimeout(timer);',
    '  }, []);',
    '',
    '  return (',
    '    <div className="main-container">',
    `      <h1>Welcome to ${personName}'s Portfolio</h1>`,
    '      <p>System Initialized Successfully!</p>',
    '    </div>',
    '  );',
    '};',
    '',
    'export default HomePage;',
    '// --- Boot sequence complete ---',
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setShowHeader(true);

    let lineIndex = 0;
    const typingTimeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (lineIndex < codeLines.length) {
          setCode(prev => prev + codeLines[lineIndex] + '\n');
          lineIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20);
    }, 100);

    const animationTimeout = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'auto';
      }, 400); // Dauer der Fade-Animation
    }, 3000); // Startet Ausblenden nach 3 Sekunden

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(animationTimeout);
      document.body.style.overflow = 'auto';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isVisible) return null;

  return (
    <div className={`intro-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="intro-top-section">
        <div className={`intro-header ${showHeader ? 'show' : ''}`}>
          <h1 className="intro-name">{personName}</h1>
          {/* ===== GEÄNDERT: Zeige den dynamischen Titel anstelle von "Portfolio Loading..." ===== */}
          <p className="intro-subtitle">{titleOrProfession}</p>
        </div>
      </div>

      <div className="intro-bottom-section">
        <div className="intro-code-container">
          <SyntaxHighlighter
            language="javascript"
            style={modernLightTheme}
            showLineNumbers
            customStyle={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              padding: '20px',
              background: '#ffffff',
              fontSize: '14px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
            lineNumberStyle={{
              color: '#858585',
              paddingRight: '1em',
              fontSize: '14px',
            }}
            codeTagProps={{
              style: {
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontSize: '14px',
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
          <div className="blinking-cursor-container">
            <span className="blinking-cursor">_</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;