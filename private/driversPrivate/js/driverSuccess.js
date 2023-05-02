window.onload = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("oid")) {
    window.location = "/";
    return;
  }
  driversLogout();
};

document.querySelector(".return-btn").addEventListener("click", () => {
  window.location = "/driversOngoing.html";
});

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