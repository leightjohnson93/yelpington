let mymap;

const fetchRestaurant = async () => {
  // if (marker) marker.clearLayers();
  const restaurant = document.location.hash.slice(1);
  if (!restaurant) {
    await renderHome();
  } else {
    document.querySelector("#restaurants").innerHTML = "";
    const response = await fetch(`${restaurant}.json`);
    const data = await response.json();
    const { id, name, notes, ...info } = data;

    document.querySelector("button").removeAttribute("hidden");
    document.querySelector("#name").textContent = name;
    document.querySelector("#info").innerHTML =
      "Information" +
      Object.keys(info)
        .map(
          key => `<li>${key[0].toUpperCase() + key.slice(1)}: ${info[key]}</li>`
        )
        .join("");
    document.querySelector("#notes").innerHTML =
      "Reviews" + notes.map(note => `<li>${note}</li>`).join("");
    renderMap(data);
  }
};

const renderMap = async data => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search.php?q=${encodeURI(
      data.address
    )}&format=json`
  );
  const location = await response.json();
  const { lat, lon } = location[0];
  if (!mymap) mymap = L.map("mapid").setView([lat, lon], 17);
  const marker = L.marker([lat, lon]).addTo(mymap);
  marker.bindPopup(data.name).openPopup();
  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmJlbmd0MTQiLCJhIjoiY2pqbXd1cjR3MTZlZDN2bWY3bXExN3h3eSJ9.c7bOXSuFkNWpA4GutuYkhw",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: "your.mapbox.access.token"
    }
  ).addTo(mymap);
};

const renderHome = async () => {
  const response = await fetch(`all.json`);
  const restaurants = await response.json();
  document.querySelector("#restaurants").innerHTML =
    "Restaurants" +
    restaurants
      .map(
        restaurant =>
          `<li onclick="setTimeout(fetchRestaurant,100)"><a href="#${restaurant}">${restaurant}</a></li>`
      )
      .join("");
  document.querySelector("button").setAttribute("hidden", "");
  const locations = await fetchLocations(restaurants);
  const data = await Promise.all(
    locations.map(async location => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search.php?q=${encodeURI(
          location
        )}&format=json`
      );
      const data = await response.json();
      return data[0];
    })
  );
  data.map(location => {
    const { lat, lon } = location;
    const marker = L.marker([lat, lon]).addTo(mymap);
  });
};

const fetchLocations = restaurants => {
  const locations = Promise.all(
    restaurants.map(async restaurant => {
      const response = await fetch(`${restaurant}.json`);
      const data = await response.json();
      return data.address;
    })
  );
  return locations;
};

fetchRestaurant();
