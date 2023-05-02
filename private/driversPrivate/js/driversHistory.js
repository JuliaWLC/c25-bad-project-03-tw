window.onload = async () => {
  showHistoryOrder();
  driversLogout();
};

async function showHistoryOrder() {
  console.log("History orders");
  const resp = await fetch(`/driversMain/history/`);
  const historyOrder = await resp.json();
  console.log("History orders", historyOrder);

  for (let i = 0; i < historyOrder.length; i++) {
    let animalDetails = ``;
    if (Array.isArray(historyOrder[i].animals_amount)) {
      for (let j = 0; j < historyOrder[i].animals_amount.length; j++) {
        animalDetails +=
          historyOrder[i].animals_name[j] +
          " X " +
          historyOrder[i].animals_amount[j] +
          " ";
      }
    } else {
      animalDetails +=
      historyOrder[i].animals_name + " X " + historyOrder[i].animals_amount + " ";
    }
    // if (historyOrder.orders_status === "driver accepts") {
    // }
    let htmlStr = `
      <div class="confirm_order_text">
      <p><b>訂單號碼：#${historyOrder[i].reference_code}</b></p>
      <p>訂單狀態：${historyOrder[i].orders_status}</p>
      <p>動物：${animalDetails} </p>
      <div class="btn-div"><button class="history-details" onClick="toSingleHistory(${historyOrder[i].id})">查看更多</button></div>
      </div>
  `;
    document.querySelector(".history_each").innerHTML += htmlStr;
  }
  
}

async function toSingleHistory(id) {
  window.location = `/driversSingleHistory.html?oid=${id}`;
}

async function driversLogout() {
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await fetch(`/logout/drivers`);
    if (resp.status === 200) {
      window.location = "/driversLogin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}