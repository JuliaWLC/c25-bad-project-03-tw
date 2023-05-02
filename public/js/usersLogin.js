window.onload = () => {
    initUsersLoginForm();
}

const member_create = document.querySelector("#member_create");

function initUsersLoginForm() {
  const form = document.querySelector("#users-login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usersEmail = form.usersEmail.value;
    const password = form.password.value;
    const resp = await fetch("/usersLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usersEmail, password }),
    });

    if (resp.status === 200) {
      alert("Login succuss!");
      window.location = "/private/usersPrivate/usersMain.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
};

member_create.addEventListener("click", function () {
  window.location = "/usersNewAccount.html";
});

