// 你的司機資訊及位置 未完作成訂單
window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }

  const resp = await fetch(`/users/orderstatus/${urlSearchParams.get("oid")}`);
  const orderDetails = await resp.json();
  console.log(orderDetails);

  const htmlstr = `
  <p>司機姓名 : ${orderDetails.full_name}</p>
  <p>司機聯絡電話: ${orderDetails.contact_num}</p>
  <p>司機車牌: ${orderDetails.car_license_num}</p>
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
