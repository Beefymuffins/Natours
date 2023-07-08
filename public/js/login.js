/* eslint-disable */

/**
 * ******* API CALLS ******* 
 * Has to use http://localhost:3000/
 * 
 * http://127.0.0.1:3000 WILL NOT WORK. CORS
 */

const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      withCredentials: true,
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log('res', res);
  } catch (error) {
    console.log(error.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
