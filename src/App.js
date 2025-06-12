// src/App.jsx
import React from 'react';
import './App.css'; // Dein globales App-CSS

import TimelineEvents from './components/TimelineEvents'; // Unsere Haupt-Timeline-Komponente
import Projects from './components/Projects';   
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import Person from "./components/Person";
import IntroAnimation from "./components/IntroAnimation"

function App() {
  return (
    <div className="App">
      <IntroAnimation />
      <Person />
      <TimelineEvents />
      <Projects />
      <Skills />
      <Footer />
      
    </div>
  );
}

export default App;