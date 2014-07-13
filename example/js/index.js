
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
  var $zoom3Position = $('.my-zoom-position-3');
  var zoom3 = new Zoom({
    element: $zoom3,
    positionElement: $zoom3Position,
    src: {
      lg: 'img/color-md.jpg',
      md: 'img/color-md.jpg'
    }
  });

});
