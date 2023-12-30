import config from "../conf/index.js";

function getCityFromURL(search) {
  let parameter = new URLSearchParams(search);
  return parameter.get("city");
}

async function fetchAdventures(city) {
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

function addAdventureToDOM(adventures) {
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

function filterByDuration(list, low, high) {
  let advByDuration = [];
  list.forEach((adv) => {
    if (adv.duration >= low && adv.duration <= high) {
      advByDuration.push(adv);
    }
  });
  return advByDuration;
}

function filterByCategory(list, categoryList) {
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

function filterFunction(list, filters) {
  if (filters.duration.length !== 0 && filters.category.length === 0) {
    let low = filters.duration.split("-")[0];
    let high = filters.duration.split("-")[1];
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

  return list;
}

function saveFiltersToLocalStorage(filters) {
  localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

function getFiltersFromLocalStorage() {
  let filItems = JSON.parse(localStorage.getItem("filters"));
  // return null;
  return filItems;
}
function generateFilterPillsAndUpdateDOM(filters) {
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
