// 己完成訂單詳細資料
window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }

  const resp = await fetch(`/users/history/${urlSearchParams.get("oid")}`);
  const historyOrderDetails = await resp.json();
  console.log("fetch order details", historyOrderDetails);

  let animalDetails = ``;
  if (Array.isArray(historyOrderDetails.animals_name)) {
    for (let i = 0; i < historyOrderDetails.animals_name.length; i++) {
      animalDetails += historyOrderDetails.animals_name[i] + " X " + historyOrderDetails.animals_amount[i] + " ";
    }
  } else {
    animalDetails += historyOrderDetails.animals_name + " X " + historyOrderDetails.animals_amount + " ";
  }

  const htmlstr = `
  <p><b>訂單號碼 : ${historyOrderDetails.reference_code}</b></p>
  <p>訂單狀態 : 已完成</p>
  <p>收貨時間 : ${historyOrderDetails.pick_up_date_time}</p>
  <p>收貨地址 : ${historyOrderDetails.pick_up_address}</p>
  <p>送貨地址 : ${historyOrderDetails.deliver_address}</p>
  <p>備註 : ${historyOrderDetails.remarks}</p>
  `;
  document.querySelector(".order-details").innerHTML = htmlstr;

  usersLogout();
};

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
