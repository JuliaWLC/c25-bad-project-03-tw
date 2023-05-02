// 所有未完成訂單
window.onload = () => {
  allOrderStatus();
  usersLogout();
};

async function allOrderStatus() {
  const resp = await fetch("/users/orderstatus");
  const notFinish = await resp.json();
  console.log("haven't finish order", notFinish);
  //big container
  const orderContainer = document.querySelector(".all-order-status");
  //title
  const title = document.createElement("div");
  title.textContent = `實時訂單狀態`;
  title.className = "ongoing-title"
  orderContainer.appendChild(title);
  //iterate orders haven't complete
  for (const order of notFinish) {
    const orderCode = document.createElement("p");
    const createTime = document.createElement("p");
    const pickUpDateTime = document.createElement("p");
    const pickUpAddress = document.createElement("p");
    const deliverAddress = document.createElement("p");
    const animals = document.createElement("p");
    const remarks = document.createElement("p");
    // 訂單狀態 :
    const orderStatusTitle = document.createElement("p");
    orderStatusTitle.className = "order-status-title";
    const orderStatusDiv = document.createElement("div");
    const orderStatus = document.createElement("div");

    //row1
    const statusRow1 = document.createElement("div");
    statusRow1.className = "status-row";
    const circle1 = document.createElement("i");
    circle1.setAttribute("class", "fa-sharp fa-solid fa-circle");
    circle1.style.color = "rgb(255, 227, 155)";
    const arrowDiv1 = document.createElement("div");
    arrowDiv1.className = "arrow-div";
    const arrow1 = document.createElement("i");
    arrow1.setAttribute("class", "bi bi-arrow-down");
    const pending = document.createElement("p");
    //row1 append child
    statusRow1.appendChild(circle1);
    arrowDiv1.appendChild(arrow1);
    statusRow1.appendChild(pending);
    //row2
    const statusRow2 = document.createElement("div");
    statusRow2.className = "status-row";
    const circle2 = document.createElement("i");
    circle2.setAttribute("class", "fa-sharp fa-solid fa-circle");
    circle2.style.color = "rgb(255, 227, 155)";
    const arrowDiv2 = document.createElement("div");
    arrowDiv2.className = "arrow-div";
    const arrow2 = document.createElement("i");
    arrow2.setAttribute("class", "bi bi-arrow-down");
    const driverAccepts = document.createElement("p");
    //row2 append child
    statusRow2.appendChild(circle2);
    arrowDiv2.appendChild(arrow2);
    statusRow2.appendChild(driverAccepts);

    //row3
    const statusRow3 = document.createElement("div");
    statusRow3.className = "status-row";
    const circle3 = document.createElement("i");
    circle3.setAttribute("class", "fa-sharp fa-solid fa-circle");
    circle3.style.color = "rgb(255, 227, 155)";
    //arrow
    const arrowDiv3 = document.createElement("div");
    arrowDiv3.className = "arrow-div";
    const arrow3 = document.createElement("i");
    arrow3.setAttribute("class", "bi bi-arrow-down");
    const driverDelivering = document.createElement("p");
    //row3 append child
    statusRow3.appendChild(circle3);
    arrowDiv3.appendChild(arrow3);
    statusRow3.appendChild(driverDelivering);

    //row4
    const statusRow4 = document.createElement("div");
    statusRow4.className = "status-row";
    const circle4 = document.createElement("i");
    circle4.setAttribute("class", "fa-sharp fa-solid fa-circle");
    circle4.style.color = "rgb(255, 227, 155)";
    const receiverReceived = document.createElement("p");
    //row4 append child
    statusRow4.appendChild(circle4);
    statusRow4.appendChild(receiverReceived);

    //button for more details
    const detailsBtn = document.createElement("button");
    const cancelOrderBtn = document.createElement("button");
    //text content
    orderCode.textContent = `訂單號碼 : ${order.reference_code}`;
    createTime.textContent = `訂單建立時間 : ${order.created_at}`;
    pickUpDateTime.textContent = `預計收貨時間 : ${order.pick_up_date_time}`;
    pickUpAddress.textContent = `收貨地址 : ${order.pick_up_address}`;
    deliverAddress.textContent = `送貨地址 : ${order.deliver_address}`;
    //for loop animals
    let animalDetails = ``;
    if (Array.isArray(order.animals_name)) {
      for (let i = 0; i < order.animals_name.length; i++) {
        animalDetails += order.animals_name[i] + " X " + order.animals_amount[i] + " ";
      }
    } else {
      animalDetails += order.animals_name + " X " + order.animals_amount + " ";
    }
    animals.textContent = `動物 : ${animalDetails}`;
    remarks.textContent = `備註 : ${order.remarks}`;
    orderStatusTitle.textContent = `訂單狀態 : `;
    // 訂單狀態 :
    pending.textContent = `正在等待司機接單`;
    driverAccepts.textContent = `司機正在前往接貨`;
    driverDelivering.textContent = `司機正前往送貨`;
    receiverReceived.textContent = `客人已收貨`;
    //button
    detailsBtn.textContent = `查看你的司機資訊及位置`;
    cancelOrderBtn.textContent = `取消訂單`;

    //each order
    const orderDiv = document.createElement("div");
    const orderTextDiv = document.createElement("div");
    orderTextDiv.className = "order-text";
    orderDiv.className = "each-order";
    orderStatusDiv.className = "order-status-div";
    orderStatus.className = "order-status";
    pending.className = "pending";
    driverAccepts.className = "driver-accepts";
    driverDelivering.className = "driver-delivering";
    receiverReceived.className = "receiver-received";
    //btn class
    const btnDiv = document.createElement("div");
    btnDiv.className = "btn-div";
    detailsBtn.className = "details-btn";
    cancelOrderBtn.className = "cancel-btn";

    //change status color
    if (order.orders_status === "訂單待接中") {
      circle1.style.color = "rgb(255, 157, 29)";
      pending.style.color = "rgb(255, 157, 29)";
    } else if (order.orders_status === "司機已接單") {
      circle2.style.color = "rgb(255, 157, 29)";
      driverAccepts.style.color = "rgb(255, 157, 29)";
    } else if (order.orders_status === "送貨中") {
      circle3.style.color = "rgb(255, 157, 29)";
      driverDelivering.style.color = "rgb(255, 157, 29)";
    } else if (order.orders_status === "已完成") {
      circle4.style.color = "rgb(255, 157, 29)";
      receiverReceived.style.color = "rgb(255, 157, 29)";
    }

    orderStatus.appendChild(statusRow1);
    orderStatus.appendChild(arrowDiv1);
    orderStatus.appendChild(statusRow2);
    orderStatus.appendChild(arrowDiv2);
    orderStatus.appendChild(statusRow3);
    orderStatus.appendChild(arrowDiv3);
    orderStatus.appendChild(statusRow4);
    orderStatusDiv.appendChild(orderStatus);
    orderTextDiv.appendChild(orderCode);
    orderTextDiv.appendChild(createTime);
    orderTextDiv.appendChild(pickUpDateTime);
    orderTextDiv.appendChild(pickUpAddress);
    orderTextDiv.appendChild(deliverAddress);
    orderTextDiv.appendChild(animals);
    orderTextDiv.appendChild(remarks);
    orderTextDiv.appendChild(orderStatusTitle);
    orderDiv.appendChild(orderTextDiv);
    orderDiv.appendChild(orderStatusDiv);
    orderDiv.appendChild(btnDiv);
    //btn if there is drivers_id
    if (order.drivers_id == undefined) {
    } else {
      btnDiv.appendChild(detailsBtn);
    }
    btnDiv.appendChild(cancelOrderBtn);

    detailsBtn.addEventListener("click", () => {
      window.location = `/ongoingdt.html?oid=${order.id}`;
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
