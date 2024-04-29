import {getMenu} from './aside.js';


let markers;
export function mapRestaurants(restaurants, renderDistance) {

  navigator.geolocation.getCurrentPosition(success);
  const map = L.map('map');

  const customIconUser = L.icon({
    iconUrl: 'marker-icon-2x-user.png', // replace with the path to your icon image
    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 35], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -35], // point from which the popup should open relative to the iconAnchor
  });

  async function success(position) {
    const userLocation = {
      x: position.coords.latitude,
      y: position.coords.longitude,
    };
    map.setView([userLocation.x, userLocation.y], 13);
    markers = L.layerGroup().addTo(map);
    L.marker([userLocation.x, userLocation.y], {icon: customIconUser}).setZIndexOffset(1000).addTo(map).bindPopup('You are here');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    restaurants.forEach((restaurant) => {
      restaurant.distance = Math.sqrt( Math.pow(restaurant.location.coordinates[0] - userLocation.y, 2) + Math.pow(restaurant.location.coordinates[1] - userLocation.x, 2));
    });
    restaurants.sort((a, b) => a.distance - b.distance);
    setRestaurants(restaurants, map, renderDistance);
  }
  return map;
}
const customIconClosest = L.icon({
  iconUrl: 'marker-icon-2x-closest.png', // replace with the path to your icon image
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -35], // point from which the popup should open relative to the iconAnchor
});

const customIconFav = L.icon({
  iconUrl: 'marker-icon-2x-fav.png', // replace with the path to your icon image
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -35], // point from which the popup should open relative to the iconAnchor
});

export async function setRestaurants(restaurants, map, renderDistance) {
  let first = false;
  markers.clearLayers();

  for (const restaurant of restaurants) {

    if (restaurant.distance > renderDistance) {
      return;
    }
    const filterDistance = restaurant.newdistance.toFixed(2);
    const marker = L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]]).addTo(map);
    marker.bindPopup(`<h3>${restaurant.name}</h3><p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
<p>${filterDistance} km</p>`);


    //Mark closest restaurant with a different icon
    if (!first){
      marker.setIcon(customIconClosest).setZIndexOffset(99);
      first = true;
    }

    if(restaurant._id === JSON.parse(localStorage.getItem('user')).favouriteRestaurant){
      marker.setIcon(customIconFav).setZIndexOffset(101);
    }



    marker.on('popupopen', async function() {
      const aside = document.getElementById('Daily');
      const favourite = document.createElement('button');
      favourite.textContent = 'Favourite';
      favourite.addEventListener('click', async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        user.favouriteRestaurant = restaurant._id;
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Favourite button clicked');
        await setFavRestaurant(restaurant._id);
        await setRestaurants(restaurants, map, renderDistance);
      });

      aside.appendChild(favourite);
      await getMenu(restaurant, 'en');
    });

    map.on('popupclose', function() {
      const aside = document.getElementById('Daily');
      aside.innerHTML = '';
      //map.setView(marker.getLatLng());
    });
    marker.on('click', function() {
      const markerLatLng = marker.getLatLng();
      const offsetLatLng = L.latLng(markerLatLng.lat, markerLatLng.lng + 0.005); // offset 0.01 degree to the left
      map.setView(offsetLatLng, 16);
    });
    markers.addLayer(marker);
  }
};


export async function setFavRestaurant(restaurantId){
  const user = JSON.parse(localStorage.getItem('user'));
  user.favouriteRestaurant = restaurantId;

  const fetchOptions = {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({favouriteRestaurant: restaurantId}),
  };

  const response = await fetch('https://10.120.32.94/restaurant/api/v1/users', fetchOptions);
  const json = await response.json();
  console.log(json);

}

