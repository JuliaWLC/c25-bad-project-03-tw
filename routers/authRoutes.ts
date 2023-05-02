import express from "express";

export const authRoutes = express.Router();

authRoutes.get("/", loginUser);
authRoutes.get("/driver", loginDriver);

async function loginUser(req: express.Request, res: express.Response) {
  req.session["loginType"] = "user";
  res.redirect("/connect/google");
}
async function loginDriver(req: express.Request, res: express.Response) {
  req.session["loginType"] = "driver";
  res.redirect("/connect/google");
}
