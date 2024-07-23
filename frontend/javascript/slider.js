$(document).ready(function(){
    // Banner slider initialization
    $('.banner-slider').slick({
      dots: true,
      infinite: true,
      speed: 500,
      fade: true,
      cssEase: 'linear',
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: false,
      arrows: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false
          }
        }
      ]
    });
  
    // Reset progress bar when slide changes
    $('.banner-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
      $('.progress-bar').css('width', '0%');
    });
  
    // Animate progress bar
    $('.banner-slider').on('afterChange', function(event, slick, currentSlide){
      $('.slick-active .progress-bar').animate({width: '100%'}, 5000, 'linear');
    });
  });