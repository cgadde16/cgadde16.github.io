import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import './TimelineEvents.css';
import { useTranslation } from 'react-i18next';

const eventLogos = [
  "images/uni.jpg",
  "/images/fkie.png",
  "/images/bsi.jpg",
  "/images/htg.jpg"
];

const SLOT_ITEM_HEIGHT = 100;
const SCROLL_RELEASE_COOLDOWN = 300;

// NEU: startAnimation als Prop hinzugefügt
function TimelineEvents({ startAnimation }) {
  const { t } = useTranslation();

  const initialEvents = useMemo(() => (
    Array.from({ length: 4 }, (_, i) => {
      const id = i + 1;
      return {
        id,
        title: t(`timeline.events.event${id}.title`),
        subtitle: t(`timeline.events.event${id}.subtitle`),
        sidebarTitle: t(`timeline.events.event${id}.sidebarTitle`) || t(`timeline.events.event${id}.title`),
        content: t(`timeline.events.event${id}.content`),
        date: t(`timeline.events.event${id}.date`),
        logoUrl: eventLogos[i],
      };
    })
  ), [t]);

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [calculatedFontSize, setCalculatedFontSize] = useState('2.5em');
  const [sidebarReady, setSidebarReady] = useState(false);
  
  // GELÖSCHT: Der interne State und der useEffect für die Animation werden nicht mehr benötigt.
  // const [startAnimation, setStartAnimation] = useState(false);
  // useEffect(() => { ... });

  const contentWrapperRef = useRef(null);
  const sidebarRef = useRef(null);
  const testElementRef = useRef(null);
  const lastBlockedScrollTimeRef = useRef(0);
  const atTimelineEdgeRef = useRef(false);
  const logoContainerRef = useRef(null);
  const textContentRef = useRef(null);

  useLayoutEffect(() => {
    const logoEl = logoContainerRef.current;
    const textEl = textContentRef.current;
    
    if (window.innerWidth <= 768) {
      if (textEl) textEl.style.marginRight = '0';
      return;
    }

    if (logoEl && textEl) {
      const logoWidth = logoEl.offsetWidth;
      const gap = 32;
      textEl.style.marginRight = `${logoWidth + gap}px`;
    }

    return () => {
      if (textEl) {
        textEl.style.marginRight = '0';
      }
    };
  }, [currentEventIndex, initialEvents]);

  // Alle anderen Hooks (calculateOptimalFontSize, handleWheel etc.) bleiben unverändert...
  const calculateOptimalFontSize = useCallback(() => {
    if (!sidebarRef.current || !initialEvents || initialEvents.length === 0) {
        setCalculatedFontSize('2.5em'); 
        return;
    }
    if (!testElementRef.current) {
      testElementRef.current = document.createElement('div');
      testElementRef.current.style.position = 'absolute';
      testElementRef.current.style.left = '-9999px';
      testElementRef.current.style.top = '-9999px';
      testElementRef.current.style.whiteSpace = 'nowrap';
      
      let fontFamily = 'sans-serif';
      if (document.body) { 
        const bodyStyles = window.getComputedStyle(document.body);
        fontFamily = bodyStyles.getPropertyValue('font-family').split(',')[0].trim() || 'sans-serif';
        if (fontFamily.startsWith('"') && fontFamily.endsWith('"')) {
          fontFamily = fontFamily.substring(1, fontFamily.length -1);
        }
      }
      testElementRef.current.style.fontFamily = fontFamily;
      testElementRef.current.style.fontWeight = '700'; 
      testElementRef.current.style.padding = '0 8px';  
      document.body.appendChild(testElementRef.current);
    }
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const slotMachineWheelWidth = sidebarRect.width * 0.90; 
    const slotItemPaddingHorizontal = 8 * 2; 
    const netTextWidthInSlotItem = slotMachineWheelWidth - slotItemPaddingHorizontal;
    const targetTextWidth = netTextWidthInSlotItem * 0.80; 
    const longestTitle = initialEvents.reduce((longest, event) => {
      const title = event.sidebarTitle || event.title || "";
      return title.length > longest.length ? title : longest;
    }, '');
    if (!longestTitle) {
        setCalculatedFontSize('2em'); 
        return;
    }
    let minSize = 8;  
    let maxSize = SLOT_ITEM_HEIGHT * 0.9; 
    let optimalSize = minSize;
    for (let i = 0; i < 20; i++) { 
        const testSize = (minSize + maxSize) / 2;
        if (testSize <= 0) { 
            optimalSize = 1; 
            break;
        }
        testElementRef.current.style.fontSize = `${testSize}px`;
        testElementRef.current.textContent = longestTitle;
        const currentTestWidth = testElementRef.current.getBoundingClientRect().width;
        if (currentTestWidth <= targetTextWidth) {
            optimalSize = testSize;
            minSize = testSize; 
        } else {
            maxSize = testSize;
        }
        if (maxSize - minSize < 0.5) break; 
    }
    const practicalMaxFontSize = SLOT_ITEM_HEIGHT * 0.8; 
    optimalSize = Math.min(optimalSize, practicalMaxFontSize);
    const baseFontSizeForEm = 16; 
    const finalFontSize = `${(optimalSize / baseFontSizeForEm).toFixed(2)}em`;
    setCalculatedFontSize(finalFontSize);
  }, [initialEvents]);

  useEffect(() => {
    const updateLayout = () => {
      calculateOptimalFontSize();
      setTimeout(() => setSidebarReady(true), 50);
    };
    const timeoutId = setTimeout(updateLayout, 100); 
    window.addEventListener('resize', updateLayout);
    return () => {
      window.removeEventListener('resize', updateLayout);
      clearTimeout(timeoutId);
    }
  }, [calculateOptimalFontSize]);

  useEffect(() => {
    return () => {
      if (testElementRef.current && document.body.contains(testElementRef.current)) {
        document.body.removeChild(testElementRef.current);
        testElementRef.current = null; 
      }
    };
  }, []);

  const slotListTranslateY = useMemo(() => {
    if (!sidebarRef.current || initialEvents.length === 0 || !sidebarReady) return 0;
    const sidebarHeight = sidebarRef.current.offsetHeight;
    const sidebarCenter = sidebarHeight / 2;
    const itemTopPosition = currentEventIndex * SLOT_ITEM_HEIGHT;
    const itemCenterCorrection = SLOT_ITEM_HEIGHT / 2;
    return sidebarCenter - itemTopPosition - itemCenterCorrection;
  }, [currentEventIndex, initialEvents.length, sidebarReady]);

  const handleSidebarClick = useCallback((targetIndex) => {
    if (targetIndex >= 0 && targetIndex < initialEvents.length) {
      setCurrentEventIndex(targetIndex);
      atTimelineEdgeRef.current = (targetIndex === 0 || targetIndex === initialEvents.length - 1);
    }
  }, [initialEvents.length]);

  const handleWheel = useCallback((event) => {
    if (initialEvents.length === 0) return;
    const scrollDeltaY = event.deltaY;
    let blockPageScroll = true;
    const isScrollingUp = scrollDeltaY < 0;
    const isScrollingDown = scrollDeltaY > 0;
    const atTopEdge = currentEventIndex === 0;
    const atBottomEdge = currentEventIndex === initialEvents.length - 1;
    let newIndex = currentEventIndex;
    if (isScrollingDown) {
      newIndex = Math.min(currentEventIndex + 1, initialEvents.length - 1);
    } else if (isScrollingUp) {
      newIndex = Math.max(currentEventIndex - 1, 0);
    }
    if (atTimelineEdgeRef.current && ((isScrollingUp && atTopEdge) || (isScrollingDown && atBottomEdge)) && (Date.now() - lastBlockedScrollTimeRef.current < SCROLL_RELEASE_COOLDOWN)) {
      blockPageScroll = true;
    } else if ((isScrollingUp && atTopEdge && newIndex === currentEventIndex) || (isScrollingDown && atBottomEdge && newIndex === currentEventIndex)) {
      blockPageScroll = false;
      lastBlockedScrollTimeRef.current = Date.now();
    } else {
      blockPageScroll = true;
    }
    if (blockPageScroll) {
      event.preventDefault();
      if (newIndex !== currentEventIndex) {
        setCurrentEventIndex(newIndex);
        atTimelineEdgeRef.current = (newIndex === 0 || newIndex === initialEvents.length - 1);
      } else {
        atTimelineEdgeRef.current = atTopEdge || atBottomEdge;
      }
    } else {
      atTimelineEdgeRef.current = false;
    }
  }, [currentEventIndex, initialEvents.length]);

  useEffect(() => {
    const mainContainer = contentWrapperRef.current;
    if (mainContainer) {
      mainContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    if (initialEvents.length > 0) {
        atTimelineEdgeRef.current = (currentEventIndex === 0 || currentEventIndex === initialEvents.length - 1);
    }
    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel, currentEventIndex, initialEvents.length]);

  useEffect(() => {
    if (initialEvents.length > 0) {
      setCurrentEventIndex(prevIndex => Math.min(prevIndex, initialEvents.length - 1));
    } else {
      setCurrentEventIndex(0);
    }
  }, [initialEvents]);
  
  // ...

  if (!initialEvents || initialEvents.length === 0) {
    return <div className="timeline-container" style={{justifyContent: 'center', alignItems: 'center', color: 'white'}}><p>{t('timeline.noEvents')}</p></div>;
  }

  const currentEventData = initialEvents[currentEventIndex];
  const dynamicSidebarStyle = { '--main-slot-font-size': calculatedFontSize };

  return (
    <div className="timeline-container" ref={contentWrapperRef}>
      {/* GEÄNDERT: Die Klasse wird jetzt durch die Prop 'startAnimation' gesteuert */}
      <div className={`event-content-area ${startAnimation ? 'animate-in' : ''}`}>
        {currentEventData && (
          <div className="event-card active-event-card">
            <div ref={logoContainerRef} className="event-logo-container">
              <img 
                src={process.env.PUBLIC_URL + currentEventData.logoUrl} 
                alt={`${currentEventData.title} logo`} 
                className="event-logo"
              />
            </div>
            <div ref={textContentRef} className="event-text-content">
              <h2>{currentEventData.title}</h2>
              <h3>{currentEventData.subtitle}</h3>
              <p className="event-date">{currentEventData.date}</p>
              <p>{currentEventData.content}</p>
            </div>
          </div>
        )}
      </div>

      {/* GEÄNDERT: Die Klasse wird jetzt durch die Prop 'startAnimation' gesteuert */}
      <div 
        className={`titles-sidebar ${startAnimation ? 'animate-in' : ''}`} 
        ref={sidebarRef} 
        style={dynamicSidebarStyle}
      >
        <div className="titles-list-wrapper">
          <div
            className="slot-list"
            style={{ 
              transform: `translateY(${slotListTranslateY}px)`,
              opacity: sidebarReady ? 1 : 0,
              transition: sidebarReady ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease' : 'none'
            }}
          >
            {initialEvents.map((event, index) => (
              <div
                key={event.id}
                className={`slot-item ${index === currentEventIndex ? 'current' : ''}`}
                onClick={() => handleSidebarClick(index)}
                role="button"
                tabIndex={0}
              >
                {event.sidebarTitle || event.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineEvents;