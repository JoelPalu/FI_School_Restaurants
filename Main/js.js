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
  const avatar = document.getElementById('avatar');
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    // check if token valid
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
      const response = await fetch('https://10.120.32.94/restaurant/api/v1/users/token', fetchOptions);
      if (!response.ok) {
        loginText.textContent = 'Login';
      } else {
        console.log('RUN TOKEN FETCH');
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(await response.json()));
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        if (user.avatar){
          avatar.src = 'https://10.120.32.94/restaurant/uploads/'+ user.avatar;
        } else {
          avatar.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        }

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
