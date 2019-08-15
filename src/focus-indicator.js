import SpatialNavigation from './spatial-navigation.js';

let $indicator;

const init = () => {
  $indicator = document.createElement('div');
  $indicator.classList.add('focus-indicator');
  document.body.appendChild($indicator);

  SpatialNavigation.addFocusListener(move);

}

const move = (elem) => {
  var cr = elem.getBoundingClientRect();
  const {
      left,
      top,
      width,
      height
  } = cr;

  window.requestAnimationFrame(() => {
    const transform = `translate(${left}px, ${top}px)`;

    $indicator.style.transform = transform; 
    $indicator.style.width = width + 'px';
    $indicator.style.height = height + 'px'; 
    $indicator.style.opacity = 1;
  });
} 


export default {
  init,
  move
}