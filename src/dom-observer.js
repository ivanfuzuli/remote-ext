
import debounce from 'lodash/debounce';
import slice from 'lodash/slice';
import difference from 'lodash/difference';

let addedNodes = [];

const filterByTag = (nodes) => {
  return nodes.filter((item) => {
    if (!item.tagName) {
      return false;
    }

    const tagName = item.tagName.toLowerCase();

    if (tagName === 'a' || tagName === 'button') {
      return true;
    }

    return false;
 });
}

const domObserver = function(whenUpdated) {
  const debounced = debounce(() => {
    if (addedNodes.length < 1) {
      return;
    }

    whenUpdated(addedNodes);
    addedNodes = [];
  }, 100);
  
  const mutationCB = (mutation) => {

   const reducedAdded = mutation.reduce((acc, record) => {
      const added = slice(record.addedNodes);
      return acc.concat(added);
   }, []);

   const reducedRemoved = mutation.reduce((acc, record) => {
    const added = slice(record.removedNodes);
    return acc.concat(added);
  }, []);

   const added = filterByTag(reducedAdded);
   const removed = filterByTag(reducedRemoved);

   addedNodes = addedNodes.concat(added);
   addedNodes = difference(addedNodes, removed);
   debounced();
  }

  const observer = new MutationObserver(mutationCB);

  const options = { childList: true, subtree: true };
  // Start observing the target node for optionsured mutations
  observer.observe(document.body, options);
}


export default domObserver;