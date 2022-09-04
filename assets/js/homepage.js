var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var formSubmitHandler = function (event) {
  event.preventDefault();
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("please enter a GitHub username");
  }
  console.log(event);
};

var getUserRepos = function (user) {
  var apiURL = "https://api.github.com/users/" + user + "/repos";
  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
          console.log(data);
        });
      } else {
        alert("Error: Github User Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    //format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
    //create container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    //create a span element to hold repo name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
    //append to container
    repoEl.appendChild(titleEl);

    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    repoEl.appendChild(statusEl);
    //append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
  console.log(repos);
  console.log(searchTerm);
};

var getFeaturedRepos = function (language) {
  var apiUrl =
    "https://api.github.com/search/repositories?q=" +
    language +
    "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
        console.log(data);
      });
      console.log(response);
    } else {
      alert("Error");
    }
  });
};

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute("data-language");
  if (language) {
    getFeaturedRepos(language);

    repoContainerEl.textContent = "";
  }
  console.log(language);
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
