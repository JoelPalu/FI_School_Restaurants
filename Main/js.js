import {mapRestaurants, setRestaurants} from './map.js';
import {adjustLayout} from './aside.js';
import {generateNavbar} from './navbar.js';

// Fetches the restaurants from the API and returns them as a JSON object
let userLocation;
let restaurants;

async function getRestaurants() {
  const success = (position) => {
    userLocation = {
      x: position.coords.latitude,
      y: position.coords.longitude,
    };
  };

  await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  }).then(success);
  const response = await fetch('https://10.120.32.94/restaurant/api/v1/restaurants');
  const restaurants = await response.json();
  restaurants.forEach((restaurant) => {
    const lat1 = restaurant.location.coordinates[1];
    const lon1 = restaurant.location.coordinates[0];
    const lat2 = userLocation.x;
    const lon2 = userLocation.y;

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     // Distance in km
    restaurant.newdistance = R * c * 1;
  });
  restaurants.sort((a, b) => (a.newdistance * 1) - (b.newdistance * 1));
  return restaurants;
};

async function generateMap() {
  const map = mapRestaurants(restaurants, 10);
  const observer = new MutationObserver(adjustLayout);
  observer.observe(document.getElementById('Daily'), {childList: true});

// Displays the restaurants on the map
  const slider = document.getElementById('myRange');
  slider.addEventListener('input', () => {
    setRestaurants(restaurants, map, (Math.pow(slider.value / 100, 4)));
  });

}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}



// when page loaded
(async () => {
  restaurants = await getRestaurants();
  await generateNavbar();
  await generateMap();
  console.log(restaurants);
  const loginText = document.getElementById('login-text');
  const avatar = document.getElementById('avatar');
  avatar.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  if (localStorage.getItem('token') && localStorage.getItem('user')) {
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
    loginText.textContent = 'Login';
  }
})();
