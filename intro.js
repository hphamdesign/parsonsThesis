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
        $('.section-title-underlay').text('And there it is! You spot a book with the shiny line of “A New York Times Bestsellers” printed across the cover. The New York Times is one of the most trustworthy news outlet, and this is a bestseller determined by them. What could go wrong?').css('padding', '15px');  
      }
      else if (scrollPos >= scene3 && scrollPos < footer) {
        $('.section-title-underlay').text('Until you actually read the book and realize you blindly trusted the tittle without much second-guessing. Not only do you not enjoy the read, but you wasted quite a bit of money and time already invested in it. And now a question arise: Are the Times Bestsellers worth the hype?').css('padding', '15px');  
      }
      else {
        $('.section-title-underlay').text('').css('padding','0');  
      }
    }); // close scroll function
  }); // close document ready