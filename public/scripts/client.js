/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]

// long format of jQuery
// (document).ready(() => {
// })

$(() => {
  const loadTweets = () => {
    $.ajax ({
      url: "/tweets",
      method: "GET",
      datatype: "JSON",
      success: (tweets) => {
      renderTweets(tweets)
      },
      error:(err) => {
        console.log(`There was an error: ${error}`)
      }
    })
  }
  loadTweets();

const renderTweets = function(tweets) {
// loops through tweets
// calls createTweetElement for each tweet
// takes return value and appends it to the tweets container
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet)
    // Append to tweets container. 
    // Prepend gets the latest post first
    $('section.all-tweets').prepend($tweet);
  }
}

// Get the article of tweet
const createTweetElement = function(tweet) {
  const $tweet = `
  <article class="tweet">
  <header class="tweet header">
    <div class="user-profile">
      <img id="icon" src=${tweet.user.avatars}/>
      <p class="name">${tweet.user.name}</p>
    </div>
      <span class="username"> ${tweet.user.handle} </span>
  </header>
  <p class= "tweet-text">${tweet.content.text}</p>
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

  renderTweets(data);

  $('#tweet-form').submit(function (event) {
    //prevent the web to refresh
    event.preventDefault()
    const serializedData = $(this).serialize();
    $.post("/tweets", serializedData, (response) => {
      loadTweets()
      console.log('response:', response);
    });
  })
})

/* Make GET request to tweet database
*/

const loadTweets =function() {
  $.ajax('/tweets/', {method: "GET"})
    .then(function(allTweets) {
      renderTweets(allTweets);
    }
  )
}
loadTweets();