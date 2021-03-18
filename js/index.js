"use strict";

const messageSystem = {
  startFetching() {
    setInterval(this.fetchMessages, 1000);
  },

  sendMessage(msg) {
    fetch(`https://thecrew.cc/api/message/create.php?token=${userSystem.token}`, {
      method: 'POST',
      body: JSON.stringify({
          message: msg
      })
    })
    .then(response =>{
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
  },
  fetchMessages() {
    fetch(`https://thecrew.cc/api/message/read.php?token=${userSystem.token}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const output = document.getElementById('output');
        output.innerHTML = '';
        data.forEach(message =>{
          let htmlString = `
          <div class="message">
            <span class="by">${message.handle}</span>
            <span class="on">${message.created_at}</span>
            <p>${message.message}</p>
        </div>`;
  
        const output = document.getElementById('output');
        output.insertAdjacentHTML('beforeend', htmlString);
        })
      })

    console.log("fetch");
  }
};

const userSystem = {
  token: "",
  loggedIn: false,

  saveToken() {
    localStorage.setItem("token", this.token);
    console.log(localStorage);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  logout() {
    localStorage.removeItem("token");
  },

  login(email, password) {
    fetch("https://thecrew.cc/api/user/login.php", {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        userSystem.token = data.token;
        this.saveToken();

        display.render();
      })
  },

  updateUser(password, handle) {
    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
  }
};

const display = {
  initFields() {
    let form = document.getElementById('loginForm')
    form.addEventListener('submit', this.submitHandler1);

    let sendForm = document.getElementById('messageForm');
    sendForm.addEventListener('submit', this.submitHandler2)
  },
  submitHandler1(e) {
    e.preventDefault();
    const inputEmail = document.getElementById('emailField');
    const email = inputEmail.value;
    const inputPassword = document.getElementById('passwordField');
    const password = inputPassword.value;

    userSystem.login(email, password);
  },
  submitHandler2(e){
    e.preventDefault();
    const input = document.getElementById('messageField');
    const text = input.value;
    console.log(text);
    messageSystem.sendMessage(text);
  },
  render() {
    console.log("render");

    if (userSystem.getToken()) {
      userSystem.token = userSystem.getToken();
      document.getElementById("loginWindow").style.display = "none";
      messageSystem.startFetching();
    } else {
      console.log('Not logged in!');
    }
  }

};
display.render();
display.initFields();