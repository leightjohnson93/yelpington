const fetchRestaurant = async () => {
  const name = document.location.hash.slice(1);

  if (!name) {
    console.log("no place name specfied");
  } else {
    console.log(`fetching ${name}...`);
    const response = await fetch(`${name}.json`);
    const data = await response.json();
  }
};

const renderRestaurant = () => {};

fetchRestaurant();
