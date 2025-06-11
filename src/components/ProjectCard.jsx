import React from 'react';
import './ProjectCard.css'; // Stelle sicher, dass der Pfad zu deiner CSS-Datei korrekt ist

const ProjectCard = ({ project, onCardClick }) => {
  // Wenn kein Projekt übergeben wird, rendere nichts
  if (!project) {
    return null;
  }

  // Funktion, die beim Klick auf die Karte ausgeführt wird
  const handleCardClick = (e) => {
    // Verhindere das Standardverhalten für Links innerhalb der Karte,
    // damit der onCardClick-Handler nicht ausgelöst wird, wenn man auf einen echten Link klickt.
    if (e.target.tagName.toLowerCase() === 'a' && e.target.href && e.target.href !== '#') {
      // Wenn es ein Link ist und nicht nur ein Anker (#), dann lasse den Browser navigieren
      return;
    }

    // Wenn eine onCardClick-Prop übergeben wurde, rufe sie auf
    if (onCardClick) {
      onCardClick();
    } else if (project.link) {
      // Andernfalls, wenn das Projekt einen Link hat, öffne ihn in einem neuen Tab
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Bestimme, ob für dieses spezielle Projekt 'object-fit: contain' verwendet werden soll.
  // Du kannst dies anpassen, z.B. anhand einer Projekt-ID oder eines Flags im Projektobjekt.
  // Beispiel: const useContain = project.id === 'spezifische-projekt-id';
  // Beispiel: const useContain = project.imageDisplayMode === 'contain';
 const useContain = project.id === 'proj2' || project.id === 'proj4' || project.id === 'proj1';

  return (
    <div
      className="project-card"
      tabIndex={0} // Macht das Div fokussierbar für Tastaturnavigation
      role="button" // Semantische Rolle für Interaktivität
      onClick={handleCardClick} // Klick-Handler
      onKeyDown={(e) => {
        // Erlaube Auslösung durch Enter oder Leertaste für Barrierefreiheit
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Verhindere Standardaktionen (z.B. Scrollen bei Leertaste)
          handleCardClick(e);
        }
      }}
    >
      {project.imageUrl ? (
        // Wenn eine Bild-URL vorhanden ist, zeige das Bild an
        <img
          src={project.imageUrl}
          alt={project.title || 'Projektbild'} // Alternativtext für das Bild
          className={`project-card__image ${useContain ? 'project-card__image--contain' : ''}`}
          // Die Klasse 'project-card__image--contain' wird nur hinzugefügt, wenn useContain true ist
        />
      ) : (
        // Andernfalls zeige einen Platzhalter an
        <div className="project-card__placeholder">
          {project.title || "Projektbild"}
        </div>
      )}

      {/* Overlay mit Titel und Beschreibung */}
      <div className="project-card__overlay">
        <h3 className="project-card__title">{project.title || 'Unbenanntes Projekt'}</h3>
        <p className="project-card__description">
          {project.description || "Keine detaillierte Beschreibung verfügbar."}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;