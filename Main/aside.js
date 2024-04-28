const restaurantModal = (restaurant, menu) => {
  let menuHtml = '';
  try {
    menu.forEach((course) => {
      const {name: courseName, price, diets} = course;
      menuHtml += `<tr><td>${courseName}</td><td>${price}</td><td>${diets}</td></tr>`;
    });
  } catch (error) {
    console.log(error);
    menuHtml += `<tr><td>Failed</td><td>to load</td><td>menu</td></tr>`;
  }
  const htmlContent = `
    <a></a>
    <h2>${restaurant.name}</h2>
    <p>${restaurant.address}</p>
    <p>${restaurant.postalCode} ${restaurant.city}</p>
    <p>${restaurant.phone}</p>
    <p>${restaurant.company}</p>
    <table>${menuHtml}</table>
  `;
  return htmlContent;
};

export async function getMenu(restaurant, lang) {
  const aside = document.getElementById('Daily');
  const asideBlock = document.createElement('div');


  try {
    const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${restaurant._id}/${lang}`);
    const data = await response.json();
    const menu = data['courses'];

    asideBlock.innerHTML += restaurantModal(restaurant, menu);
    aside.appendChild(asideBlock);
  } catch (error) {
    console.error(error);
  }
}

// Adjust the layout of the map and the daily menu when marker is clicked
export function adjustLayout() {
  const map = document.getElementById('map-box');
  const daily = document.getElementById('Daily');

  if (daily.innerHTML.trim() === '') {
    map.style.width = '100%';
    daily.style.width = '0';
    daily.style.display = 'flex';
  } else {
    daily.style.display = 'block';
    map.style.width = '70%';
    daily.style.width = '30%';
  }
}

