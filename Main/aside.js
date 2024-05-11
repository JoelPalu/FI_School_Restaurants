const restaurantModal = (restaurant, menu) => {
  let menuHtml = '';
  try {
    if (menu.length === 0) {
      menuHtml += `<tr><td>No</td><td>menu</td><td>available</td></tr>`;
    } else {
      menu.sort((a, b) => a.date + b.date);
      menu.forEach((days) => {
        console.log('days', days);
        const {date, courses} = days;
        menuHtml += `<tr><th><br></th></tr>`;
        const today = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        let formattedToday = today.toLocaleDateString('en-GB', options);
        formattedToday = formattedToday.replace(',', '');
        console.log('formattedToday', formattedToday);
        if (date === formattedToday) {
          menuHtml += `<tr><th class="today">Today ${date}</th></tr>`;
        } else {
          menuHtml += `<tr><th>${date}</th></tr>`;
        }


        courses.forEach((course) => {
          const {name: name, price, diets} = course;
          menuHtml += `<tr><td>${name}</td><td>${price}</td><td>${diets}</td></tr>`;
        });
      });
    }
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
    const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${restaurant._id}/${lang}`);
    const data = await response.json();
    const menu = data.days;
    menu.sort((a, b) => a.date - b.date);

    console.log(menu);


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
    if (screen.width < 500) {
      daily.style.display = 'block';
      daily.style.width = '100%';
      map.style.width = '0';
    } else {
      daily.style.display = 'block';
      map.style.width = '70%';
      daily.style.width = '30%';
    }
  }
}
