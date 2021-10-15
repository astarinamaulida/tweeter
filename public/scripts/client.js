// Prevents XSS by converting the string to a text node
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Prepend gets the latest post first
const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $("section.all-tweets").prepend($tweet);
  }
};

// Make GET request to tweet database
const loadTweets = function() {
  $.ajax("/tweets", { method: "GET" })
    .then(function(allTweets) {
      renderTweets(allTweets);
    });
};
loadTweets();


// Get the article of tweet
const createTweetElement = function(tweet) {
  const $tweet = `
  <article class="tweet">
    <header class="tweet header">
     <div class="user-profile">
       <img id="icon" src=${tweet.user.avatars}/>
       <p class="name">${tweet.user.name}</p>
      </div>
      <span class="username">${tweet.user.handle}</span>
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
};

const errorMessage = function(error) {
  let injection;
  if (error === "empty") {
    injection = `<div class= "error-message"> Oops! All tweets must contain at least one character. Please write a tweet with a minimum of one character.</div>`;
  } else {
    injection = `<div class= "error-message"> Oops! Your tweet is longer than 140 characters. Please write a tweet with a maximum of 140 characters.</div>`;
  }
  return injection;
};

// Short format of jQuery
$(() => {
  // Add an event listener that listens for the submit event
  // Prevent the default behaviour of the submit event (data submission and page refresh)
  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();
    const $form = $(this);
    const newTweetTextStr = $form.children("textarea").val();

    // If there is no input, error message will slide down
    if (!newTweetTextStr) {
      $(".validation-text").html(errorMessage("empty")).slideDown('fast').delay(1500).fadeOut(1000);
      
      // If the character is more than 140, error message will slide down
    } else if (newTweetTextStr.length > 140) {
      $(".validation-text").html(errorMessage("limit")).slideDown('fast').delay(1500).fadeOut(1000);
      
      // Serialize the form data and send it to the server as a query string
    }  else {
      $(".validation-text").slideUp();
      const tweet = $form.serialize();
      $.ajax({ url: "/tweets", method: "POST", data: tweet })
        .then(function() {
          return $.ajax('/tweets/', { method: 'GET' });
        })
        // Reset the form after new tweet published
        // Counter return to 140 and tweet form back to empty
        .then(function(allTweets) {
          $(".counter").text(140);
          $(".tweet-post").val("");
          const latestTweet = [allTweets[allTweets.length - 1]];
          renderTweets(latestTweet);
        })
        .fail(function(err) {
          alert(err.responseJSON.error);
        });
    }
  });
});