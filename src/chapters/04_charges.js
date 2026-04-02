async function drawCharges() {
  const data = await d3.json('data/processed/charges.json');
  const container = document.getElementById('viz-charges');
  container.innerHTML = '';
  const W = container.getBoundingClientRect().width || window.innerWidth * 0.9;
  const H = window.innerHeight - 130 - 64 - 40 - 32 - 24 - 28;
  container.style.height = H + 'px';

  document.getElementById('annotation-charges').innerHTML = `
    Charges ranged from  <span class="highlight-blood">maleficium</span>  (harmful magic) to neighbourhood disputes recast as witchcraft.
     <span class="highlight-amber">Many accused were simply healers, midwives, or social outcasts.</span> 
  `;

  const symbolMap = {
    'Maleficium':            { icon: '☠', color: '#ff3333' },
    'Demonic pact':          { icon: '⛧', color: '#cc44ff' },
    'Folk healing':          { icon: '✚', color: '#44ff88' },
    'Neighbourhood dispute': { icon: '⚔', color: '#ffaa00' },
    'Fairies':               { icon: '✦', color: '#ffd700' },
    'Consulting spirits':    { icon: '☽', color: '#00e5ff' },
    'Unorthodox religion':   { icon: '✝', color: '#ff6688' },
    'Treason':               { icon: '♛', color: '#ff3333' },
  };

  const COLS  = W < 500 ? 2 : 4;
  const ROWS  = Math.ceil(data.length / COLS);
  const cellW = W / COLS;
  const cellH = H / ROWS;
  const svg   = d3.select('#viz-charges').append('svg').attr('width', W).attr('height', H);

  data.forEach((d, di) => {
    const col    = di % COLS;
    const row    = Math.floor(di / COLS);
    const gx     = col * cellW + 12;
    const gy     = row * cellH + 8;
    const sym    = symbolMap[d.charge] || { icon: '•', color: '#b0d4a8' };
    const availW = cellW - 24;
    const availH = cellH - 16;

    // Label row height
    const labelH = Math.max(28, availH * 0.26);
    const lfs    = Math.max(11, Math.min(14, cellW / 10));
    const nfs    = Math.max(10, Math.min(13, cellW / 12));

    // Charge name — left aligned
    svg.append('text').attr('x', gx).attr('y', gy + labelH * 0.75)
      .attr('font-family', 'Cinzel, serif').attr('font-size', lfs + 'px')
      .attr('fill', sym.color).attr('font-weight', '600')
      .style('filter', `drop-shadow(0 0 5px ${sym.color})`).text(d.charge);

    // n= count — on its OWN line below the charge name, not overlapping
    svg.append('text')
      .attr('x', gx).attr('y', gy + labelH * 0.75 + nfs + 4)
      .attr('font-family', 'EB Garamond, serif')
      .attr('font-size', nfs + 'px').attr('fill', sym.color)
      .attr('font-style', 'italic').attr('opacity', 0)
      .text(`n = ${d.count}`)
      .transition().delay(di * 80 + 200).duration(400).attr('opacity', 0.9);

    // Icons start after both label lines
    const iconTop     = gy + labelH + nfs + 8;
    const iconAreaH   = gy + availH - iconTop;
    const iconsPerRow = Math.max(1, Math.floor(availW / 28));
    const iconSz      = Math.max(16, Math.min(26, Math.min(
      Math.floor(availW / Math.min(d.count || 1, iconsPerRow)),
      Math.floor(Math.max(iconAreaH, 20) / Math.max(1, Math.ceil(d.count / iconsPerRow)))
    )));

    for (let i = 0; i < d.count; i++) {
      const ic = i % iconsPerRow;
      const ir = Math.floor(i / iconsPerRow);
      const iy = iconTop + ir * (iconSz + 4) + iconSz;
      if (iy > gy + availH + 8) break;
      svg.append('text')
        .attr('x', gx + ic * (iconSz + 4)).attr('y', iy)
        .attr('font-size', iconSz + 'px').attr('fill', sym.color).attr('opacity', 0)
        .style('filter', `drop-shadow(0 0 4px ${sym.color})`).text(sym.icon)
        .transition().delay(di * 80 + i * 16).duration(300).ease(d3.easeCubicOut)
        .attr('opacity', 0.92);
    }

    // Cell dividers
    if (col < COLS - 1) {
      svg.append('line')
        .attr('x1', (col+1)*cellW).attr('x2', (col+1)*cellW)
        .attr('y1', row*cellH+6).attr('y2', (row+1)*cellH-6)
        .attr('stroke','rgba(255,51,51,0.15)').attr('stroke-width',1);
    }
    if (row < ROWS - 1) {
      svg.append('line')
        .attr('x1', col*cellW+8).attr('x2', (col+1)*cellW-8)
        .attr('y1', (row+1)*cellH).attr('y2', (row+1)*cellH)
        .attr('stroke','rgba(255,51,51,0.15)').attr('stroke-width',1);
    }
  });
}
