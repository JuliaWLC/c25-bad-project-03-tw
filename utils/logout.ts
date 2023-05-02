import express from "express";

export const logoutRoutes = express.Router();

logoutRoutes.get("/users", usersLogout);
logoutRoutes.get("/drivers", driversLogout);

export async function usersLogout(req: express.Request, res: express.Response) {
  if (req.session) {
    delete req.session.users_id;
    delete req.session.userIsLoggedIn;
  }
  res.status(200).json({ message: "Done!" });
}

export async function driversLogout(req: express.Request, res: express.Response) {
  if (req.session) {
    delete req.session.drivers_id;
    delete req.session.driverIsLoggedIn;
  }
  res.status(200).json({ message: "Done!" });
}



// await fetch(`/logout/users`, { method: "GET" });
// await fetch(`/logout/drivers`, { method: "GET" });

// window.onload = () => {
//   usersLogout();
// };

// async function usersLogout() {
//   const logout = document.querySelector("#logout");
//   logout.addEventListener("click", async (e) => {
//     e.preventDefault();
//     const resp = await fetch(`/logout/users`);
//     if (resp.status === 200) {
//       window.location = "/usersLogin.html";
//     } else {
//       const data = await resp.json();
//       alert(data.message);
//     }
//   });
// }

// window.onload = () => {
//   driversLogout();
// };

// async function driversLogout() {
//   const logout = document.querySelector("#logout");
//   logout.addEventListener("click", async (e) => {
//     e.preventDefault();
//     const resp = await fetch(`/logout/drives`);
//     if (resp.status === 200) {
//       window.location = "/driversLogin.html";
//     } else {
//       const data = await resp.json();
//       alert(data.message);
//     }
//   });
// }





