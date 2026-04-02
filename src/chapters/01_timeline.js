async function drawTimeline() {
  const data = await d3.json('data/processed/timeline.json');
  const container = document.getElementById('viz-timeline');
  container.innerHTML = '';
  const W = container.getBoundingClientRect().width || window.innerWidth * 0.9;
  const H = window.innerHeight - 130 - 64 - 40 - 32 - 24;
  container.style.height = H + 'px';

  document.getElementById('annotation-timeline').innerHTML = `
    Each bar = 10 people accused. Hover for the exact count.
    Peak:  <span class="highlight-blood">1649 — 375 accused</span> , then  <span class="highlight-blood">1662 — 326 accused</span> .
  `;

  const margin = { top: 32, right: 12, bottom: 36, left: 12 };
  const iW = W - margin.left - margin.right;
  const iH = H - margin.top - margin.bottom;
  const maxCount = d3.max(data, d => d.accusations);

  const svg = d3.select('#viz-timeline').append('svg').attr('width', W).attr('height', H);
  const g   = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand().domain(data.map(d => d.year)).range([0, iW]).padding(0.1);
  const y = d3.scaleLinear().domain([0, maxCount]).range([iH, 0]);

  g.append('line').attr('x1', 0).attr('x2', iW).attr('y1', iH).attr('y2', iH)
    .attr('stroke', 'rgba(0,229,255,0.2)').attr('stroke-width', 1);

  const labelFs = Math.max(10, Math.min(13, iW / 75));
  g.selectAll('.xl').data(data.filter(d => d.year % 20 === 0)).join('text')
    .attr('x', d => x(d.year) + x.bandwidth() / 2).attr('y', iH + 24)
    .attr('text-anchor', 'middle').attr('font-family', 'Cinzel, serif')
    .attr('font-size', labelFs + 'px').attr('fill', '#7ad4e0').text(d => d.year);

  const tooltip = d3.select('#viz-timeline').append('div').attr('class', 'd3-tooltip');

  const colorScale = d3.scaleLinear()
    .domain([0, 50, 150, maxCount])
    .range(['#005566','#00aacc','#00e5ff','#ffffff']).clamp(true);

  data.forEach((d, di) => {
    const isPeak = d.year === 1649 || d.year === 1662;
    const color  = isPeak ? '#ff3333' : colorScale(d.accusations);
    const bx     = x(d.year);
    const bw     = Math.max(1, x.bandwidth());
    const barH   = iH - y(d.accusations);

    g.append('rect')
      .attr('x', bx).attr('y', iH).attr('width', bw).attr('height', 0)
      .attr('fill', color).attr('opacity', isPeak ? 1 : 0.82).attr('rx', 1)
      .on('mousemove', (event) => {
        tooltip.classed('visible', true)
          .style('left', Math.min(event.offsetX + 12, W - 180) + 'px')
          .style('top', Math.max(event.offsetY - 40, 4) + 'px')
          .html(`<strong>${d.year}</strong>: ${d.accusations} accused`);
      })
      .on('mouseleave', () => tooltip.classed('visible', false))
      .transition().delay(di * 10).duration(500).ease(d3.easeCubicOut)
      .attr('height', barH).attr('y', iH - barH);
  });

  const peakFs = Math.max(12, Math.min(15, iW / 65));
  [{year:1649,label:'1649 · 375'},{year:1662,label:'1662 · 326'}].forEach(p => {
    const pd = data.find(d => d.year === p.year);
    const px = x(p.year) + x.bandwidth() / 2;
    const py = y(pd.accusations) - 10;
    g.append('text')
      .attr('x', px).attr('y', Math.max(py, 14))
      .attr('text-anchor', 'middle').attr('font-family', 'Cinzel, serif')
      .attr('font-size', peakFs + 'px').attr('fill', '#ff3333')
      .attr('font-weight', '600').attr('opacity', 0)
      .style('filter', 'drop-shadow(0 0 6px #ff3333)')
      .text(p.label)
      .transition().delay(1800).duration(600).attr('opacity', 1);
  });

  setTimeout(() => triggerLightning('rgba(0,229,255,0.15)'), 1900);
}
