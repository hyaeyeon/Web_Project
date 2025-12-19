const USER_KEY = "major_helper_users";
const LOGIN_KEY = "major_helper_login";


function login(){
  const email = document.getElementById("loginEmail").value.trim();
  const pw = document.getElementById("loginPassword").value;

  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === pw);

  if(!user){
    alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    return;
  }

  localStorage.setItem(LOGIN_KEY, JSON.stringify(user));
  location.href = "index.html";
}

function logout(){
  localStorage.removeItem(LOGIN_KEY);
  location.reload();
}

function getLoginUser(){
  return JSON.parse(localStorage.getItem(LOGIN_KEY));
}
