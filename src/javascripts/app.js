function startAnimation() {
  var elements = $('.animated');

  elements.each(function()  {
    var elem = $(this);

    var animation = elem.data('animation');
    var delay = elem.data('animation-delay');

    if(elem.isOnScreen()) {
      elem.addClass(animation);

      if(delay) {
        elem.css('animation-delay', delay + 's');
      }

      elem.on('animationstart', function() {
        $(this).css('visibility', 'visible');
      })
    }
  })
}

$(document).ready(function() {

  // viewport detecting
  $.fn.isOnScreen = function(){
    var win = $(window);
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
  };

  startAnimation();

  $(document).on('scroll', function(e) {
    startAnimation();
  });

  // scroll to
  $('[data-scroll]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      target.addClass('shake');
      target.addClass('animated');

      target.on('animationstart', function() {
        $(this).css('visibility', 'visible');
      })

      target.on('animationend', function() {
        target.removeClass('shake');
        target.removeClass('animated');
      });

      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  // Change value in select
  $(document).on('change', '.select--form', function() {
    var nextSelect = $(this).parent().next();

    if(nextSelect.length) {
      nextSelect.show();
    }
  });

  // Change value in input
  $('#place-count').on('input', function() {
    var isVal = $(this).val().length;
    var btn = $(this).parents('.form-main').find('[type="submit"]');

    if(isVal) {
      btn.removeAttr('disabled');
    } else {
      btn.attr('disabled', true);
    }
  });

  $('[data-open-modal]').on('click', function() {
    $('html').addClass('page--modal-opened');
  });

  // modal opening
  $(document).on('click', function(e) {

    if($(e.target).attr('data-close-modal')) {
      $('html').removeClass('page--modal-opened');
    }
  });
});
