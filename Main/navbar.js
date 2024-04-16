async function generateNavbar() {
  const header = document.getElementById('header');
  // Create h1 element
  const h1 = document.createElement('h1');
  h1.textContent = 'Finnish School Restaurants';

  // Create nav element
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Create anchor elements
  const home = document.createElement('a');
  home.href = '../html.html';
  home.textContent = 'Home';

  const about = document.createElement('a');
  about.href = '';
  about.textContent = 'About';

  const contact = document.createElement('a');
  contact.href = '';
  contact.textContent = 'Contact';

  // Create div element for profile box
  const profileBox = document.createElement('div');
  profileBox.id = 'nav-profile-box';

// Create div element for avatar box
  const avatarBox = document.createElement('div');
  avatarBox.id = 'nav-profile-box-avatar';

// Create img element for avatar
  const avatar = document.createElement('img');
  avatar.src = '';
  avatar.alt = 'user';
  avatar.id = 'avatar';

// Append avatar to avatar box
  avatarBox.appendChild(avatar);

// Create div element for link box
  const linkBox = document.createElement('div');
  linkBox.id = 'nav-profile-box-link';

// Create anchor element for login
  const login = document.createElement('a');
  login.href = '/FI_School_Restaurants/Main/login/login.html';
  login.id = 'login-text';
  login.textContent = 'Login';


  // Append anchor elements to nav
  nav.appendChild(home);
  nav.appendChild(about);
  nav.appendChild(contact);
  nav.appendChild(login);

  // Append login to link box
  linkBox.appendChild(login);

  // Append avatar box and link box to profile box
  profileBox.appendChild(avatarBox);
  profileBox.appendChild(linkBox);

  // Append profile box to nav or any other parent element
  nav.appendChild(profileBox);


  // Append h1 and nav to the body or any other parent element
  header.appendChild(h1);
  header.appendChild(nav);
}

export {generateNavbar};
