/*
 * A javascript-based implementation of Spatial Navigation.
 *
 * Copyright (c) 2017 Luke Chang.
 * https://github.com/luke-chang/js-spatial-navigation
 *
 * Licensed under the MPL 2.0.
 */

  /************************/
  /* Global Configuration */
  /************************/
  // Note: an <extSelector> can be one of following types:
  // - a valid selector string for "querySelectorAll" or jQuery (if it exists)
  // - a NodeList or an array containing DOM elements
  // - a single DOM element
  // - a jQuery object
  // - a string "@<sectionId>" to indicate the specified section
  // - a string "@" to indicate the default section
  
  import head from 'lodash/head';
  import without from 'lodash/without';

  import { scroller } from './viewport.js';
  import { getRect } from './helpers.js';

  var GlobalConfig = {
    selector: '',           // can be a valid <extSelector> except "@" syntax.
    straightOverlapThreshold: 0.5,
  };

  /*********************/
  /* Constant Variable */
  /*********************/

  var EVENT_PREFIX = 'sn:';

  var currentFocusedElement = null;
  var focusListeners = [];

  /*****************/
  /* Core Function */
  /*****************/
  function getActiveElements() {
   return document.querySelectorAll('a, button, input');
  }

  function partition(rects, targetRect, straightOverlapThreshold) {
    var groups = [[], [], [], [], [], [], [], [], []];

    for (var i = 0; i < rects.length; i++) {
      var rect = rects[i];
      var center = rect.center;
      var x, y, groupId;

      if (center.x < targetRect.left) {
        x = 0;
      } else if (center.x <= targetRect.right) {
        x = 1;
      } else {
        x = 2;
      }

      if (center.y < targetRect.top) {
        y = 0;
      } else if (center.y <= targetRect.bottom) {
        y = 1;
      } else {
        y = 2;
      }

      groupId = y * 3 + x;
      groups[groupId].push(rect);

      if ([0, 2, 6, 8].indexOf(groupId) !== -1) {
        var threshold = straightOverlapThreshold;

        if (rect.left <= targetRect.right - targetRect.width * threshold) {
          if (groupId === 2) {
            groups[1].push(rect);
          } else if (groupId === 8) {
            groups[7].push(rect);
          }
        }

        if (rect.right >= targetRect.left + targetRect.width * threshold) {
          if (groupId === 0) {
            groups[1].push(rect);
          } else if (groupId === 6) {
            groups[7].push(rect);
          }
        }

        if (rect.top <= targetRect.bottom - targetRect.height * threshold) {
          if (groupId === 6) {
            groups[3].push(rect);
          } else if (groupId === 8) {
            groups[5].push(rect);
          }
        }

        if (rect.bottom >= targetRect.top + targetRect.height * threshold) {
          if (groupId === 0) {
            groups[3].push(rect);
          } else if (groupId === 2) {
            groups[5].push(rect);
          }
        }
      }
    }

    return groups;
  }

  function generateDistanceFunction(targetRect) {
    return {
      nearPlumbLineIsBetter: function(rect) {
        var d;
        if (rect.center.x < targetRect.center.x) {
          d = targetRect.center.x - rect.right;
        } else {
          d = rect.left - targetRect.center.x;
        }
        return d < 0 ? 0 : d;
      },
      nearHorizonIsBetter: function(rect) {
        var d;
        if (rect.center.y < targetRect.center.y) {
          d = targetRect.center.y - rect.bottom;
        } else {
          d = rect.top - targetRect.center.y;
        }
        return d < 0 ? 0 : d;
      },
      nearTargetLeftIsBetter: function(rect) {
        var d;
        if (rect.center.x < targetRect.center.x) {
          d = targetRect.left - rect.right;
        } else {
          d = rect.left - targetRect.left;
        }
        return d < 0 ? 0 : d;
      },
      nearTargetTopIsBetter: function(rect) {
        var d;
        if (rect.center.y < targetRect.center.y) {
          d = targetRect.top - rect.bottom;
        } else {
          d = rect.top - targetRect.top;
        }
        return d < 0 ? 0 : d;
      },
      topIsBetter: function(rect) {
        return rect.top;
      },
      bottomIsBetter: function(rect) {
        return -1 * rect.bottom;
      },
      leftIsBetter: function(rect) {
        return rect.left;
      },
      rightIsBetter: function(rect) {
        return -1 * rect.right;
      }
    };
  }

  function prioritize(priorities) {
    var destPriority = null;
    for (var i = 0; i < priorities.length; i++) {
      if (priorities[i].group.length) {
        destPriority = priorities[i];
        break;
      }
    }

    if (!destPriority) {
      return null;
    }

    var destDistance = destPriority.distance;

    destPriority.group.sort(function(a, b) {
      for (var i = 0; i < destDistance.length; i++) {
        var distance = destDistance[i];
        var delta = distance(a) - distance(b);
        if (delta) {
          return delta;
        }
      }
      return 0;
    });

    return destPriority.group;
  }

  function navigate(direction, candidates) {
    var config = GlobalConfig;
    var target = currentFocusedElement;

    if (!direction || !candidates || !candidates.length) {
      return null;
    }

    var rects = [];
    for (var i = 0; i < candidates.length; i++) {
      var rect = getRect(candidates[i]);
      if (rect) {
        rects.push(rect);
      }
    }
    if (!rects.length) {
      return null;
    }

    var targetRect = getRect(target);
    if (!targetRect) {
      return null;
    }

    var distanceFunction = generateDistanceFunction(targetRect);

    var groups = partition(
      rects,
      targetRect,
      config.straightOverlapThreshold
    );

    var internalGroups = partition(
      groups[4],
      targetRect.center,
      config.straightOverlapThreshold
    );

    var priorities;

    switch (direction) {
      case 'left':
        priorities = [
          {
            group: internalGroups[0].concat(internalGroups[3])
                                     .concat(internalGroups[6]),
            distance: [
              distanceFunction.nearPlumbLineIsBetter,
              distanceFunction.topIsBetter
            ]
          },
          {
            group: groups[3],
            distance: [
              distanceFunction.nearPlumbLineIsBetter,
              distanceFunction.topIsBetter
            ]
          },
          {
            group: groups[0].concat(groups[6]),
            distance: [
              distanceFunction.nearHorizonIsBetter,
              distanceFunction.rightIsBetter,
              distanceFunction.nearTargetTopIsBetter
            ]
          }
        ];
        break;
      case 'right':
        priorities = [
          {
            group: internalGroups[2].concat(internalGroups[5])
                                     .concat(internalGroups[8]),
            distance: [
              distanceFunction.nearPlumbLineIsBetter,
              distanceFunction.topIsBetter
            ]
          },
          {
            group: groups[5],
            distance: [
              distanceFunction.nearPlumbLineIsBetter,
              distanceFunction.topIsBetter
            ]
          },
          {
            group: groups[2].concat(groups[8]),
            distance: [
              distanceFunction.nearHorizonIsBetter,
              distanceFunction.leftIsBetter,
              distanceFunction.nearTargetTopIsBetter
            ]
          }
        ];
        break;
      case 'up':
        priorities = [
          {
            group: internalGroups[0].concat(internalGroups[1])
                                     .concat(internalGroups[2]),
            distance: [
              distanceFunction.nearHorizonIsBetter,
              distanceFunction.leftIsBetter
            ]
          },
          {
            group: groups[1],
            distance: [
              distanceFunction.nearHorizonIsBetter,
              distanceFunction.leftIsBetter
            ]
          },
          {
            group: groups[0].concat(groups[2]),
            distance: [
              distanceFunction.nearPlumbLineIsBetter,
              distanceFunction.bottomIsBetter,
              distanceFunction.nearTargetLeftIsBetter
            ]
          }
        ];
        break;
      case 'down':
        priorities = [
          {
            group: internalGroups[6].concat(internalGroups[7])
                                     .concat(internalGroups[8]),
            distance: [
              distanceFunction.nearHorizonIsBetter,
              distanceFunction.leftIsBetter
            ]
          },
          {
            group: groups[7],
            distance: [
              distanceFunction.nearHorizonIsBetter,
              distanceFunction.leftIsBetter
            ]
          },
          {
            group: groups[6].concat(groups[8]),
            distance: [
              distanceFunction.nearPlumbLineIsBetter,
              distanceFunction.topIsBetter,
              distanceFunction.nearTargetLeftIsBetter
            ]
          }
        ];
        break;
      default:
        return null;
    }

    var destGroup = prioritize(priorities);
    if (!destGroup) {
      return null;
    }

    var dest = null;

    if (!dest) {
      dest = destGroup[0].element;
    }
    return dest;
  }

  function isNavigable(elem, depth = 1) {
    const maxDepth = 5;
    const nextDept = depth + 1;
    if (! elem ) {
      return false;
    }

    var computedStyle = window.getComputedStyle(elem);

    if (!elem) {
      return false;
    }

    if ((elem.offsetWidth <= 0 && elem.offsetHeight <= 0) ||
        computedStyle.getPropertyValue('opacity') == 0 || 
        computedStyle.getPropertyValue('visibility') == 'hidden' ||
        computedStyle.getPropertyValue('display') == 'none'
        ) {
      return false;
    }

    const $parentNode = elem.parentNode;

    if ($parentNode === document.body) {
      return true;
    }

    if (depth < maxDepth && $parentNode) {
      return isNavigable($parentNode, nextDept);
    }
    

    return true;
  }

  function fireEvent(elem, type, details, cancelable) {
    if (arguments.length < 4) {
      cancelable = true;
    }

    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(EVENT_PREFIX + type, true, cancelable, details);
    return elem.dispatchEvent(evt);
  }

  function dispatchMoveEvent(elem) {
    const mouseMoveEvent = new Event('mousemove',  { bubbles: true, cancelable: true } );
    elem.dispatchEvent(mouseMoveEvent);
  }

  function setCurrentFocusedElement(elem) {
    currentFocusedElement = elem;
  }

  function focusElement(elem, direction) {
    if (!elem) {
      return false;
    }

    if (currentFocusedElement) {
      var focusProperties = {
        previousElement: currentFocusedElement,
        direction: direction,
        native: false
      };
      if (!fireEvent(elem, 'willfocus', focusProperties)) {
        return false;
      }

      focusListeners.map((fn) => {
        fn(elem);
      });

      dispatchMoveEvent(elem);
      setCurrentFocusedElement(elem);
      
      fireEvent(elem, 'focused', focusProperties, false);
      return true;
    }
  }
  function focusNext(direction, withoutArr = []) {
    const activeElements = getActiveElements();

    if (withoutArr.length < 1) {
      withoutArr.push(activeElements);
      withoutArr.push(currentFocusedElement);
    }

    var next = navigate(
      direction,
      without.apply(this, withoutArr)
    );
    
    if (next && !isNavigable(next)) {
      withoutArr.push(next);
      return focusNext(direction, withoutArr);
    }

    if (next) {
      const scrollPromise = scroller(next, direction);
      scrollPromise.then(() => {
        focusElement(next, direction);
      }).catch(() => {
        console.log('promise failed');
      });
    }

    return false;
  }


  function moveCurrentFocusElement() {
    SpatialNavigation.focus();
    console.log('focus');
  }

  function move(direction, preventDefault) {
    if (direction === 'enter') {
      if (currentFocusedElement) {
        if (fireEvent(currentFocusedElement, 'enter-down')) {
          const clickEvent = new Event('click', { bubbles: true, cancelable: true });
          currentFocusedElement.dispatchEvent(clickEvent);

          moveCurrentFocusElement(currentFocusedElement);
          return preventDefault();
        }
      }
      return;
    }

    if (!currentFocusedElement) {
      const activeItems = getActiveElements();
      currentFocusedElement = head(activeItems);
      if (!currentFocusedElement) return;
    }


    var willmoveProperties = {
      direction: direction,
      cause: 'keydown'
    };

    if (fireEvent(currentFocusedElement, 'willmove', willmoveProperties)) {
      focusNext(direction);
    }
    
    return preventDefault();
  }

  const getNext = (arr, index) => {
    const nextIndex = index + 1;
    if (nextIndex + 1 > arr.length) {
      return false;
    }

    const next = arr[nextIndex];
    return next;
  }
  /*******************/
  /* Public Function */
  /*******************/
  var SpatialNavigation = {
    move,

    addFocusListener(fn) {
      focusListeners.push(fn);
    },

    focus: function(elem, index = 0) {
      if (!elem) {
        const activeElements = getActiveElements();
        currentFocusedElement = head(activeElements);
        elem = currentFocusedElement;
      }

      var result = false;
      if (isNavigable(elem)) {
        result = focusElement(elem);
      } else {
        const activeElements = getActiveElements();
        index = index + 1;
        const next = getNext(activeElements, index);

        if (!next) return;
        this.focus(next, index);
      }

      return result;
    }
  };

export default SpatialNavigation;