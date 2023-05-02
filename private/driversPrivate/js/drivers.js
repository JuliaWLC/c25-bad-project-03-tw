window.onload = () => {
  // driver main page
  showDriverInfo();
  showCurrentDistrict();
  showAllOrders();
  driversLogout();
};

async function showDriverInfo() {
  console.log("driver info");
  const resp = await fetch("/driversMain/get-driver-info");
  const driverInfo = await resp.json();
  console.log("driver info", driverInfo);

  let htmlStr = `<i class="bi bi-person-circle"></i>
      <div class="driver-details">
        <p class="driver-name"><b>Hi, ${driverInfo.first_name}</b></p>
        <p class="role">司機</p>
      </div>`;

  document.querySelector(".driver-info").innerHTML = htmlStr;
}

async function showCurrentDistrict() {
  console.log("district");
  const resp = await fetch("/driversMain/get-district");
  const districts = await resp.json();
  console.log("district", districts);

  // arr.map to obtain objects values and turn to array
  const districtsArr = districts.map((item) => Object.values(item));
  console.log("districtsArr", districtsArr);
  // arr.flat -> [[_,_],[_,_]] -> [_,_,_,_]
  let flattedDistrictsArr = districtsArr.flat();
  console.log("flattedDistrictsArr", flattedDistrictsArr);
  // js set unique
  let uniqueDistrict = [...new Set(flattedDistrictsArr)];
  console.log("uniqueDistrict", uniqueDistrict);

  // Create an "option" node:
  // what is i?
  // how to put i into the loop
  // object{} vs array[] (for objKey in obj// for arrayValue of arr) <-- directly take value inside
  for (let i = 0; i < uniqueDistrict.length; i++) {
    const opt = document.createElement("option");
    opt.className = "each-district";
    opt.setAttribute("value", uniqueDistrict[i]);
    opt.innerText += uniqueDistrict[i];
    document.querySelector(".district-menu").appendChild(opt);
  }
}

async function showAllOrders(district) {
  console.log("all orders");
  const resp = await fetch("/driversMain/get-orders");
  const originalOrders = await resp.json();
  console.log("all orders", originalOrders);
  let allOrders = [];
  if (district !== undefined) {
    allOrders = originalOrders.filter(
      (order) =>
        order.pick_up_district === district ||
        order.deliver_district === district
    );
  } else {
    allOrders = originalOrders;
  }
  console.log("selected orders: ", allOrders);

  let htmlStr = "";
  for (let i = 0; i < allOrders.length; i++) {
    console.log("update UI");
    console.log(allOrders[i]);
    let animalDetails = ``;
    if (Array.isArray(allOrders[i].animals_name)) {
      for (let j = 0; j < allOrders[i].animals_name.length; j++) {
        animalDetails +=
          allOrders[i].animals_name[j] +
          " X " +
          allOrders[i].animals_amount[j] +
          " ";
      }
    } else {
      animalDetails +=
        allOrders[i].animals_name + " X " + allOrders[i].animals_amount + " ";
    }
    const acceptBtn = `<button class="accept-order" onClick="acceptOrdersDetail(${allOrders[i].id})">接單</button>`;
    const dateStr = new Date(allOrders[i].pick_up_date).toDateString();
    htmlStr += `
      <div class="single_order">
        <div>
          <p class="order-text">FROM</p>
          <div class="pick_up_district_time">
            <div class="pick_up_district">${allOrders[i].pick_up_district}</div>
            <div class="pick_up_time">${dateStr} ${allOrders[i].pick_up_time}</div>
          </div>
          <p class="order-text">TO</p>
          <div class="deli_district_animal">
            <div class="deli_district">${allOrders[i].deliver_district}</div>
            <div class="animal">${animalDetails}</div>
          </div>
        </div>
        ${acceptBtn}
      </div>
      `;
  }
  document.querySelector("#all_orders").innerHTML = htmlStr;
}

async function showSelectedOrders() {
  console.log("showSelectedOrders");
  const district = document.querySelector(".district-menu").value;
  // const pickUpDistrict = document.querySelector(".pick_up_district");
  // const deliverDistrict = document.querySelector(".deli_district");
  // if (
  //   district.innerHTML == pickUpDistrict.innerHTML ||
  //   district.innerHTML == deliverDistrict.innerHTML
  // ) {
  showAllOrders(district);
  // }
}

async function acceptOrdersDetail(id) {
  window.location = `/driversAcceptOrder.html?oid=${id}`;
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
