$(document).ready(function() {

  $('[data-scroll]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      target.addClass('animated', 'heartBeat');
      target.addClass('delay-1s');
      target.addClass('heartBeat');

      target.on('animationend', function() {
        target.removeClass('animated', 'heartBeat');
        target.removeClass('delay-1s');
        target.removeClass('heartBeat');
      });

      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
