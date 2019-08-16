import SpatialNavigation from './spatial-navigation.js';
import { getScrollY } from './viewport.js';
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
    const scrollY = getScrollY();
    const transform = `translate(${left}px, ${scrollY + top}px)`;

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