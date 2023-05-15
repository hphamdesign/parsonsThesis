$(document).ready(function() {
    $(document).scroll(function() {
      // calculate half the viewport
      var compensation = $(window).height() / 2;
      // calculate where the sections start
    //   var home = ($('.landingpage').offset().top) - compensation;
      var scene1 = ($('.intro1').offset().top) - compensation;
      var scene2 = ($('.intro2').offset().top) - compensation;
      var scene3 = ($('.intro3').offset().top) - compensation;
    //   var knowmore = ($('.know-more-about').offset().top) - compensation;
      var footer = ($('footer').offset().top) - compensation;
      var scrollPos = $(document).scrollTop();
      
      
      // Apply text changes
      if (scrollPos >= scene1 && scrollPos < scene2) {
        $('.section-title-underlay').text('Have you ever walked into a bookstore, wanting to pick up a new book but are overwhelmed by all the choices you are presented with? So you start wondering what could set a book apart and make your decision easier...').css('padding', '15px');
      }
      else if (scrollPos >= scene2 && scrollPos < scene3) {
        $('.section-title-underlay').text('And there it is! You spot a book with the shiny line of “A New York Times Bestsellers” printed across the cover. The New York Times is one of the most trustworthy news outlet, and this is a bestseller determined by them. It is easy to be captivated by the tittle thinking this would be a great book...').css('padding', '15px');  
      }
      else if (scrollPos >= scene3 && scrollPos < footer) {
        $('.section-title-underlay').text('But have you ever paused before lining up for the cashier to ask yourself this question: Are the Times Bestsellers books worth the hype?').css('padding', '15px');  
      }
      else {
        $('.section-title-underlay').text('').css('padding','0');  
      }
    }); // close scroll function
  }); // close document ready
