(function (root) {

  var Zoom = function Zoom (options) {

    options = this.options = $.extend({}, Zoom.defaultOptions, options);

    // shouldn't zoom bounce if not smooth
    if (! options.smooth) {
      options.zoomBounce = false;
    }

    this.init();
  };

  Zoom.defaultOptions = {
    smooth: true,
    smoothFactor: 0.5,
    minZoom: 1.0,
    zoomBounce: true,
    zoomBounceTime: 50,
    gutter: 0.2,
    frameTime: 1000 / 60
  };

  Zoom.prototype.init = function () {

    this.$element = $(this.options.element);

    if (this.options.controllerElement) {
      this.$controllerElement = $(this.options.controllerElement);
    }
    else {
      this.$controllerElement = $('<div>', {
        'class': 'mg-zoom-controller'
      });
      this.$element.append(this.$controllerElement);
    }

    this.$zoomed = $('<div>', {
      'class': 'mg-zoomed'
    });

    this.$img = $('<img>', {
      'class': 'mg-img-md',
      src: this.options.src.lg
    });

    this.$zoomed.append(this.$img);
    this.$element.append(this.$zoomed);

    this.state = {
      zoom: 2.0,
      center: {
        x: 0,
        y: 0
      }
    };

    this.goal = $.extend({}, this.state);

    this.cache = {};

    this.listen();
    this.position();
    this.frame();
  };

  Zoom.prototype.getZoom = function () {
    return this.goal.zoom;
  };

  Zoom.prototype.setZoom = function (zoom) {
    var _this = this;
    if (zoom === this.goal.zoom) {
      return false;
    }
    if (zoom < this.options.minZoom) {
      if (this.options.zoomBounce) {
        setTimeout(function () {
          _this.goal.zoom = _this.options.minZoom;
        }, _this.options.zoomBounceTime);
      }
      else {
        zoom = _this.options.minZoom;
      }
    }
    this.$element.trigger('zoom.change.mg', zoom);
    this.goal.zoom = zoom;
    return true;
  };

  /**
   * @param {Number} dir 1 (in) or -1 (out).
   */
  Zoom.prototype.nextCenter = function (center) {
    var x = center.x;
    var y = center.y;
    var gutter = this.options.gutter;
    if (x > 0.5) {
      x = Math.min(x + gutter, 1);
    }
    else {
      x = Math.max(x - gutter, 0);
    }
    if (y > 0.5) {
      y = Math.min(y + gutter, 1);
    }
    else {
      y = Math.max(y - gutter, 0);
    }
    return {
      x: x,
      y: y
    };
  };

  /**
   * @param { x: x, y: y } center
   */
  Zoom.prototype.nextZoom = function (dir) {
    var zoom = this.goal.zoom;
    return zoom + (dir * 0.5);
  };

  /**
   * @param { x: x, y: y } center
   */
  Zoom.prototype.setCenter = function (center) {
    this.goal.center = center;
    this.$element.trigger('center.change.mg', center);
  };

  Zoom.prototype.position = function () {
    // console.log(this.state);
    var style = this.computeStyle();
    this.$zoomed.css(style);
  };

  /**
   * Animation loop - each frame.
   */
  Zoom.prototype.frame = function () {
    var _this = this;
    var factor = 1;
    var positionSmoothFactor = factor;
    var zoomSmoothFactor = factor;
    if (this.options.smooth) {
      factor = this.options.smoothFactor * this.options.frameTime;
      positionSmoothFactor = factor;
      zoomSmoothFactor = factor / 2;
    }

    this.state.center.x += (this.goal.center.x - this.state.center.x) / positionSmoothFactor;
    this.state.center.y += (this.goal.center.y - this.state.center.y) / positionSmoothFactor;

    this.state.zoom += (this.goal.zoom - this.state.zoom) / zoomSmoothFactor;

    this.position();
    setTimeout(function () {
      _this.frame();
    }, this.options.frameTime);
  };

  Zoom.prototype.computeStyle = function () {
    var _this = this;
    var leftPercent = _this.state.center.x * -100;
    leftPercent = (_this.state.center.x * _this.state.zoom) * -100;
    leftPercent *= 1 - (1 / _this.state.zoom);
    var widthPercent = _this.state.zoom * 100;
    var topPercent = _this.state.center.y * -100;
    topPercent = (_this.state.center.y * _this.state.zoom) * -100;
    topPercent *= 1 - (1 / _this.state.zoom);
    var heightPercent = _this.state.zoom * 100;
    return {
      left: leftPercent + '%',
      width: widthPercent + '%',
      top: topPercent + '%',
      height: heightPercent + '%'
    };
  };

  /**
   * Block event if not on the instance element.
   */
  Zoom.prototype.blockEvent = function (e) {
    var _this = this;
    if (! _this.$controllerElement.is(e.target)) {
      console.log('blocked event');
      return true;
    };
  };

  Zoom.prototype.getWidth = function () {
    var _this = this;
    if (! _this.cache.width) {
      _this.cache.width = _this.$controllerElement.width();
    }
    return _this.cache.width;
  };

  Zoom.prototype.getHeight = function () {
    var _this = this;
    if (! _this.cache._height) {
      _this.cache.height = _this.$controllerElement.height();
    }
    return _this.cache.height;
  };

  Zoom.prototype.listen = function () {
    var _this = this;
    this.$controllerElement.on('mousemove', function (e) {
      if (_this.blockEvent(e)) return;
      e.preventDefault();
      var width = _this.getWidth();
      var height = _this.getHeight();
      var x = e.offsetX / width;
      var y = e.offsetY / height;
      var center = _this.nextCenter({
        x: x,
        y: y
      });
      _this.setCenter(center);
    });
    this.$controllerElement.on('mousewheel', function (e) {
      if (_this.blockEvent(e)) return;
      e.preventDefault();
      var zoom = _this.nextZoom(e.deltaY);
      var changed = _this.setZoom(zoom);
    });
  };

  root.Zoom = Zoom;

})(this);