(function (root) {

  var Zoom = function Zoom (options) {
    console.log('new');
    this.options = options;
    this.init();
  };

  Zoom.prototype.init = function () {
    console.log('init');
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

  Zoom.prototype.setZoom = function (zoom) {
    if (zoom === this.goal.zoom) {
      return false;
    }
    if (zoom < 1.0) {
      zoom = 1.0;
    }
    this.goal.zoom = zoom;
    return true;
  };

  Zoom.prototype.position = function () {
    // console.log(this.state);
    var position = this.computePosition();
    this.$zoomed.css(position);
  };

  Zoom.prototype.frame = function () {
    var _this = this;
    var factor = 8;
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

  Zoom.prototype.blockEvent = function (e) {
    var _this = this;
    if (! _this.$element.is(e.target)) {
      console.log('no');
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
      _this.goal.center = {
        x: x,
        y: y
      };
      // _this.position();
    });
    this.$element.on('mousewheel', function (e) {
      if (_this.blockEvent(e)) return;
      e.preventDefault();
      var zoom = _this.goal.zoom;
      // zoom *= 1 + (e.deltaY * 0.5);
      zoom += e.deltaY * 0.5;
      var changed = _this.setZoom(zoom);
      // if (! changed) return;
      // _this.position();
    });
  };

  root.Zoom = Zoom;

})(this);