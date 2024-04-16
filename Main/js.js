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


// when page loaded
(async () => {
  const loginText = document.getElementById('login-text');
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    // check if token valid
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
      const response = await fetch('http://localhost:3000/api/v1/auth/me', fetchOptions);
      if (!response.ok) {
        loginText.textContent = 'Login';
      } else {
        const user = JSON.parse(localStorage.getItem('user'));
        loginText.textContent = user.username;
      }
    } catch (e) {
      console.log(e.message);
    }
  } else {
    // when starting app and nothing in sessionStorage
    loginText.textContent = 'Login';
  }
})();
