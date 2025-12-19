const USER_KEY = "major_helper_users";
const LOGIN_KEY = "major_helper_login";

function loadUsers(){
  return JSON.parse(localStorage.getItem(USER_KEY) || "[]");
}

function saveUsers(users){
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

function signup(){
  const email = document.getElementById("signupEmail").value.trim();
  const pw = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if(!email || !pw){
    alert("모든 항목을 입력하세요.");
    return;
  }

  if(pw !== confirm){
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const users = loadUsers();

  if(users.find(u => u.email === email)){
    alert("이미 가입된 이메일입니다.");
    return;
  }

  users.push({ email, password: pw });
  saveUsers(users);

  alert("회원가입 완료! 로그인해주세요.");
  location.href = "login.html";
}
