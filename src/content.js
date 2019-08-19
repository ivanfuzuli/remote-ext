import bindIntersectionObservers from './intersection-observer.js';
import domObserver from './dom-observer.js';
import SpatialNavigation from './spatial-navigation.js';
import DesktopAdaptor from './adaptors/desktop.js';

import FocusIndicator from './focus-indicator.js';
import VideoIndicator from './video-indicator.js';

import './content.css';

function init() {

  FocusIndicator.init();
  VideoIndicator.init();

  DesktopAdaptor.init();
  
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