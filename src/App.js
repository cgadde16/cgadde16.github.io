import React, { useState } from 'react';
import './App.css'; // Dein globales App-CSS

import TimelineEvents from './components/TimelineEvents'; // Unsere Haupt-Timeline-Komponente
import Projects from './components/Projects';   
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import Person from "./components/Person";
import IntroAnimation from "./components/IntroAnimation"

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="App">
      {!introDone && <IntroAnimation onFinish={() => setIntroDone(true)} />}
      <Person startTyping={introDone} />
      <TimelineEvents />
      <Projects />
      <Skills />
      <Footer />
    </div>
  );
}

export default App;
