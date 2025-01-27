$(document).ready(function(event) {
  // --- our code goes here ---
  $('.new-tweet textarea').on('input', function() {
    let newTweetLength = $(this).val().length;
    let nearbyCounter = $(this).parent().find('.counter');
    const tweetLengthLimit = 140;

    /* Add class red if the new tweet is longer than tweet length limit (140) */
    if (newTweetLength > tweetLengthLimit) {
      nearbyCounter.addClass('red');
    } else if (newTweetLength <= tweetLengthLimit) {
      nearbyCounter.removeClass('red');
    }
    nearbyCounter.text(tweetLengthLimit - newTweetLength);
  });
});