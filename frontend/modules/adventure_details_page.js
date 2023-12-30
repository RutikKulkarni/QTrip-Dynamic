import config from "../conf/index.js";

function getAdventureIdFromURL(search) {
  let params = new URLSearchParams(search);
  // return null;
  return params.get("adventure");
}
async function fetchAdventureDetails(adventureId) {
  try {
    const data = await fetch(
      config.backendEndpoint + `/adventures/detail?adventure=${adventureId}`
    );
    return await data.json();
  } catch {
    return null;
  }
}

function addAdventureDetailsToDOM(adventure) {
  document.getElementById("adventure-name").append(adventure.name);
  document.getElementById("adventure-subtitle").append(adventure.subtitle);
  for (let i = 0; i < adventure.images.length; i++) {
    var div = document.createElement("div");
    var img = document.createElement("img");
    img.setAttribute("class", "activity-card-image");
    img.src = adventure.images[i];
    div.append(img);
    document.getElementById("photo-gallery").append(div);
  }
  document.getElementById("adventure-content").append(adventure.content);
}

function addBootstrapPhotoGallery(images) {
  let photoGallery = document.getElementById("photo-gallery");
  photoGallery.innerHTML = `
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="slide 3"></button>
      </div>
      <div class="carousel-inner"  id="carousel-inner">
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;
  images.map((key, index) => {
    let divElement = document.createElement("div");
    divElement.className = `carousel-item ${index === 0 ? "active" : ""}`;
    divElement.innerHTML = `
      <img src=${key} class="activity-card-image pb-3"/>
    `;
    document.getElementById("carousel-inner").appendChild(divElement);
  });
}

function conditionalRenderingOfReservationPanel(adventure) {
  if (adventure["available"]) {
    document.getElementById("reservation-panel-sold-out").style.display =
      "none";
    document.getElementById("reservation-panel-available").style.display =
      "block";
    document.getElementById("reservation-person-cost").innerHTML =
      adventure["costPerHead"];
  } else {
    document.getElementById("reservation-panel-sold-out").style.display =
      "block";
    document.getElementById("reservation-panel-available").style.display =
      "none";
  }
}

function calculateReservationCostAndUpdateDOM(adventure, persons) {
  const reservationCost = persons * adventure["costPerHead"];
  const reservationCostElement = document.getElementById("reservation-cost");
  reservationCostElement.innerHTML = reservationCost;
}

function captureFormSubmit(adventure) {
  const myForm = document.getElementById("myForm");
  myForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let data = {
      name: myForm.elements["name"].value,
      date: new Date(myForm.elements["date"].value),
      person: myForm.elements["person"].value,
      adventure: adventure["id"],
    };
    try {
      const url = `${config.backendEndpoint}/reservations/new`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Success!");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  });
}

function showBannerIfAlreadyReserved(adventure) {
  if (adventure["reserved"] === true) {
    document.getElementById("reserved-banner").style.display = "block";
  } else {
    document.getElementById("reserved-banner").style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
