import extendArray from './extend-array.js';

import difference from 'lodash/difference';
import Keyboard from './keyboard.js';
import bindIntersectionObservers from './intersection-observer.js';
import domObserver from './dom-observer.js';

import './content.css';

extendArray();
const keyboard = new Keyboard();

function init() {
  const allItems = document.querySelectorAll('a');
  let { observer, getFilteredEntries } = bindIntersectionObservers(keyboard.bindEntriesGetter);

  keyboard.getFilteredEntries = getFilteredEntries;

  function updateObservers() {
    const newAllItems = document.querySelectorAll('a');
    const diff = difference(newAllItems, allItems);
    diff.forEach((elm) => {
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