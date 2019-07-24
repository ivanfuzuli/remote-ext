import difference from 'lodash/difference';
import Mapper from './mapper.js';
import Keyboard from './keyboard.js';
import content from './content.css';

new Keyboard();

let links = document.querySelectorAll('a');

const options = {
  root: null,
  rootMargin: '0px',
  threshold: .5
}

const updateObservers = () => {
  return;
  const newLinks = document.querySelectorAll('a');
  const diff = difference(newLinks, links);
  diff.forEach((elm) => {
    observer.observe(elm);
  });

  links = newLinks;
}

const callback = (entries) => {
  Mapper.map(entries);
};
const observer = new IntersectionObserver(callback, options);

links.forEach((link) => {
  observer.observe(link);
});


window.addEventListener('scroll', updateObservers);

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