import config from "../conf/index.js";

//Implementation to extract city from query params

function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it

  let parameter = new URLSearchParams(search);
  return parameter.get("city");
}

//Implementation of fetch call with a paramterized input based on city

async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data

  try {
    let cityProm = await fetch(
      config.backendEndpoint + "/adventures?city=" + city
    );
    let cityData = await cityProm.json();
    return cityData;
  } catch (err) {
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures

function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM

  adventures.forEach((adv) => {
    let container = document.createElement("div");
    container.setAttribute("class", "col-sm-6 col-lg-3 my-4");
    container.innerHTML += `
    <a href="detail/?adventure=${adv.id}" id="${adv.id}" target="_blank">
    <div class="activity-card">
    <div class="category-banner">
    <h5 class="my-0">${adv.category}</h5>
    </div>
    <img src="${adv.image}">
    <div class="d-flex justify-content-between align-items-center py-2" style="width: 90%">
    <div>
    <h6>${adv.name}</h6>
    <h6>Duration</h6>
    </div>
    <div>
    <h6>${adv.currency} ${adv.costPerHead}</h6>
    <h6>${adv.duration} Hours</h6>
    </div>
    </div>
    </div>
    </a> `;
    let parent = document.getElementById("data");
    parent.append(container);
  });
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list

  let advByDuration = [];
  list.forEach((adv) => {
    if (adv.duration >= low && adv.duration <= high) {
      advByDuration.push(adv);
    }
  });
  return advByDuration;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list

  let advByCategory = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < categoryList.length; j++) {
      if (list[i].category === categoryList[j]) {
        advByCategory.push(list[i]);
      }
    }
  }
  return advByCategory;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures

  if (filters.duration.length !== 0 && filters.category.length === 0) {
    let low = filters.duration.split("-")[0];
    let high = filters.duration.split("-")[1];

    // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods

    let filByDuration = filterByDuration(list, low, high);
    return filByDuration;
  } else if (filters.category.length !== 0 && filters.duration.length === 0) {
    let filByCategory = filterByCategory(list, filters.category);
  } else if (filters.duration.length !== 0 && filters.category.length !== 0) {
    let low = filters.duration.split("-")[0];
    let high = filters.duration.split("-")[1];
    let filByDuration = filterByDuration(list, low, high);
    let filByCategory = filterByCategory(list, filters.category);

    let filByDurationIds = filByDuration.map((adv) => {
      return adv.id;
    });
    let filteredAdvs = filByCategory.filter((advs) => {
      return filByDurationIds.includes(advs.id);
    });
    return filteredAdvs;
  }

  // Place holder for functionality to work in the Stubs
  return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage

  localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object

  let filItems = JSON.parse(localStorage.getItem("filters"));

  // Place holder for functionality to work in the Stubs
  // return null;
  return filItems;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills

  document.getElementById("duration-select").value = filters.duration;
  let categoryFils = document.getElementById("category-list");
  filters.category.forEach((fils) => {
    categoryFils.innerHTML += `
    <div class="category-filter">
    ${fils}
    </div>
    `;
  });
}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
