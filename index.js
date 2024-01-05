const imgBaseUrl = `https://image.tmdb.org/t/p/`;
const imgBackdropSize = "w300";

const API_KEY = "&api_key=" + "31e041cfec6ff3251c8f8ce5933839f3";
const topratedBaseUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1${API_KEY}`;
const popularBaseUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1${API_KEY}`;

const topRatedBtn = document.querySelector("#topRatedBtn");
const popularBtn = document.querySelector("#popularBtn");

const contentText = document.querySelector(".contentText");
const contentWrapper = document.querySelector(".contentWrapper");
const movieCardDiv = document.createElement("div");
const contentContainer = document.querySelector("#contentContainer");
const form = document.querySelector("form");
const errorMessage = document.createElement("h2");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const userInput = document.querySelector("#textInput").value;
  const userChoice = document.querySelector(
    'input[name="movieOrActor"]:checked'
  ).value;

  const API_KEY = "&api_key=" + "31e041cfec6ff3251c8f8ce5933839f3";
  const searchBaseUrl = `https://api.themoviedb.org/3/search/${userChoice}`;
  const searchQueries = `?query=${userInput}&include_adult=false&language=en-US&page=1`;
  const searchUrl = searchBaseUrl + searchQueries + API_KEY;
  console.log(searchUrl);
  let url;

  contentContainer.innerHTML = "";
  contentText.innerHTML = "";
  errorMessage.innerText = "";

  if (userChoice == "movie") {
    url = searchUrl;
  } else if (userChoice == "person") {
    url = searchUrl;
  }
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then((data) => {
      console.log(data);

      if (data.total_results === 0) {
        throw 404;
      }

      if (userChoice === "movie") {
        displayMovies(data);
      } else if (userChoice === "person") {
        displayActors(data);
      }
    })
    .catch(displayError);

  form.reset();
});

function displayMovies(movies) {
  console.log("hej");
  for (const movie of movies.results) {
    // console.log(movie);
    const movieCardDiv = document.createElement("div");
    movieCardDiv.classList.add("movieCards");

    createAndAppendElement(
      "img",
      imgBaseUrl + imgBackdropSize + movie.poster_path,
      movieCardDiv
    );
    createAndAppendElement("h3", movie.title, movieCardDiv);
    createAndAppendElement("p", movie.release_date, movieCardDiv);
    createAndAppendElement("p", movie.overview, movieCardDiv);

    contentContainer.append(movieCardDiv);
    anime(movieCardDivAnimation);
  }
}

function displayActors(people) {
  console.log(people.results);

  for (const person of people.results) {
    const movieCardDiv = document.createElement("div");
    movieCardDiv.id = "movieCard";
    movieCardDiv.classList.add("movieCards");

    createAndAppendElement(
      "img",
      imgBaseUrl + imgBackdropSize + person.profile_path,
      movieCardDiv
    );
    createAndAppendElement("h3", person.name, movieCardDiv);
    createAndAppendElement(
      "p",
      "Known for: " + person.known_for_department,
      movieCardDiv
    );
    createAndAppendElement(
      "ul",
      "Most famous movies or series: ",
      movieCardDiv
    );

    for (const item of person.known_for) {
      let title;
      if (item.title == null) {
        console.log(item);
        title = item.name;
      } else {
        title = item.title;
      }

      createAndAppendElement("p", item.media_type + ": " + title, movieCardDiv);
    }

    contentContainer.append(movieCardDiv);
    anime(movieCardDivAnimation);
  }
}

topRatedBtn.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("hej");

  contentContainer.innerHTML = "";
  contentText.innerHTML = "";

  fetch(topratedBaseUrl)
    .then(function (response) {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(displayTopRated)
    .catch(displayError);
});

function displayTopRated(topRated) {
  // console.log(topRated);
  for (const topRatedMovie of topRated.results.splice(10)) {
    // console.log(topRatedMovie);

    const movieCardDiv = document.createElement("div");
    movieCardDiv.classList.add("movieCards");

    contentText.innerHTML = "TOP TEN RATED MOVIES!";
    createAndAppendElement(
      "img",
      imgBaseUrl + imgBackdropSize + topRatedMovie.backdrop_path,
      movieCardDiv
    );
    createAndAppendElement("h3", topRatedMovie.title, movieCardDiv);
    createAndAppendElement(
      "p",
      "Rated: " + topRatedMovie.vote_average,
      movieCardDiv
    );
    createAndAppendElement("p", topRatedMovie.release_date, movieCardDiv);
    createAndAppendElement("p", topRatedMovie.overview, movieCardDiv);

    contentContainer.append(movieCardDiv);
    anime(movieCardDivAnimation);
  }
}

popularBtn.addEventListener("click", (event) => {
  event.preventDefault();

  contentContainer.innerHTML = "";
  contentText.innerHTML = "";

  fetch(popularBaseUrl)
    .then(function (response) {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(displayPopularMovies)
    .catch(displayError);
});

function displayPopularMovies(popularMovies) {
  console.log(popularMovies);
  for (const popularMovie of popularMovies.results.splice(10)) {
    // console.log(popularMovie);
    const movieCardDiv = document.createElement("div");
    movieCardDiv.classList.add("movieCards");

    contentText.innerHTML = "MOST POPULAR MOVIES!";
    createAndAppendElement(
      "img",
      imgBaseUrl + imgBackdropSize + popularMovie.backdrop_path,
      movieCardDiv
    );
    createAndAppendElement("h3", popularMovie.title, movieCardDiv);
    createAndAppendElement(
      "p",
      "Rated: " + popularMovie.vote_average,
      movieCardDiv
    );
    createAndAppendElement("p", popularMovie.release_date, movieCardDiv);
    createAndAppendElement("p", popularMovie.overview, movieCardDiv);

    contentContainer.append(movieCardDiv);
    anime(movieCardDivAnimation);
  }
}

function createAndAppendElement(type, content, container) {
  const element = document.createElement(type);
  container.append(element);

  if (type === "img") element.src = content;
  else element.innerHTML = content;
  return element;
}

function displayError(error) {
  console.log(error);
  contentWrapper.append(errorMessage);
  if (error === 404) {
    errorMessage.innerText =
      "The movie or person you searched for were not found. Check your spelling and try again";
  } else {
    errorMessage.innerText = "Something went wrong, try again later.";
  }
}

const H1animation = {
  targets: "h1",
  scale: 1.5,
  delay: 500,
};

anime(H1animation);

const movieCardDivAnimation = {
  targets: ".movieCards",
  translateY: [200, 0],
  return: 0,
};
