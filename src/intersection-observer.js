import unionBy from 'lodash/unionBy';

function bindIntersectionObservers() {
  const domItems = document.querySelectorAll('a, button, input');
  let activeElements = [];
  let passiveElements = [];

  const interSectionOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  }

  const interSectionCB = (entries) => {
    const mappedEntries = entries.map(entry => {
      return {
        target: entry.target,
        isIntersecting: entry.isIntersecting
      };
    });
  
    const unionEntries = unionBy(mappedEntries, activeElements, item => item.target);
    activeElements = unionEntries
                      .filter(item => item.isIntersecting);
    
    passiveElements = unionEntries
                        .filter(item => item.isIntersecting === false)


    };

  
  const observer = new IntersectionObserver(interSectionCB, interSectionOptions);

  domItems.forEach((link) => {
    observer.observe(link);
  });

  const getFilteredEntries = () => {
    return {
      activeElements,
      passiveElements,
    };
  }

  return {
    getFilteredEntries,
    observer
  }
}

export default bindIntersectionObservers;