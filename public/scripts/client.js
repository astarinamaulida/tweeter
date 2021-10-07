/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Short format of jQuery 
$(() => {

  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Loops through tweets
  // Calls createTweetElement for each tweet
  // Takes return value and appends it to the tweets container
  // Append to tweets container. 
  // Prepend gets the latest post first
  const renderTweets = function (tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet)
      $('section.all-tweets').prepend($tweet);
    }
  }

  // Get the article of tweet
  // Moved out from HTML file 
  const createTweetElement = function (tweet) {
    const $tweet = `
    <article class="tweet">
  <header class="tweet header">
    <div class="user-profile">
      <img id="icon" src=${tweet.user.avatars}/>
      <p class="name">${tweet.user.name}</p>
    </div>
      <span class="username"> ${tweet.user.handle} </span>
  </header>
  <p class= "tweet-text">${escape(tweet.content.text)}</p>
  <footer>
    <div class="date">${timeago.format(tweet.created_at)}</div>
    <div class = "icons">
      <i class="fa-solid fa-retweet"></i>
      <i class="fa-solid fa-flag"></i>
      <i class="fa-solid fa-heart"></i>
    </div>
  </footer>
  </article>`;
    return $tweet;
  }


  // Make GET request to tweet database
  const loadTweets = function () {
    //$.ajax('/tweets', { method: "GET" })
    $.ajax('/tweets')
      .then(function (allTweets) {
        renderTweets(allTweets);
      })
  }
  loadTweets();


  // Add an event listener that listens for the submit event
  // Prevent the default behaviour of the submit event (data submission and page refresh)
  //$('.new-tweet form').submit(function (event) {
    $('.new-tweet form').on("submit",function (event) {
    event.preventDefault();
    const $form = $(this);
    const newTweetTextStr = $form.children('textarea').val();

    // If there is no input, error message pop up
    // The new-tweet will slide down
    if (!newTweetTextStr) {
      $(".validation-text").slideUp();
      $(".validation-text").html("All tweets must contain at least one character. Your tweet currently does not.").addClass("error-message").slideDown(600)
      
      // If the character is more than 140, error message pop up
      // The new-tweet will slide down
    } else if (newTweetTextStr.length > 140) {
      $(".validation-text").slideUp();
      $(".validation-text").html("We do not accept tweets longer than 140 characters. Your tweet is currently too long.").addClass("error-message").slideDown(100)

      // Serialize the form data and send it to the server as a query string
    } else {
      $(".validation-text").slideUp();
      const tweet = $form.serialize();
      $.ajax({ url: "/tweets", method: 'POST', data: tweet })
        //.then(function (successfulPost) {
        //  return $.ajax('/tweets/', { method: 'GET' })
        //})

        // Reset the form and use renderTweets function to add new tweet to the page
        .then(function () {
          //$form[0].reset();
          //$form.children('textarea').text(140);
          $('counter').val(140);
          $('.tweet-post').val('')
          loadTweets();
        })
        .fail(function (err) {
          alert(err.responseJSON.error);
        })
    }
  })
  loadTweets();
});