import difference from 'lodash/difference';
import Keyboard from './keyboard.js';
import bindIntersectionObservers from './intersection-observer.js';
import domObserver from './dom-observer.js';

import { createLoading } from './layout.js';
import './content.css';

const $loading = createLoading();

function init() {
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
  setTimeout(() => {
    $loading.remove();
  }, 250);

  init();
});

// TODO: Only development
window.addEventListener('keypress', (e) => {
  if (e.key === 'r') {
    window.location = 'http://reload.extensions';
  } 
});