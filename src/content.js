import difference from 'lodash/difference';
import Mapper from './mapper.js';
import Keyboard from './keyboard.js';
import DomObserver from './dom-observer.js';
import domObserver from './dom-observer.js';

import './content.css';

const keyboard = new Keyboard();

let links = document.querySelectorAll('a');
keyboard.bindDomElements(links);
console.log('keyboard', keyboard);
const interSectionOptions = {
  root: null,
  rootMargin: '0px',
  threshold: .5
}

const interSectionCB = (entries) => {
  Mapper.map(entries);
};

const observer = new IntersectionObserver(interSectionCB, interSectionOptions);

links.forEach((link) => {
  observer.observe(link);
});

function updateObservers() {
  console.log('observer updated');
  const newLinks = document.querySelectorAll('a');
  const diff = difference(newLinks, links);
  diff.forEach((elm) => {
    observer.observe(elm);
  });

  links = newLinks;
  keyboard.bindDomElements(links);
}

domObserver(updateObservers);

window.addEventListener('load', () => {
  const selected = document.createElement('div');
  selected.classList.add('can-selected');
  document.body.appendChild(selected);
});

// TODO: Only development
window.addEventListener('keypress', (e) => {
  if (e.key === 'r') {
    window.location = 'http://reload.extensions';
  } 
});