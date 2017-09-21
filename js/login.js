const url = 'https://kuvafundb.herokuapp.com'

$(() => {
  authorizeUser()
  $('form.login').submit(logIn)
})

function authorizeUser() {
  var token = localStorage.getItem('token');
  if (token) {
    location.href = "./dashboard.html"
  }
}

function logIn(event) {
  event.preventDefault()
  const username = $('input[name=username').val()
  const password = $('input[name=password').val()
  const data = {
    username,
    password
  }
  console.log(data);
  $.post(`${url}/api/login`, data)
    .then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        localStorage.setItem('token', response.data)
        console.log(response.data);
        location.href = './dashboard.html';
      }
    })
}
