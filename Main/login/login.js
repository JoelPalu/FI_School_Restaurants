
let user = JSON.parse(sessionStorage.getItem('user'));
console.log(user);

const loginMain = document.getElementById('login_main');
const profile = document.getElementById('profile-box');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutButton = document.getElementById('log-out');
const loginText = document.getElementById('login-text');
const swithToReg = document.getElementById('log_reg_button');
const swithToLog = document.getElementById('log_log_button');
const loginBox = document.getElementById('login_box');
const registerBox = document.getElementById('register_box');


const showProfile = (logged) => {
  console.log(logged);
  // show/hide forms + cats
  loginMain.style.display = logged ? 'none' : 'flex';
  profile.style.display = logged ? 'flex' : 'none';
};


loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  // eslint-disable-next-line no-undef
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch( 'https://10.120.32.94/restaurant/api/v1/auth/login', fetchOptions);
  const json = await response.json();
  if (!json.user) {
    alert(json.error.message);
  } else {
    // save token and user
    localStorage.setItem('token', json.token);
    localStorage.setItem('user', JSON.stringify(json.data));
    user = JSON.parse(localStorage.getItem('user'));
    loginText.textContent = user.username;
    showProfile(true);
  }
});

registerForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  // eslint-disable-next-line no-undef
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch( 'https://10.120.32.94/restaurant/api/v1/users', fetchOptions);
  const json = await response.json();
  if (!json.user) {
    alert(json.error.message);
  } else {
    // save token and user
    localStorage.setItem('token', json.token);
    localStorage.setItem('user', JSON.stringify(json.data));
    user = JSON.parse(localStorage.getItem('user'));
    loginText.textContent = user.username;
    showProfile(true);
  }
});

// logout
logoutButton.addEventListener('click', async (evt) => {
  evt.preventDefault();
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('You have logged out');
    loginText.textContent = 'Login';
    showProfile(false);
  } catch (e) {
    console.log(e.message);
  }
});

swithToReg.addEventListener('click', async (evt) => {
  console.log('swithToReg clicked'); // Add this line
  evt.preventDefault();
  loginBox.style.display = 'none';
  registerBox.style.display = 'block';
});

swithToLog.addEventListener('click', async (evt) => {
  console.log('swithToLog clicked'); // Add this line
  evt.preventDefault();
  registerBox.style.display = 'none';
  loginBox.style.display = 'block';
});

async function generateProfile(user){
  const profileName = document.getElementById('profile-name');
  const prfileUsername = document.getElementById('profile-username');
  const profileEmail = document.getElementById('profile-email');
  profileName.value = user.name;
  prfileUsername.value = user.username;
  profileEmail.value = user.email;
};


// when page loaded
(async () => {
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
        showProfile(false);
      } else {
        const user = JSON.parse(localStorage.getItem('user'));
        loginText.textContent = user.username;
        await generateProfile(user);
        showProfile(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  } else {
    // when starting app and nothing in sessionStorage
    loginText.textContent = 'Login';
    showProfile(false);
  }
})();
