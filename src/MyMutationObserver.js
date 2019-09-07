import VideoIndicator from './video-indicator.js';

class MyMutationObserver {
 constructor({
  MyInterSectionInstance
 }) {
   this.items = [];

   const _this = this;
   // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
              if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                  const video = node.parentNode && node.parentNode.querySelector('video');
                  if (video && _this.items.indexOf(video) === -1) {
                    _this.items.push(video);
                    
                    MyInterSectionInstance.observeWithFn({
                      target: video,
                      onEnter: function() {
                        VideoIndicator.move(video);
                      },
                      onLeave: function() {
                        VideoIndicator.reset();
                      },
                    });
                  }
                });
              }
            }
            else if (mutation.type === 'attributes') {
                //console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
 }
}

export default MyMutationObserver;