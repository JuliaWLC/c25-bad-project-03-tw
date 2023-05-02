// 己完成訂單
window.onload = () => {
  loadCompleteOrder();
  usersLogout();
};

async function loadCompleteOrder() {
  const resp = await fetch("/users/history");
  const complete = await resp.json();
  console.log("complete orders", complete);
  //  big container
  const orderContainer = document.querySelector(".all-complete-order");
  //   title
  const title = document.createElement("h3");
  title.innerText = `歷史訂單`;
  orderContainer.appendChild(title);
  //iterate orders complete
  for (const order of complete) {
    //create element
    const referenceCode = document.createElement("p");
    referenceCode.style = "font-weight: bold"
    const orderStatus = document.createElement("p");
    const animals = document.createElement("p");
    console.log(order.orders_status);
    //text content
    referenceCode.textContent = `訂單號碼 : ${order.reference_code}`;
    orderStatus.textContent = `訂單狀態 : 已完成`;

    let animalDetails = ``;
    if (Array.isArray(order.animals_name)) {
      for (let i = 0; i < order.animals_name.length; i++) {
        animalDetails += order.animals_name[i] + " X " + order.animals_amount[i] + " ";
      }
    } else {
      animalDetails += order.animals_name + " X " + order.animals_amount + " ";
    }
    animals.textContent = `動物 : ${animalDetails}`;

    //each order
    const orderDiv = document.createElement("div");
    orderDiv.className = "each-order";
    const orderDetailsDiv = document.createElement("div");
    orderDetailsDiv.className = "order-details";
    //button for more details
    const detailsBtn = document.createElement("button");
    detailsBtn.textContent = `查看更多`;
    detailsBtn.className = "detail-btn";
    const btnDiv = document.createElement("div");
    btnDiv.className = "btn-div";
    btnDiv.appendChild(detailsBtn);
    orderDetailsDiv.appendChild(referenceCode);
    orderDetailsDiv.appendChild(orderStatus);
    orderDetailsDiv.appendChild(animals);
    orderDiv.appendChild(orderDetailsDiv);
    orderDiv.appendChild(btnDiv);
    detailsBtn.addEventListener("click", () => {
      window.location = `/historydt.html?oid=${order.id}`;
    });
    orderContainer.appendChild(orderDiv);
  }
}

async function usersLogout() {
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await fetch(`/logout/users`);
    if (resp.status === 200) {
      window.location = "/usersLogin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}
