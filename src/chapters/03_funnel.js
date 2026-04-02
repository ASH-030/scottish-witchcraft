async function drawFunnel() {
  const data = await d3.json('data/processed/funnel.json');
  const container = document.getElementById('viz-funnel');
  container.innerHTML = '';
  const W = container.getBoundingClientRect().width || window.innerWidth * 0.9;
  const H = window.innerHeight - 130 - 64 - 40 - 32 - 24;
  container.style.height = H + 'px';

  document.getElementById('annotation-funnel').innerHTML = `
    Of  <span class="highlight-amber">3,219 accused</span> , records survive for only a fraction.
    Of those tried,  <span class="highlight-blood">236 were found guilty</span>  and
     <span class="highlight-blood">230 were executed</span>  — almost always strangled then burned at the stake.
  `;

  const colors   = ['#cc44ff','#aa22dd','#ff3399','#ff3333'];
  const icons    = ['♆','⚖','☠','†'];
  const maxCount = data[0].count;
  const svg      = d3.select('#viz-funnel').append('svg').attr('width', W).attr('height', H);
  const padT     = 10;
  const headH    = Math.min(110, H * 0.32);
  const gridH    = H - padT - headH - 10;
  const stageW   = W / data.length;

  const titleFs  = Math.max(11, Math.min(15, W / 75));
  const countFs  = Math.max(32, Math.min(52, W / 12));
  const pctFs    = Math.max(10, Math.min(13, W / 95));
  const arrowFs  = Math.max(20, Math.min(32, W / 38));

  data.forEach((stage, si) => {
    const gx     = si * stageW;
    const innerW = stageW - 16;
    const cx     = gx + innerW / 2 + 8;
    const units  = Math.round(stage.count / 10);
    const pct    = ((stage.count / maxCount) * 100).toFixed(1);
    const col    = colors[si];

    svg.append('text').attr('x', cx).attr('y', padT + titleFs + 4)
      .attr('text-anchor', 'middle').attr('font-family', 'Cinzel, serif')
      .attr('font-size', titleFs + 'px').attr('fill', col).attr('font-weight', '600')
      .style('filter', `drop-shadow(0 0 4px ${col})`)
      .text(stage.stage.toUpperCase());

    svg.append('text').attr('x', cx).attr('y', padT + titleFs + countFs + 4)
      .attr('text-anchor', 'middle').attr('font-family', 'EB Garamond, serif')
      .attr('font-size', countFs + 'px').attr('fill', col).attr('opacity', 0)
      .style('filter', `drop-shadow(0 0 12px ${col})`)
      .text(stage.count.toLocaleString())
      .transition().delay(si * 300 + 100).duration(600).attr('opacity', 1);

    svg.append('text').attr('x', cx).attr('y', padT + titleFs + countFs + pctFs + 10)
      .attr('text-anchor', 'middle').attr('font-family', 'EB Garamond, serif')
      .attr('font-size', pctFs + 'px').attr('fill', col).attr('font-style', 'italic').attr('opacity', 0.75)
      .text(`${pct}% of accused`);

    svg.append('line')
      .attr('x1', gx + 8).attr('x2', gx + innerW + 8)
      .attr('y1', padT + headH).attr('y2', padT + headH)
      .attr('stroke', col).attr('stroke-width', 0.5).attr('opacity', 0.3);

    if (si < data.length - 1) {
      svg.append('text').attr('x', gx + stageW).attr('y', padT + headH / 2 + arrowFs * 0.4)
        .attr('text-anchor', 'middle').attr('font-size', arrowFs + 'px')
        .attr('fill', '#886699').attr('opacity', 0).text('→')
        .transition().delay(si * 300 + 500).duration(400).attr('opacity', 0.8);
    }

    const gridTop = padT + headH + 10;
    const iconSz  = Math.max(14, Math.min(24, Math.floor(innerW / 12)));
    const COLS    = Math.max(5, Math.floor(innerW / (iconSz + 4)));

    for (let i = 0; i < units; i++) {
      const ic = i % COLS;
      const ir = Math.floor(i / COLS);
      const iy = gridTop + ir * (iconSz + 4) + iconSz;
      if (iy > H - 6) break;
      svg.append('text')
        .attr('x', gx + ic * (iconSz + 4) + 10).attr('y', iy)
        .attr('font-size', iconSz + 'px').attr('fill', col).attr('opacity', 0)
        .style('filter', si >= 2 ? `drop-shadow(0 0 3px ${col})` : 'none')
        .text(icons[si])
        .transition().delay(si * 300 + i * 8).duration(350).ease(d3.easeCubicOut)
        .attr('opacity', si === 3 ? 1 : si === 2 ? 0.95 : si === 1 ? 0.85 : 0.75);
    }
  });
}
