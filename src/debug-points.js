const debugPoints = (items, scrollY) => {
  const allNodes = document.querySelectorAll('.can-point');
  allNodes.forEach((node) => {
    return node.remove();
  });

  items.forEach((item) => {
    const $node = document.createElement('div');
    const $greenNode = document.createElement('div');

    const { top, left, width, height} = item;
    const itemWidth = 8 / 2;
    const y = left + (width / 2) - itemWidth;
    const x = top + (height / 2) - itemWidth;

    const transform = `translate(${y}px, ${scrollY + x}px)`; 
    const greenTransform = `translate(${left}px, ${scrollY +  top}px)`;

    $node.classList.add('can-point');

    $greenNode.classList.add('can-point');
    $greenNode.classList.add('can-point__green');

    $node.style.transform = transform;

    $greenNode.style.transform = greenTransform;
    document.body.append($node);
    document.body.append($greenNode);
  });
}

export default debugPoints;