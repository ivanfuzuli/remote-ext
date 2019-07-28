
import debounce from 'lodash/debounce';

const domObserver = function(whenUpdated) {
  const debounced = debounce(whenUpdated, 100);
  
  const mutationCB = () => {
   debounced();
  }

  const observer = new MutationObserver(mutationCB);

  const options = { attributes: true, childList: false, subtree: true, attributeFilter:['href'] };
  // Start observing the target node for optionsured mutations
  observer.observe(document.body, options);
}


export default domObserver;