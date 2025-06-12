import React, { useState, useEffect } from 'react';
import './IntroAnimation.css'; // Wir werden auch die CSS-Datei anpassen

const IntroAnimation = () => {
  // Wir speichern jetzt ein Array der getippten Zeilen, nicht mehr einen einzelnen String
  const [typedLines, setTypedLines] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Der React-Code, der angezeigt werden soll
  const codeLines = [
    'import React, { useState, useEffect } from \'react\';',
    'import \'./styles/App.css\';',
    '',
    'const HomePage = () => {',
    '  const [contentReady, setContentReady] = useState(false);',
    '',
    '  useEffect(() => {',
    '    // Simulate fetching data or loading assets',
    '    const timer = setTimeout(() => setContentReady(true), 1500);',
    '    return () => clearTimeout(timer);',
    '  }, []);',
    '',
    '  return (',
    '    <div className="main-container">',
    '      <h1>Website Initialized.</h1>',
    '      <p>Welcome, User!</p>',
    '      {contentReady',
    '        ? <p>Status: [Render Complete]</p>',
    '        : <p>Status: [Loading Resources...]</p>',
    '      }',
    '    </div>',
    '  );',
    '};',
    '',
    'export default HomePage;',
    '// --- Boot sequence complete ---',
  ];

  useEffect(() => {
    // Falls du die Animation doch wieder nur einmalig zeigen willst,
    // kannst du hier die localStorage-Logik wieder einbauen.
    // Für die Anzeige bei jedem Refresh lassen wir sie weg.

    document.body.style.overflow = 'hidden';

    let lineIndex = 0;
    const typingInterval = setInterval(() => {
      if (lineIndex < codeLines.length) {
        // Füge die nächste Zeile zum Array hinzu
        setTypedLines(prevLines => [...prevLines, codeLines[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 70); // Etwas langsamer, damit man es besser lesen kann

    const animationTimeout = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'auto';
      }, 500);
    }, 3000); // Gesamtdauer leicht erhöht

    return () => {
      clearInterval(typingInterval);
      clearTimeout(animationTimeout);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`intro-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="code-output">
        {/* Wir mappen jetzt über das Array und rendern für jede Zeile eine eigene Komponente */}
        {typedLines.map((line, index) => (
          <div className="code-line" key={index}>
            <span className="line-number">{index + 1}</span>
            <span className="line-content">{line}</span>
          </div>
        ))}
        {/* Der Cursor erscheint am Ende */}
        <div className="code-line">
           <span className="line-number"></span>
           <span className="blinking-cursor">_</span>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;