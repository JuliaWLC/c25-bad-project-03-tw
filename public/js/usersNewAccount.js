// const { body } = require("express-validator");

window.onload = () => {
  createUsers();
};

function createUsers() {
  const form = document.querySelector("#create-users");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const lastName = form.newUserLastName.value;
    const firstName = form.newUserFirstName.value;
    const title = form.newUserTitle.value;
    const email = form.newUserEmail.value;
    const password = form.newUserPassword.value;
    const contactNum = form.newUserContactNum.value;
    const defaultDistrict = form.newUserDefaultDistrict.value;
    const pickUpRoom = form.pickUpRoom.value;
    const pickUpFloor = form.pickUpFloor.value;
    const pickUpBuilding = form.pickUpBuilding.value;
    const pickUpStreet = form.pickUpStreet.value;

    const resp = await fetch("/userslogin/createAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastName,
        firstName,
        title,
        email,
        password,
        contactNum,
        defaultDistrict,
        pickUpRoom,
        pickUpFloor,
        pickUpBuilding,
        pickUpStreet,
      }),
    });
    if (resp.status === 200) {
      alert("登記成功!");
      window.location = "/usersLogin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}

// const userForm = e.target;
// const formData = new FormData(userForm);

// const resp = await fetch("/usersLogin/createAccount", {
//   method: "POST",
//   headers: { "Content-Type": "application/x-www-form-urlencoded" },
//   body: formData,
