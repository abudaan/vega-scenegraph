var d3 = require('d3'),
    util = require('./util'),
    rect = require('./rect'),
    clip_id = 0;

function draw(g, scene, index) {
  var renderer = this,
      p = util.drawMark(g, scene, index, 'g', group),
      c = p.node().childNodes,
      n = c.length,
      i, j, m;

  for (i=0; i<n; ++i) {
    var datum = c[i].__data__,
        items = datum.items,
        legends = datum.legendItems || [],
        axes = datum.axisItems || [],
        sel = d3.select(c[i]),
        idx = 0;

    for (j=0, m=axes.length; j<m; ++j) {
      if (axes[j].layer === 'back') {
        draw.call(renderer, sel, axes[j], idx++);
      }
    }
    for (j=0, m=items.length; j<m; ++j) {
      renderer.draw(sel, items[j], idx++);
    }
    for (j=0, m=axes.length; j<m; ++j) {
      if (axes[j].layer !== 'back') {
        draw.call(renderer, sel, axes[j], idx++);
      }
    }
    for (j=0, m=legends.length; j<m; ++j) {
      draw.call(renderer, sel, legends[j], idx++);
    }
  }
}

function group(o) {
  var x = o.x || 0,
      y = o.y || 0,
      id, c;

  this.setAttribute('transform', 'translate('+x+','+y+')');

  if (o.clip) {
    id = o.clip_id || (o.clip_id = 'clip' + clip_id++);
    c = {
      width: o.width || 0,
      height: o.height || 0
    };
    util.defs.clipping[id] = c;
    this.setAttribute('clip-path', 'url(#'+id+')');
  }
}

module.exports = {
  update: rect.update,
  draw:   draw
};
