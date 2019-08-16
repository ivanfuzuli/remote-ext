import bindIntersectionObservers from './intersection-observer.js';
import domObserver from './dom-observer.js';
import SpatialNavigation from './spatial-navigation.js';
import FocusIndicator from './focus-indicator.js';

import './content.css';

function init() {

  FocusIndicator.init();
  SpatialNavigation.init();

  let { observer, 
        getFilteredEntries
      } = bindIntersectionObservers();

  SpatialNavigation.bindFilteredEntries(getFilteredEntries);
  
  
  function updateObservers(addedNodes) {
    addedNodes.forEach((elm) => {
      observer.observe(elm);
    });
  }

  domObserver(updateObservers);

  // Focus the first navigable element.
  SpatialNavigation.focus();
}


window.addEventListener('load', () => {
  init();
});

// TODO: Only development
window.addEventListener('keypress', (e) => {
  if (e.key === 'r') {
    window.location = 'http://reload.extensions';
  } 
});