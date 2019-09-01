import head from 'lodash/head';
import { getRect } from './helpers.js';
import arrow from './assets/double-arrow.svg';

let $video = null;


const bindClick = ($elem) => {
  $elem.addEventListener('click', () => {
    const $video = document.getElementById('movie_player');
    const mouseMoveEvent = new Event('mousemove', 
                                      { 
                                        bubbles: true, 
                                        cancelable: true 
                                      });
    $video.dispatchEvent(mouseMoveEvent);
  });
}

const generateElement = ({ left, bottom, width }) => {
  const $elem = document.createElement('a');
  const $span = document.createElement('span');
  const $i = document.createElement('i');

  $elem.classList.add('can-video-expand');

  $elem.style.left = left + 'px';
  $elem.style.width = width + 'px';
  $elem.style.top = bottom + 'px';

  $elem.dataset.focusChildNode = true;
  $i.innerHTML = arrow;

  $span.appendChild($i);
  $elem.appendChild($span);
  document.body.appendChild($elem);
  bindClick($elem);
}

const init = () => {
  $video = head(document.querySelectorAll('video'));
  if ($video) {
    $video.addEventListener('canplay', () => {
      const dimensions = getRect($video);

      const bottomAndWidth = {
        bottom: dimensions.bottom,
        width: dimensions.width,
        left: dimensions.left
      };
  
      generateElement(bottomAndWidth);
    })
  }
}

export default {
  init
};