// src/components/Projects.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Projects.css';

// Erweiterte Projektdaten mit mehreren Bildern pro Projekt
const projectBaseData = [
  { 
    id: 'proj1', 
    images: [
      "/images/bsi.jpg",
    ],
    link: "#" 
  },
  { 
    id: 'proj2', 
    images: [
      "/images/bkc.png",
      "/images/image2.jpeg",
      "/images/image3.jpeg"
    ],
    link: "#" 
  },
  { 
    id: 'proj3', 
    images: [
      "/images/brs.jpeg"
    ],
    link: "#" 
  },
  { 
    id: 'proj4', 
    images: [
      "/images/react.png"
    ],
    link: "#" 
  },
  { 
    id: 'proj5',
    images: [
      "/images/image1.jpeg",
      "/images/image2.jpeg",
      "/images/image3.jpeg"
    ],
    link: "#" 
  },
  { 
    id: 'proj6', 
    images: [
      "/images/image1.jpeg",
      "/images/image2.jpeg",
      "/images/image3.jpeg"
    ],
    link: "#" 
  },
  { 
    id: 'proj7', 
    images: [
      "/images/image1.jpeg",
      "/images/image2.jpeg",
      "/images/image3.jpeg"
    ],
    link: "#" 
  },
  { 
    id: 'proj8', 
    images: [
      "/images/image1.jpeg",
      "/images/image2.jpeg",
      "/images/image3.jpeg"
    ],
    link: "#" 
  },
  { 
    id: 'proj9', 
    images: [
      "/images/image1.jpeg",
      "/images/image2.jpeg",
      "/images/image3.jpeg"
    ],
    link: "#" 
  },
  { 
    id: 'proj10', 
    images: [
      "/images/image1.jpeg",
      "/images/image2.jpeg",
      "/images/image3.jpeg"
    ],
    link: "#" 
  },
];

const CARD_WIDTH_WITH_GAP = 320 + 20;

const Projects = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const translatedProjectsData = useMemo(() => {
    return projectBaseData.map(project => ({
      ...project,
      title: t(`projectsData.${project.id}.title`, `Projekt ${project.id}`),
      description: t(`projectsData.${project.id}.description`, `Beschreibung für ${project.id}`),
      category: t(`projectsData.${project.id}.category`, `Kategorie für ${project.id}`),
      // Für Rückwärtskompatibilität mit ProjectCard - verwendet das erste Bild als imageUrl
      imageUrl: project.images && project.images.length > 0 ? project.images[0] : null,
    }));
  }, [t]);

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const threshold = 1;
      setCanScrollLeft(scrollPosition > threshold);
      setCanScrollRight(scrollPosition < (maxScrollLeft - threshold));
    }
  }, [scrollPosition]);

  useEffect(() => {
    checkScrollability();
  }, [checkScrollability, translatedProjectsData]);

  // Mausrad-Event-Handler
  const handleWheel = useCallback((e) => {
    e.preventDefault(); // Verhindert das normale Scrollen der Seite
    
    const container = scrollContainerRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const scrollAmount = CARD_WIDTH_WITH_GAP * 0.8; // Sanftere Scroll-Geschwindigkeit
      
      let newScrollPosition;
      if (e.deltaY > 0) {
        // Nach rechts scrollen
        newScrollPosition = Math.min(scrollPosition + scrollAmount, maxScrollLeft);
      } else {
        // Nach links scrollen
        newScrollPosition = Math.max(scrollPosition - scrollAmount, 0);
      }
      
      setScrollPosition(newScrollPosition);
      container.scrollLeft = newScrollPosition;
    }
  }, [scrollPosition]);

  // Event-Listener für Mausrad hinzufügen
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      // Scroll-Position synchronisieren (falls manuell gescrollt wird)
      const handleScroll = () => {
        setScrollPosition(container.scrollLeft);
      };
      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleWheel]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const scrollAmount = CARD_WIDTH_WITH_GAP * 2.5;
      
      let newScrollPosition;
      if (direction === 'left') {
        newScrollPosition = Math.max(scrollPosition - scrollAmount, 0);
      } else {
        newScrollPosition = Math.min(scrollPosition + scrollAmount, maxScrollLeft);
      }
      
      setScrollPosition(newScrollPosition);
      container.scrollLeft = newScrollPosition;
    }
  };

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <section className="projects-section" id="projects">
        <h2 className="projects-headline">{t('projectsHeadline', 'Projekte')}</h2>
        <div className="projects-content-wrapper">
          {canScrollLeft && (
            <button
              className={`navigation-arrow left-arrow ${!canScrollLeft ? 'arrow-disabled' : ''}`}
              onClick={() => scroll('left')}
              aria-label={t('projects.scrollLeft', 'Nach links scrollen')}
              disabled={!canScrollLeft}
            >
              <FaChevronLeft />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="cards-outer-container"
          >
            <div className="cards-inner-container">
              {translatedProjectsData.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onCardClick={() => openModal(project)}
                />
              ))}
            </div>
          </div>

          {canScrollRight && (
            <button
              className={`navigation-arrow right-arrow ${!canScrollRight ? 'arrow-disabled' : ''}`}
              onClick={() => scroll('right')}
              aria-label={t('projects.scrollRight', 'Nach rechts scrollen')}
              disabled={!canScrollRight}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </section>

      {isModalOpen && selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      )}
    </>
  );
};

export default Projects;