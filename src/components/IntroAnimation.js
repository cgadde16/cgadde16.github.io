import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SyntaxHighlighter from 'react-syntax-highlighter';
import './IntroAnimation.css';

const modernLightTheme = {
  hljs: { display: 'block', overflowX: 'auto', padding: '0.5em', background: '#ffffff', color: '#383a42' },
  'hljs-comment': { color: '#a0a1a7', fontStyle: 'italic' }, 'hljs-quote': { color: '#a0a1a7', fontStyle: 'italic' }, 'hljs-doctag': { color: '#a626a4' }, 'hljs-keyword': { color: '#a626a4' }, 'hljs-formula': { color: '#a626a4' }, 'hljs-section': { color: '#e45649' }, 'hljs-name': { color: '#e45649' }, 'hljs-selector-tag': { color: '#e45649' }, 'hljs-deletion': { color: '#e45649' }, 'hljs-subst': { color: '#e45649' }, 'hljs-literal': { color: '#0184bb' }, 'hljs-string': { color: '#50a14f' }, 'hljs-regexp': { color: '#50a14f' }, 'hljs-addition': { color: '#50a14f' }, 'hljs-attribute': { color: '#50a14f' }, 'hljs-meta-string': { color: '#50a14f' }, 'hljs-built_in': { color: '#c18401' }, 'hljs-class .hljs-title': { color: '#c18401' }, 'hljs-attr': { color: '#986801' }, 'hljs-variable': { color: '#986801' }, 'hljs-template-variable': { color: '#986801' }, 'hljs-type': { color: '#986801' }, 'hljs-selector-class': { color: '#986801' }, 'hljs-selector-attr': { color: '#986801' }, 'hljs-selector-pseudo': { color: '#986801' }, 'hljs-number': { color: '#986801' }, 'hljs-symbol': { color: '#4078f2' }, 'hljs-bullet': { color: '#4078f2' }, 'hljs-link': { color: '#4078f2' }, 'hljs-meta': { color: '#4078f2' }, 'hljs-selector-id': { color: '#4078f2' }, 'hljs-title': { color: '#4078f2' }
};

const IntroAnimation = ({ onFinish }) => {
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const [animatedSubtitle, setAnimatedSubtitle] = useState('');
  const [isTextAnimating, setIsTextAnimating] = useState(true);

  const personName = t('person.name');
  const loadingText = 'Loading Profile';

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

    let textTimeout;
    let codeTypingInterval;

    const codeTypingTimeout = setTimeout(() => {
      let lineIndex = 0;
      codeTypingInterval = setInterval(() => {
        if (lineIndex < codeLines.length) {
          setCode(prev => prev + codeLines[lineIndex] + '\n');
          lineIndex++;
        } else {
          clearInterval(codeTypingInterval);
        }
      }, 20);
    }, 100);

    const TYPING_SPEED = 20;
    const DOT_SPEED = 300;
    const DELETE_SPEED = 20;
    const PAUSE_AFTER_DOTS = 200;

    const typeText = (text, index, onComplete) => {
      if (index <= text.length) {
        setAnimatedSubtitle(text.substring(0, index));
        textTimeout = setTimeout(() => typeText(text, index + 1, onComplete), TYPING_SPEED);
      } else {
        onComplete();
      }
    };

    const showDots = (count = 1) => {
      if (count <= 3) {
        setAnimatedSubtitle(`${loadingText}${'.'.repeat(count)}`);
        textTimeout = setTimeout(() => showDots(count + 1), DOT_SPEED);
      } else {
        textTimeout = setTimeout(() => {
          deleteText((loadingText.length + 3), () => {
            setAnimatedSubtitle('');
            setIsTextAnimating(false);
            textTimeout = setTimeout(() => {
              setIsFadingOut(true);
              if (onFinish) onFinish();
              setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = 'auto';
              }, 400);
            }, 500);
          });
        }, PAUSE_AFTER_DOTS);
      }
    };

    const deleteText = (index, onComplete) => {
      if (index >= 0) {
        setAnimatedSubtitle(prev => prev.substring(0, index));
        textTimeout = setTimeout(() => deleteText(index - 1, onComplete), DELETE_SPEED);
      } else {
        onComplete();
      }
    };

    textTimeout = setTimeout(() => {
      typeText(loadingText, 0, () => {
        setTimeout(() => {
          showDots();
        }, DOT_SPEED);
      });
    }, 500);

    return () => {
      clearTimeout(codeTypingTimeout);
      clearInterval(codeTypingInterval);
      clearTimeout(textTimeout);
      document.body.style.overflow = 'auto';
    };
  }, [personName, onFinish]);

  if (!isVisible) return null;

  return (
    <div className={`intro-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="intro-top-section">
        <div className={`intro-header ${showHeader ? 'show' : ''}`}>
          <h1 className="intro-name">{personName}</h1>
          <p className="intro-subtitle">
            {animatedSubtitle || '\u00A0'}
          </p>
        </div>
      </div>

      {/* 
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
            <span className="blinking-cursor-code">_</span>
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

export default IntroAnimation;
