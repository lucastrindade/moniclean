/*---------------------------------------------------------------------
  Moniclean — scripts used on index.html only
---------------------------------------------------------------------*/

$(function () {
  'use strict';

  /* NiceSelect — contact form <select> elements (plugin in plugin.js) */
  $(document).ready(function () {
    $('select').niceSelect();
  });

  /* Bootstrap carousel: sync .active on service tiles (desktop + mobile) */
  $(document).ready(function () {
    $('#main_slider_desktop, #main_slider_mobile').on('slid.bs.carousel', function (e) {
      var carouselId = $(this).attr('id');
      var currentSlide = e.to;

      $('#' + carouselId + ' .box_section').removeClass('active');
      $('#' + carouselId + ' .tile_text').removeClass('active');
      $('#' + carouselId + ' .lorem_text').removeClass('active');

      $('#' + carouselId + ' .carousel-item')
        .eq(currentSlide)
        .find('.box_section')
        .addClass('active');
      $('#' + carouselId + ' .carousel-item')
        .eq(currentSlide)
        .find('.tile_text')
        .addClass('active');
      $('#' + carouselId + ' .carousel-item')
        .eq(currentSlide)
        .find('.lorem_text')
        .addClass('active');
    });
  });
});
