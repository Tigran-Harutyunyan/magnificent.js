
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


});
