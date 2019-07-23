import difference from 'lodash/difference';
import content from './content.css';

let links = document.querySelectorAll('a');

const options = {
  root: null,
  rootMargin: '0px',
  threshold: .5
}

const updateObservers = () => {
  const newLinks = document.querySelectorAll('a');
  const diff = difference(newLinks, links);
  diff.forEach((elm) => {
    observer.observe(elm);
  });

  links = newLinks;
}

const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log('visible', entry.target);
    }
  });
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
  console.log('selected', selected);
});

// TODO: Only development
window.addEventListener('keypress', (e) => {
  if (e.key === 'r') {
    window.location = 'http://reload.extensions';
  } 
});