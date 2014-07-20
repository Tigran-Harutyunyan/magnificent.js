
$(function () {

  var $zoom1 = $('.my-zoom-1');
  var zoom1 = new Zoom({
    element: $zoom1,
    src: {
      lg: 'img/color-md.jpg',
      md: 'img/color-md.jpg'
    }
  });

  var $zoom2 = $('.my-zoom-2');
  var zoom2 = new Zoom({
    element: $zoom2,
    smooth: false,
    src: {
      lg: 'img/color-md.jpg',
      md: 'img/color-md.jpg'
    }
  });

  var $zoom3 = $('.my-zoom-3');
  var $zoom3Controller = $('.my-zoom-3-controller');
  var zoom3 = new Zoom({
    element: $zoom3,
    controllerElement: $zoom3Controller,
    gutter: 0.4,
    src: {
      lg: 'img/color-md.jpg',
      md: 'img/color-md.jpg'
    }
  });

  var $zoom3Lens = $('<div>', {
    'class': 'mg-zoom-lens'
  });

  var zoom3Lens = new ZoomLens({
    element: $zoom3Lens,
    zoomElement: $zoom3
  });

  $zoom3Controller.append($zoom3Lens);
  $zoom3Controller.css({
    'background-image': 'url("img/color-md.jpg")',
    'background-size': '100%'
  });

});
