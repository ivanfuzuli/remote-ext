import difference from 'lodash/difference';
import Keyboard from './keyboard.js';
import bindIntersectionObservers from './intersection-observer.js';
import domObserver from './dom-observer.js';

import './content.css';

const keyboard = new Keyboard();

function init() {
  const allItems = document.querySelectorAll('a');
  let { observer } = bindIntersectionObservers(keyboard.bindEntriesGetter);
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
  const selected = document.createElement('div');
  selected.classList.add('can-selected');
  document.body.appendChild(selected);

  init();
});

// TODO: Only development
window.addEventListener('keypress', (e) => {
  if (e.key === 'r') {
    window.location = 'http://reload.extensions';
  } 
});