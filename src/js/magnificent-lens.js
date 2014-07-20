(function (root) {

  var ZoomLens = function (options) {

    options = this.options = $.extend({}, ZoomLens.defaultOptions, options);

    this.init();
  };

  ZoomLens.defaultOptions = {};

  ZoomLens.prototype.init = function () {
    var _this = this;

    this.$element = $(this.options.element);
    this.$zoomElement = $(this.options.zoomElement);

    this.zoom = this.$zoomElement.data('zoom');

    this.state = {
      zoom: this.zoom.state.zoom,
      center: {
        x: this.zoom.state.center.x,
        y: this.zoom.state.center.y,
      }
    };

    this.$zoomElement.on('gutteredCenter.change.mg', function (e, center) {
      _this.state.center = center;
      _this.position();
    });

    this.$zoomElement.on('zoom.change.mg', function (e, zoom) {
      _this.state.zoom = zoom;
      _this.position();
    });

  };

  var stretch = function (pt, factor) {
    var dpt = pt - 0.5;
    dpt *= factor;
    return dpt + 0.5;
  };

  ZoomLens.prototype.position = function () {
    var center = this.state.center;
    var zoom = this.state.zoom;

    var heightPercent = 1 / zoom * 100;
    var widthPercent = 1 / zoom * 100;

    var topPercent = center.y * 100;
    var leftPercent = center.x * 100;

    topPercent *= 1 - (1 / zoom);
    leftPercent *= 1 - (1 / zoom)

    var css = {
      top: topPercent + '%',
      left: leftPercent + '%',
      height: heightPercent + '%',
      width: widthPercent + '%'
    };
    console.log(css);
    this.$element.css(css)
  };



  root.ZoomLens = ZoomLens;

})(this);