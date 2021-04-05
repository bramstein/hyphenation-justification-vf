function greedy(text, measureText, alignment, measure, hyphenation) {
  if (!hyphenation) {
    text = text.replace(/\|/g, '');
  }

  let hyphenWidth = measureText('-');
  let spaceWidth = measureText('\u00A0');

  let nodes = text.split(/(\s|\|)/).map(function (fragment) {
    if (fragment === ' ') {
      return linebreak.glue(spaceWidth, spaceWidth, spaceWidth);
    } else if (fragment === '|') {
      return linebreak.penalty(hyphenWidth, 100, 1);
    } else {
      return linebreak.box(measureText(fragment), fragment);
    }
  });

  nodes.push(linebreak.glue(0, linebreak.infinity, 0));
  nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));

  let currentLineWidth = 0;
  let breaks = [{ position: 0, ratio: 1 }];

  for (let i = 0; i < nodes.length - 1; i++) {
    // the current node doesn't fit on the line
    if (nodes[i].width + currentLineWidth > measure) {
      // If the current node is a space we ignore its width
      // and move to the next line. In this case the previous
      // node is always a box, so we use that as our breakpoint.
      if (nodes[i].type === 'glue') {
        breaks.push({ position: i, ratio: 1 });
        currentLineWidth = 0;
      // If the current node is a box and the previous node is a penalty
      // we move the word-part to the next line.
      } if (nodes[i].type === 'box' && nodes[i - 1].type === 'penalty') {

        breaks.push({ position: i - 1, ratio: 1 });
        currentLineWidth = nodes[i].width;

      // if the current node is a box the previous node is glue. In this
      // case we skip the glue and grab the box before the glue as the breakpoint.
      } else if (nodes[i].type === 'box' && nodes[i - 1].type === 'glue') {
        breaks.push({ position: i - 1, ratio: 1 });
        currentLineWidth = nodes[i].width;
      // if the current node is a penalty and the previous node is box we
      // need to move everything up to the previous penalty or glue to the
      // next line.
      } else if (nodes[i].type === 'penalty' && nodes[i - 1].type === 'box') {
        breaks.push({ position: i - 2, ratio: 1 });
        currentLineWidth = nodes[i - 1].width;
      }
    } else {
      if (nodes[i].type !== 'penalty') {
        currentLineWidth += nodes[i].width;
      }
    }
  }

  breaks.push({ position: nodes.length, ratio: 1 });

  return { nodes, breaks };
}
