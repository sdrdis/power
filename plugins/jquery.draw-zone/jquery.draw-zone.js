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

  drawArrow: function(x1, y1, x2, y2, width, color) {
    var angleArrow = 40 * Math.PI / 180;
    var lengthArrow = 15;

    var angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI;
    var angle1 = angle + angleArrow;
    var angle2 = angle - angleArrow;

    var xa1 = Math.cos(angle1) * lengthArrow + x2;
    var ya1 = Math.sin(angle1) * lengthArrow + y2;

    var xa2 = Math.cos(angle2) * lengthArrow + x2;
    var ya2 = Math.sin(angle2) * lengthArrow + y2;

    this.drawOutline(x1, y1, x2, y2, width);
    this.drawOutline(x2, y2, xa1, ya1, width);
    this.drawOutline(x2, y2, xa2, ya2, width);
    this.drawLine(x1, y1, x2, y2, width, color);
    this.drawLine(x2, y2, xa1, ya1, width, color);
    this.drawLine(x2, y2, xa2, ya2, width, color);
  },

  drawOutline: function(x1, y1, x2, y2, width) {
    var diffX = x2 - x1;
    var diffY = y2 - y1;
    var length = Math.sqrt(diffX * diffX + diffY * diffY);
    var unitX = diffX / length;
    var unitY = diffY / length;
    this.drawLine(x1 - unitX * 2, y1 - unitY * 2, x1 + unitX * (length + 2), y1 + unitY * (length + 2), width + 4, 'black');
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
