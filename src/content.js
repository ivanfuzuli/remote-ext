import SpatialNavigation from './spatial-navigation.js';
import DesktopAdaptor from './adaptors/desktop.js';

import FocusIndicator from './focus-indicator.js';
import VideoIndicator from './video-indicator.js';

import './content.css';

function init() {
  FocusIndicator.init();
  VideoIndicator.init();
  
  DesktopAdaptor.init();

  // Focus the first navigable element.
  SpatialNavigation.focus();
}


window.addEventListener('load', () => {
  init();
});