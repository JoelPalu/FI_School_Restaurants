import {mapRestaurants} from './map.js';
import {adjustLayout} from './aside.js';
//Fetches the restaurants from the API and returns them as a JSON object
async function getRestaurants() {
  const response = await fetch('https://10.120.32.94/restaurant/api/v1/restaurants');
  const restaurants  = await response.json();
  console.log(restaurants);
  return restaurants;
}

const restaurants = getRestaurants();

// Displays the restaurants on the map
restaurants.then((restaurants) => {
  mapRestaurants(restaurants);
});

const observer = new MutationObserver(adjustLayout);
observer.observe(document.getElementById('Daily'), {childList: true});
