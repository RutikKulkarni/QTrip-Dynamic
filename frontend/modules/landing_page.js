import config from "../conf/index.js";

async function init() {
  let cities = await fetchCities();
  console.log(cities);
  if (cities) {
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  }
}

async function fetchCities() {
  try {
    let cityPromise = await fetch(config.backendEndpoint + "/cities");
    let cityData = await cityPromise.json();
    console.log(cityPromise);
    return cityData;
  } catch (err) {
    return null;
  }
}

function addCityToDOM(id, city, description, image) {
  let container = document.createElement("div");
  container.setAttribute("class", "col-sm-6 col-lg-3 my-4");
  container.innerHTML = `
  <a href="pages/adventures/?city=${id}" id="${id}" target="_blank">
  <div class="tile">
  <img src="${image}">
  <div class="tile-text text-center">
  <h5>${city}</h5>
  <p>${description}</p>
  </div>
  </div>
  </a>
  `;
  let parent = document.getElementById("data");
  parent.append(container);
}

export { init, fetchCities, addCityToDOM };
