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
    smoothFactor: 8,
    minZoom: 1.0,
    zoomBounce: true,
    zoomBounceTime: 50
  };

  Zoom.prototype.init = function () {
    this.$element = $(this.options.element);
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
          console.log('bounced');
        }, _this.options.zoomBounceTime);
      }
      else {
        zoom = _this.options.minZoom;
      }
    }
    this.goal.zoom = zoom;
    return true;
  };

  /**
   * @param {Number} dir 1 (in) or -1 (out).
   */
  Zoom.prototype.nextZoom = function (zoom, dir) {
    return zoom + (dir * 0.5);
  };

  /**
   * @param { x: x, y: y } center
   */
  Zoom.prototype.setCenter = function (center) {
    this.goal.center = center;
  }

  Zoom.prototype.position = function () {
    // console.log(this.state);
    var position = this.computePosition();
    this.$zoomed.css(position);
  };

  /**
   * Animation loop - each frame.
   */
  Zoom.prototype.frame = function () {
    var _this = this;
    var factor = this.options.smooth === false ? 1 : this.options.smoothFactor;
    this.state.center.x += (this.goal.center.x - this.state.center.x) / factor;
    this.state.center.y += (this.goal.center.y - this.state.center.y) / factor;
    this.state.zoom += (this.goal.zoom - this.state.zoom) / factor;
    this.position();
    setTimeout(function () {
      _this.frame();
    }, 10);
  }

  Zoom.prototype.computePosition = function () {
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
    if (! _this.$element.is(e.target)) {
      console.log('blocked event');
      return true;
    };
  };

  Zoom.prototype.getWidth = function () {
    var _this = this;
    if (! _this.cache.width) {
      _this.cache.width = _this.$element.width();
    }
    return _this.cache.width;
  };

  Zoom.prototype.getHeight = function () {
    var _this = this;
    if (! _this.cache._height) {
      _this.cache.height = _this.$element.height();
    }
    return _this.cache.height;
  };

  Zoom.prototype.listen = function () {
    var _this = this;
    this.$element.on('mousemove', function (e) {
      if (_this.blockEvent(e)) return;
      e.preventDefault();
      var width = _this.getWidth();
      var height = _this.getHeight();
      var x = e.offsetX / width;
      var y = e.offsetY / height;
      _this.setCenter({
        x: x,
        y: y
      });
    });
    this.$element.on('mousewheel', function (e) {
      if (_this.blockEvent(e)) return;
      e.preventDefault();
      var zoom = _this.goal.zoom;
      zoom = _this.nextZoom(zoom, e.deltaY);
      var changed = _this.setZoom(zoom);
    });
  };

  root.Zoom = Zoom;

})(this);