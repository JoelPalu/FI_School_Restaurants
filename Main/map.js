import {getMenu} from './aside.js';

export function mapRestaurants(restaurants) {
  navigator.geolocation.getCurrentPosition(success);

  const customIcon = L.icon({
    iconUrl: 'marker-icon-2x.png', // replace with the path to your icon image
    iconSize: [28, 45], // size of the icon
    iconAnchor: [19, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -25], // point from which the popup should open relative to the iconAnchor
  });

  async function success(position) {
    const userLocation = {
      x: position.coords.latitude,
      y: position.coords.longitude,
    };
    const map = L.map('map').setView([userLocation.x, userLocation.y], 13);
    L.marker([userLocation.x, userLocation.y], {icon: customIcon}).addTo(map).bindPopup('You are here');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    setRestaurants(restaurants, map);
  }

  function setRestaurants(restaurants, map) {
    restaurants.forEach((restaurant) => {
      const marker = L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]]).addTo(map);
      marker.bindPopup(`<h3>${restaurant.name}</h3><p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>`);

      marker.on('popupopen', function() {
        getMenu(restaurant, 'en');
      });
      map.on('popupclose', function() {
        const aside = document.getElementById('Daily');
        aside.innerHTML = '';
        //map.setView(marker.getLatLng());
      });
      marker.on('click', function() {
        const markerLatLng = marker.getLatLng();
        const offsetLatLng = L.latLng(markerLatLng.lat, markerLatLng.lng + 0.04); // offset 0.01 degree to the left
        map.setView(offsetLatLng);
      });
    });
  }
}
