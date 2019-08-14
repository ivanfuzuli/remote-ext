import difference from 'lodash/difference';
import Keyboard from './keyboard.js';
import bindIntersectionObservers from './intersection-observer.js';
import domObserver from './dom-observer.js';
import SpatialNavigation from './spatial-navigation.js';


import './content.css';

function init() {

  SpatialNavigation.init();
  // Define navigable elements (anchors and elements with "focusable" class).
  SpatialNavigation.add({
    selector: 'a, .focusable'
  });

  // Focus the first navigable element.
  SpatialNavigation.focus();

  const keyboard = new Keyboard();

  const allItems = document.querySelectorAll('a');
  let { observer, 
        getFilteredEntries, 
        recalculateEntriesCoordinates, 
        recalculateEntryCoordinate } = bindIntersectionObservers();

  keyboard.getFilteredEntries = getFilteredEntries;
  keyboard.recalculateEntriesCoordinates = recalculateEntriesCoordinates;
  keyboard.recalculateEntryCoordinate = recalculateEntryCoordinate;

  function updateObservers(addedNodes) {
    addedNodes.forEach((elm) => {
      observer.observe(elm);
    });
  }

  domObserver(updateObservers);
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