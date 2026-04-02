async function drawWho() {
  const data = await d3.json('data/processed/who.json');
  const container = document.getElementById('viz-who');
  container.innerHTML = '';
  const W = container.getBoundingClientRect().width || window.innerWidth * 0.9;
  const H = window.innerHeight - 130 - 64 - 40 - 32 - 24;
  container.style.height = H + 'px';

  document.getElementById('annotation-who').innerHTML = `
     <span class="highlight-blood">84% of the accused were women</span>  —
    2,702 women against 468 men. Most were servants, midwives, vagabonds.
    Haddington, Fife and Edinburgh had the highest concentrations.
  `;

  const female = 2702, male = 468;
  const UNIT = 10;
  const femU = Math.round(female / UNIT);
  const malU = Math.round(male / UNIT);
  const allU = femU + malU;
  const picW = W * 0.50;
  const barX = W * 0.55;
  const barW = W * 0.41;
  const padT = 40;

  const COLS   = Math.max(10, Math.round(Math.sqrt(allU * picW / (H - padT))));
  const cellSz = Math.min(Math.floor(picW / COLS), Math.floor((H - padT - 4) / Math.ceil(allU / COLS)));
  const fs     = Math.max(12, Math.min(cellSz * 0.85, 24));

  const svg = d3.select('#viz-who').append('svg').attr('width', W).attr('height', H);

  const legFs = Math.max(13, Math.min(17, W / 65));
  [['#ff9944','♀ Women (2,702)'],['#ffd700','♂ Men (468)']].forEach(([col, lbl], i) => {
    svg.append('text')
      .attr('x', i * 200 + 4).attr('y', 22)
      .attr('font-size', legFs + 'px').attr('fill', col)
      .attr('font-family', 'EB Garamond, serif').attr('font-weight', '500')
      .style('filter', `drop-shadow(0 0 4px ${col})`).text(lbl);
  });

  svg.append('text').attr('x', picW / 2).attr('y', 36)
    .attr('text-anchor', 'middle')
    .attr('font-size', Math.max(11, Math.min(13, W / 95)) + 'px')
    .attr('fill', '#cc9900').attr('font-family', 'Cinzel, serif')
    .text('1 figure = 10 people');

  for (let i = 0; i < allU; i++) {
    const col   = i % COLS;
    const row   = Math.floor(i / COLS);
    const isFem = i < femU;
    svg.append('text')
      .attr('x', col * cellSz + 2).attr('y', padT + row * cellSz + fs)
      .attr('font-size', fs + 'px')
      .attr('fill', isFem ? '#ff9944' : '#ffd700')
      .attr('opacity', 0).text(isFem ? '♀' : '♂')
      .transition().delay(i * 2).duration(200).ease(d3.easeCubicOut)
      .attr('opacity', 0.92);
  }

  const counties = data.counties.slice(0, 8);
  const availH   = H - padT - 4;
  const yB = d3.scaleBand().domain(counties.map(d => d.county)).range([padT, padT + availH]).padding(0.22);
  const xB = d3.scaleLinear().domain([0, counties[0].count]).range([0, barW * 0.72]);
  const bh = yB.bandwidth();
  const lfs = Math.max(12, Math.min(16, H / 28));
  const barColors = ['#ffd700','#ffbb00','#ffaa00','#ff9900','#ff8800','#ff7700','#ff6600','#ff5500'];

  svg.append('text').attr('x', barX).attr('y', padT - 8)
    .attr('font-family', 'Cinzel, serif')
    .attr('font-size', Math.max(11, Math.min(14, W / 85)) + 'px')
    .attr('fill', '#ffd700').text('Accusations by county');

  counties.forEach((d, i) => {
    const y   = yB(d.county);
    const col = barColors[i];
    svg.append('text')
      .attr('x', barX - 10).attr('y', y + bh / 2 + lfs * 0.38)
      .attr('text-anchor', 'end').attr('font-size', lfs + 'px')
      .attr('fill', '#e8ddb0').attr('font-family', 'EB Garamond, serif').text(d.county);

    svg.append('rect')
      .attr('x', barX).attr('y', y + 2).attr('height', bh - 4).attr('width', 0)
      .attr('fill', col).attr('opacity', 0.85).attr('rx', 2)
      .transition().delay(300 + i * 80).duration(500).ease(d3.easeCubicOut)
      .attr('width', xB(d.count));

    svg.append('text')
      .attr('x', barX + xB(d.count) + 7).attr('y', y + bh / 2 + lfs * 0.38)
      .attr('font-size', lfs + 'px').attr('fill', col)
      .attr('font-family', 'EB Garamond, serif').attr('opacity', 0)
      .text(d.count)
      .transition().delay(800 + i * 80).duration(300).attr('opacity', 1);
  });
}
