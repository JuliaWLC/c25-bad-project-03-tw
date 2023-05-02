// 未付款
window.onload = () => {
  loadOrderToPay();
  confirmToPay();
  usersLogout();
};

async function loadOrderToPay() {
  const resp = await fetch("/users/payorder");
  const data = await resp.json();

  console.log("here is payorder", data);

  let animalDetails = ``;
  if (Array.isArray(data.animals_name)) {
    for (let i = 0; i < data.animals_name.length; i++) {
      animalDetails += data.animals_name[i] + " X " + data.animals_amount[i] + " ";
    }
  } else {
    animalDetails += data.animals_name + " X " + data.animals_amount + " ";
  }

  //確認你的訂單
  const htmlstr1 = `
  <p>Order Number : <span id='order-id'>${data.id}</span></p>
  <p>收貨時間 : ${data.pick_up_date_time}</p>
  <p>收貨地址 : ${data.pick_up_address}</p>
  <p>送貨地址 : ${data.deliver_address}</p>
  <p>動物 : ${animalDetails}</p>
  <p>備註: ${data.remarks}</p>
  `;

  //訂單總價
  const htmlstr2 = `
  <p>距離 : ${data.distance_km}km - HK$${data.distance_total_price} </p>
  <p>動物 : ${animalDetails}</p> 
  <p>動物總價 : HK$${data.animals_total_price}</p>
  <p>合共價格 : HK$${data.total_price}</p>
  `;

  document.querySelector(".confirm-order").innerHTML = htmlstr1;
  document.querySelector(".total-price").innerHTML = htmlstr2;
}

async function confirmToPay() {
  document.querySelector(".pay-btn").addEventListener("click", async () => {
    const orderId = document.querySelector("#order-id").innerText;
    console.log("orderId: ", orderId);
    ////err:fetch but status not change????
    const resp = await fetch("/users/confirm", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: orderId }),
    });

    if (resp.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Submitted",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        window.location = "/allorderstatus.html";
      }, 1501);
    }
  });
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
