import MyIntersectionObserver  from './MyIntersectionObserver.js';
import MyMutationObserver from './MyMutationObserver.js';
import SpatialNavigation from './spatial-navigation.js';
import DesktopAdaptor from './adaptors/desktop.js';

import FocusIndicator from './focus-indicator.js';

import './content.css';

function init() {
  const MyInterSectionInstance = new MyIntersectionObserver();
  
  new MyMutationObserver({
    MyInterSectionInstance
  });

  FocusIndicator.init();
  
  DesktopAdaptor.init();

  // Focus the first navigable element.
  SpatialNavigation.init({
    MyInterSectionInstance
  })
  SpatialNavigation.focus();
}


window.addEventListener('load', () => {
  init();
});