import React, { useState } from 'react';
import './App.css'; 

import TimelineEvents from './components/TimelineEvents';
import Projects from './components/Projects';   
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import Person from "./components/Person";
import IntroAnimation from "./components/IntroAnimation";

function App() {
  // Dieser State bleibt. Er steuert den Start der Person-Komponente.
  const [introDone, setIntroDone] = useState(false);

  // NEU: Ein zweiter State, der den Start der TimelineEvents-Komponente steuert.
  const [personAnimationDone, setPersonAnimationDone] = useState(false);

  // NEU: Diese Handler-Funktion wird von der Person-Komponente aufgerufen,
  // wenn ihre Animationen abgeschlossen sind.
  const handlePersonAnimationComplete = () => {
    console.log("Person animation finished. Starting TimelineEvents animation."); // Optional: für Debugging
    setPersonAnimationDone(true);
  };

  return (
    <div className="App">
      {/* 1. IntroAnimation: Wenn sie fertig ist, setzt sie introDone auf true. */}
      {!introDone && <IntroAnimation onFinish={() => setIntroDone(true)} />}
      
      {/* 2. Person: 
            - startTyping wartet auf introDone.
            - onAnimationComplete ruft unseren neuen Handler auf, wenn sie fertig ist.
      */}
      <Person 
        startTyping={introDone} 
        onAnimationComplete={handlePersonAnimationComplete} 
      />
      
      {/* 3. TimelineEvents:
            - Die startAnimation Prop wartet jetzt auf personAnimationDone.
      */}
      <TimelineEvents startAnimation={personAnimationDone} />
      
      {/* Die restlichen Komponenten bleiben unverändert. */}
      <Projects />
      <Skills />
      <Footer />
    </div>
  );
}

export default App;