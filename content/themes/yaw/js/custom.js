let jsonData = null;
let debounceTimer;
document.querySelector(".search-bar").addEventListener("submit", function (e) {
  e.preventDefault();
  performSearch();
});
function debounce(func, delay) {
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}
document.getElementById("searchInput").addEventListener("input", function () {
  if (this.value.length >= 1) {
    showSearchingIndicator();
    debounce(performSearch, 300)();
  } else {
    document.getElementById("searchResults").style.display = "none";
    hideSearchingIndicator();
  }
});
function showSearchingIndicator() {
  document.getElementById("searchingIndicator").style.display = "block";
  document.getElementById("searchResults").style.display = "none";
}
function hideSearchingIndicator() {
  document.getElementById("searchingIndicator").style.display = "none";
}
async function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  console.log("Performing search for:", searchTerm);
  if (!jsonData) {
    try {
      console.log("Fetching JSON data...");
      const response = await fetch("/data/search-data.json");
      jsonData = await response.json();
      console.log("JSON data loaded. Total items:", jsonData.length);
      console.log("Sample item:", JSON.stringify(jsonData[0], null, 2));
    } catch (error) {
      console.error("Error loading JSON:", error);
      hideSearchingIndicator();
      return;
    }
  }
  const results = jsonData.filter((item) => {
    if (typeof item === "object" && item !== null) {
      return Object.entries(item).some(([key, value]) => {
        if (
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm)
        ) {
          return true;
        }
        return false;
      });
    }
    return false;
  });
  displayResults(results);
}
// async function performSearch() {
//   const searchTerm = document
//     .getElementById("searchInput")
//     .value.toLowerCase()
//     .trim();

//   // Show indicator while searching
//   showSearchingIndicator();

//   // Load JSON data if not already loaded
//   if (!jsonData) {
//     try {
//       const response = await fetch("/data/search-data.json");
//       jsonData = await response.json();
//     } catch (error) {
//       console.error("Error loading JSON:", error);
//       hideSearchingIndicator(); // Hide indicator on failure
//       return;
//     }
//   }

//   // Filter results
//   const results = jsonData.filter((item) =>
//     Object.values(item).some(
//       (value) =>
//         typeof value === "string" && value.toLowerCase().includes(searchTerm)
//     )
//   );

//   // If no results, redirect to the homepage without parameters
//   // if (results.length === 0) {
//   //   hideSearchingIndicator(); // Hide indicator before redirect
//   //   window.location.replace("https://retrobowl-25.github.io/game/404/");
//   //   return;
//   // }

//   // Display search results if found
//   displayResults(results);
// }

function displayResults(results) {
  // If no results, redirect to the homepage without parameters
  if (results.length === 0) {
    hideSearchingIndicator(); // Hide indicator before redirect
    // window.location.replace("https://retrobowl-25.github.io/game/404/");
    return;
  }
  const resultsContainer = document.getElementById("searchResults");
  resultsContainer.innerHTML = "";
  if (results.length > 0) {
    results.forEach((item) => {
      if (item) {
        const li = document.createElement("li");
        li.innerHTML = `<img src="${
          item.thumb || "/path/to/default-thumbnail.jpg"
        }"alt="${
          item.name
        }"class="search-result-thumb"><div class="search-result-info">${
          item.name || item.title || "Unknown Game"
        }</div>`;
        li.addEventListener("click", function () {
          window.location.href = item.url || "#";
        });
        resultsContainer.appendChild(li);
      }
    });
  }
  // const searchAllLi = document.createElement("li");
  // searchAllLi.className = "search-all";
  // searchAllLi.textContent = "Search All";
  // searchAllLi.addEventListener("click", function () {
  //   document.querySelector(".search-bar").submit();
  // });
  // resultsContainer.appendChild(searchAllLi);
  hideSearchingIndicator();
  resultsContainer.style.display = "block";
}
document.addEventListener("click", function (event) {
  const searchBar = document.querySelector(".search-bar");
  const searchResults = document.getElementById("searchResults");
  if (!searchBar.contains(event.target)) {
    searchResults.style.display = "none";
  }
});
setTimeout(() => {
  if (jsonData && jsonData.length > 0) {
    console.log("JSON data structure:");
    console.log("Total items:", jsonData.length);
    console.log("Keys in first item:", Object.keys(jsonData[0]));
    console.log("Sample item:", JSON.stringify(jsonData[0], null, 2));
  } else {
    console.log("JSON data is empty or not loaded");
  }
}, 1000);
