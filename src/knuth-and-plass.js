function kap(text, measureText, alignment, measure, hyphenation) {
  if (!hyphenation) {
    text = text.replace(/\|/g, '');
  }

  let hyphenWidth = measureText('-');
  let spaceWidth = measureText('\u00A0');
  let nodes = [];

  if (alignment === 'align-center') {
    nodes.push(linebreak.box(0, ''));
    nodes.push(linebreak.glue(0, 12, 0));
  }

  text.split(/(\s|\|)/).forEach(function (fragment) {
    if (alignment === 'align-justify') {
      if (fragment === ' ') {
        let stretch = (spaceWidth * 3)  / 6;
        let shrink = (spaceWidth * 3) / 9;

        nodes.push(linebreak.glue(spaceWidth, stretch, shrink));
      } else if (fragment === '|') {
        nodes.push(linebreak.penalty(hyphenWidth, 100, 1));
      } else {
        nodes.push(linebreak.box(measureText(fragment), fragment));
      }
    } else if (alignment === 'align-center') {
      if (fragment === ' ') {
        nodes.push(linebreak.glue(0, 12, 0));
        nodes.push(linebreak.penalty(0, 0, 0));
        nodes.push(linebreak.glue(spaceWidth, -24, 0));
        nodes.push(linebreak.box(0, ''));
        nodes.push(linebreak.penalty(0, linebreak.infinity, 0));
        nodes.push(linebreak.glue(0, 12, 0));
      } else if (fragment === '|') {
        nodes.push(linebreak.penalty(hyphenWidth, 100, 1));
      } else {
        nodes.push(linebreak.box(measureText(fragment), fragment));
      }
    } else if (alignment === 'align-left' || alignment === 'align-right') {
      if (fragment === ' ') {
        let stretch = (spaceWidth * 3)  / 6;
        let shrink = (spaceWidth * 3) / 9;

        nodes.push(linebreak.glue(0, 12, 0));
        nodes.push(linebreak.penalty(0, 0, 0));
        nodes.push(linebreak.glue(spaceWidth, -12, 0));
      } else if (fragment === '|') {
        nodes.push(linebreak.penalty(hyphenWidth, 100, 1));
      } else {
        nodes.push(linebreak.box(measureText(fragment), fragment));
      }
    }
  });

  if (alignment === 'align-justify') {
    nodes.push(linebreak.glue(0, linebreak.infinity, 0));
    nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));
  } else if (alignment === 'align-center') {
    nodes.push(linebreak.glue(0, 12, 0));
    nodes.push(linebreak.penalty(0, -linebreak.infinity, 0));
  } else if (alignment === 'align-left' || alignment === 'align-right') {
    nodes.push(linebreak.glue(0, linebreak.infinity, 0));
    nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));
  }

  let demerits = {
    line: 10,
    flagged: 100,
    fitness: 3000
  };

  let breaks = linebreak(nodes, [measure], { tolerance: 3, demerits });

  if (!breaks.length) {
    breaks = linebreak(nodes, [measure], { tolerance: 10, demerits });
  }

  return { nodes, breaks };
}
