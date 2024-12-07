"use strict";
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".dropdown-submenu > a")
    .forEach(function (element) {
      element.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        let submenu = this.nextElementSibling;
        submenu.classList.toggle("show");
      });
    });
  document.querySelectorAll(".dropdown").forEach(function (dropdown) {
    dropdown.addEventListener("hide.bs.dropdown", function () {
      this.querySelectorAll(".submenu").forEach(function (submenu) {
        submenu.classList.remove("show");
      });
    });
  });
  document.querySelectorAll(".dropdown-menu").forEach(function (element) {
    element.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });
});
if ($("#tpl-comment-section").length) {
  const gameId = $("#tpl-comment-section").attr("data-id");
  const commentSystem = new CommentSystem(gameId);
}
$(function () {
  const formSearch = document.querySelector("form.search-bar");
  if (formSearch) {
    formSearch.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = formSearch.querySelector("input[name='slug']");
      const sanitizedValue = input.value.replace(/ /g, "-");
      input.value = sanitizedValue;
      if (input.value.length >= 2) {
        formSearch.submit();
      }
    });
  }
  let last_offset = 0;
  let load_amount = 0;
  const newGamesContainer = $("#section-new-games");
  if (newGamesContainer.length) {
    load_amount = newGamesContainer.children().length;
    last_offset = newGamesContainer.children().length;
    if (load_amount < 12) {
      $(".btn-load-more-games").remove();
    } else {
      $(".btn-load-more-games").click(() => {
        fetchMoreGames(load_amount, "new");
      });
    }
  }
  //   async function fetchMoreGames(amount, sort_by) {
  //     try {
  //       const response = await $.ajax({
  //         url: "/includes/fetch.php",
  //         type: "POST",
  //         dataType: "json",
  //         data: { amount: amount, offset: last_offset, sort_by: sort_by },
  //       });
  //       appendFetchedGames(response);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  // async function fetchMoreGames(amount, sort_by) {
  //   try {
  //     const response = await $.ajax({
  //       url: "https://retrobowl-25.github.io/includes/fetch.php",
  //       type: "POST",
  //       dataType: "json",
  //       data: { amount: amount, offset: last_offset, sort_by: sort_by },
  //     });
  //     appendFetchedGames(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  async function fetchMoreGames(amount, sort_by) {
    try {
      const response = await fetch(
        "https://retrobowl-25.github.io/data/search-data.json"
      );
      if (!response.ok) throw new Error("Failed to fetch game data");
      const data = await response.json();
      appendFetchedGames(data.slice(last_offset, last_offset + amount));
    } catch (error) {
      console.log("Error fetching games:", error);
    }
  }

  // function appendFetchedGames(data) {
  //   last_offset += data.length;
  //   const templateHTML = $(".item-append-template").html();
  //   data.forEach((item) => {
  //     let rating = 0;
  //     item["upvote"] = Number(item["upvote"]);
  //     item["downvote"] = Number(item["downvote"]);
  //     let totalRevs = item["upvote"] + item["downvote"];
  //     if (totalRevs > 0) {
  //       rating = Math.round(
  //         (item["upvote"] / (item["upvote"] + item["downvote"])) * 5
  //       );
  //     }
  //     let clonedHTML = templateHTML;
  //     console.log(item["title"]);
  //     clonedHTML = clonedHTML.replace(/{{slug}}/g, item["slug"]);
  //     clonedHTML = clonedHTML.replace(/{{thumbnail}}/g, item["thumb_2"]);
  //     clonedHTML = clonedHTML.replace(/{{title}}/g, item["title"]);
  //     clonedHTML = clonedHTML.replace(/{{rating}}/g, rating);
  //     const clonedElement = $(clonedHTML);
  //     newGamesContainer.append(clonedElement);
  //   });
  //   if (data.length < load_amount) {
  //     $(".btn-load-more-games").remove();
  //   }
  // }
  function appendFetchedGames(data) {
    last_offset += data.length;
    // const templateHTML = $(".item-append-template").html();
    // data.forEach((item) => {
    //   let rating = 0;
    //   item["upvote"] = Number(item["upvote"]);
    //   item["downvote"] = Number(item["downvote"]);
    //   let totalRevs = item["upvote"] + item["downvote"];
    //   if (totalRevs > 0) {
    //     rating = Math.round(
    //       (item["upvote"] / (item["upvote"] + item["downvote"])) * 5
    //     );
    //   }
    //   let clonedHTML = templateHTML;
    //   console.log(item["title"]);
    //   clonedHTML = clonedHTML.replace(/{{slug}}/g, item["slug"]);
    //   clonedHTML = clonedHTML.replace(/{{thumbnail}}/g, item["thumb"]);
    //   clonedHTML = clonedHTML.replace(/{{title}}/g, item["title"]);
    //   clonedHTML = clonedHTML.replace(/{{rating}}/g, rating);
    //   const clonedElement = $(clonedHTML);
    //   newGamesContainer.append(clonedElement);
    // });
    const templateHTML = $(".item-append-template").html();
    data.forEach((item) => {
      let rating = 0;
      item["upvote"] = Number(item["upvote"]);
      item["downvote"] = Number(item["downvote"]);
      let totalRevs = item["upvote"] + item["downvote"];
      if (totalRevs > 0) {
        rating = Math.round(
          (item["upvote"] / (item["upvote"] + item["downvote"])) * 5
        );
      }
      let clonedHTML = templateHTML;
      clonedHTML = clonedHTML.replace(/{{slug}}/g, item.slug);
      clonedHTML = clonedHTML.replace(/{{thumbnail}}/g, item.thumb);
      clonedHTML = clonedHTML.replace(/{{title}}/g, item.title);
      const clonedElement = $(clonedHTML);
      clonedElement.find("img").attr("src", item.thumb); // Ensure 'src' is set
      $("#section-new-games").append(clonedElement);
    });
    if (data.length < load_amount) {
      $(".btn-load-more-games").remove();
    }
  }
  var $nav = $("nav.greedy");
  var $btn = $("nav.greedy button");
  var $vlinks = $("nav.greedy .links");
  var $hlinks = $("nav.greedy .hidden-links");
  var numOfItems = 0;
  var totalSpace = 0;
  var breakWidths = [];
  $vlinks.children().outerWidth(function (i, w) {
    totalSpace += w;
    numOfItems += 1;
    breakWidths.push(totalSpace);
  });
  var availableSpace, numOfVisibleItems, requiredSpace;
  function check() {
    availableSpace = $vlinks.width() - 10;
    numOfVisibleItems = $vlinks.children().length;
    requiredSpace = breakWidths[numOfVisibleItems - 1];
    if (requiredSpace > availableSpace) {
      $vlinks.children().last().prependTo($hlinks);
      numOfVisibleItems -= 1;
      check();
    } else if (availableSpace > breakWidths[numOfVisibleItems]) {
      $hlinks.children().first().appendTo($vlinks);
      numOfVisibleItems += 1;
    }
    $btn.attr("count", numOfItems - numOfVisibleItems);
    if (numOfVisibleItems === numOfItems) {
      $btn.addClass("hidden");
    } else $btn.removeClass("hidden");
  }
  $(window).resize(function () {
    check();
  });
  $btn.on("click", function () {
    $hlinks.toggleClass("hidden");
  });
  check();
});
function open_fullscreen() {
  let game = document.getElementById("game-area");
  if (game.requestFullscreen) {
    game.requestFullscreen();
  } else if (game.mozRequestFullScreen) {
    game.mozRequestFullScreen();
  } else if (game.webkitRequestFullscreen) {
    game.webkitRequestFullscreen();
  } else if (game.msRequestFullscreen) {
    game.msRequestFullscreen();
  }
}
var can_resize = false;
if ($("iframe#game-area").length) {
  can_resize = true;
  resize_game_iframe();
  load_leaderboard({ type: "top", amount: 10 });
}
function resize_game_iframe() {
  if (can_resize) {
    let iframe = $("iframe.game-iframe");
    let size = {
      width: Number(iframe.attr("width")),
      height: Number(iframe.attr("height")),
    };
    let ratio = (size.height / size.width) * 100;
    let win_ratio = (window.innerHeight / window.innerWidth) * 100;
    if (win_ratio <= 110) {
      if (ratio > 80) {
        ratio = 80;
      }
    } else if (win_ratio >= 130) {
      if (ratio < 100) {
        ratio = 100;
      }
    }
    $(".game-iframe-container").css("padding-top", ratio + "%");
  }
}
function load_leaderboard(conf) {
  if ($("#content-leaderboard").length) {
    let g_id = $("#content-leaderboard").data("id");
    $.ajax({
      url: "/includes/api.php",
      type: "POST",
      dataType: "json",
      data: {
        action: "get_scoreboard",
        "game-id": g_id,
        conf: JSON.stringify(conf),
      },
      complete: function (data) {
        if (data.responseText) {
          show_leaderboard(JSON.parse(data.responseText));
        }
      },
    });
  }
}
function show_leaderboard(data) {
  let html =
    '<table class="table"><thead class="thead-dark"><tr><th scope="col">#</th><th scope="col">Username</th><th scope="col">Score</th><th scope="col">Date</th></tr></thead><tbody>';
  let index = 1;
  data.forEach((item) => {
    html +=
      '<tr><th scope="row">' +
      index +
      "</th><td>" +
      item.username +
      "</td><td>" +
      item.score +
      "</td><td>" +
      item.created_date.substr(0, 10) +
      "</td></tr>";
    index++;
  });
  html += "</tbody></table>";
  $("#content-leaderboard").html(html);
}
(function () {
  $("#navb").on("show.bs.collapse", function () {
    $(".user-avatar").hide();
  });
  $("#navb").on("hidden.bs.collapse", function () {
    $(".user-avatar").show();
  });
  resize_game_iframe();
  $(window).resize(function () {
    resize_game_iframe();
  });
  $(".stats-vote #favorite").on("click", function () {
    let data_id = $(this).attr("data-id");
    let btn = $(this);
    $.ajax({
      url: "/includes/vote.php",
      type: "POST",
      dataType: "json",
      data: { favorite: true, action: "favorite", id: data_id },
      success: function (data) {},
      error: function (data) {},
      complete: function (data) {
        console.log(data.responseText);
        btn.addClass("active");
        btn.addClass("disabled");
      },
    });
  });
  $(".stats-vote #upvote").on("click", function () {
    let data_id = $(this).attr("data-id");
    $.ajax({
      url: "/includes/vote.php",
      type: "POST",
      dataType: "json",
      data: { vote: true, action: "upvote", id: data_id },
      success: function (data) {},
      error: function (data) {},
      complete: function (data) {
        console.log(data.responseText);
        $(".icon-vote").hide();
        let elem = $(".vote-status");
        elem.addClass("text-success");
        elem.append("Liked!");
      },
    });
  });
  $(".stats-vote #downvote").on("click", function () {
    let data_id = $(this).attr("data-id");
    $.ajax({
      url: "/includes/vote.php",
      type: "POST",
      dataType: "json",
      data: { vote: true, action: "downvote", id: data_id },
      success: function (data) {},
      error: function (data) {},
      complete: function (data) {
        console.log(data.responseText);
        $(".icon-vote").hide();
        let elem = $(".vote-status");
        elem.addClass("text-danger");
        elem.append("Disliked!");
      },
    });
  });
  $(".user-avatar").on("click", () => {
    let element = $(".user-links");
    if (element.is(":hidden")) {
      element.removeClass("hidden");
    } else element.addClass("hidden");
  });
  $("#btn_prev").on("click", function () {
    $(".profile-gamelist ul").animate({ scrollLeft: "-=150" }, 300, "swing");
  });
  $("#btn_next").on("click", function () {
    $(".profile-gamelist ul").animate({ scrollLeft: "+=150" }, 300, "swing");
  });
  $("#f_prev").on("click", function () {
    $(".favorite-gamelist ul").animate({ scrollLeft: "-=150" }, 300, "swing");
  });
  $("#f_next").on("click", function () {
    $(".favorite-gamelist ul").animate({ scrollLeft: "+=150" }, 300, "swing");
  });
  $(".delete-comment").on("click", function () {
    let id = $(this).attr("data-id");
    $.ajax(
      {
        url: "/includes/comment.php",
        type: "POST",
        dataType: "json",
        data: { delete: true, id: id },
        success: function (data) {},
        error: function (data) {},
        complete: function (data) {
          console.log(data.responseText);
          if (data.responseText === "deleted") {
            $(".id-" + id).remove();
          }
        },
      },
      this
    );
  });
})();
