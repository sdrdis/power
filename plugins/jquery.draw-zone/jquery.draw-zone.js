$.widget("ui.drawZone", {
  options: {
  },
  context: null,

  _create: function() {
    this.refreshSize();
    this.context = this.element[0].getContext('2d');
  },

  refreshSize: function() {
    this.element.attr({
      width: this.element.width(),
      height: this.element.height()
    });
  },

  clear: function() {
    this.context.clearRect(0, 0, this.element.width(), this.element.height());
  },

  clearRect: function(x, y, w, h) {
    this.context.clearRect(x, y, w, h);
  },

  drawLine: function(x1, y1, x2, y2, width, color) {
    this.context.lineWidth = width;
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  },

  drawCircle: function(x, y, radius, width, color, type) {
    if (typeof type == 'undefined') {
      type = 'stroke';
    }
    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = width ? width : 1;
    this.context.strokeStyle = color ? color : 'white';
    this.context.fillStyle = color ? color : 'white';
    this.context.arc(x, y, radius, 0, Math.PI*2, true);
    if (type == 'stroke') {
      this.context.stroke();
    } else {
      this.context.fill();
    }
    this.context.restore();
  },


  setAlpha: function(alpha) {
    this.context.globalAlpha = alpha;
  },

  setScale: function(x, y) {
      this.context.scale(x, y);
  }


});
