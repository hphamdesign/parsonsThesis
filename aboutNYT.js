$(document).ready(function() {
    $(document).scroll(function() {
      // calculate half the viewport
      var compensation = $(window).height() / 2;
      // calculate where the sections start
      var help = ($('.aboutNYT').offset().top) - compensation;
      var statement = ($('.aboutNYT2').offset().top) - compensation;
      var footer = ($('.endAbout').offset().top) - compensation;
      var scrollPos = $(document).scrollTop();
      
      
      // Apply text changes
      if (scrollPos >= help && scrollPos < statement) {
        $('.scrolling-text').text('The New York Times Best Sellers team has issued an official statement on their website detailing the sources and methods used to generate their popular weekly lists. This aims to provide clarity on the data collection process and address any questions or concerns from the public.').css('padding', '15px').css('border','1');
      }
      else if (scrollPos >= statement && scrollPos < footer) {
        $('.scrolling-text').text('However, the article raises doubts about the actual identities of these "vendors" and "reporting retailers," as well as the reason for their anonymity. In the absence of this information, can the readers trust in the accuracy of these top-selling items?').css('padding', '15px').css('border','1'); 
      }
      else {
        $('.scrolling-text').text('').css('padding','0px').css('border','0');  
      } 
    }); // close scroll function
  }); // close document ready