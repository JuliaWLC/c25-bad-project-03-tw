import type { Request, Response, NextFunction } from "express";

export const userIsLoggedInApi = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.users_id) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const driverIsLoggedInApi = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.drivers_id) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const guardUsersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userIsLoggedIn) next();
  else res.redirect("/usersLogin.html");
};

export const guardDriversMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.driverIsLoggedIn) next();
  else res.redirect("/driversLogin.html");
};
