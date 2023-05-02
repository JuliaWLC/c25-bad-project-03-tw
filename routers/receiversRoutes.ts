import express from "express";
import dotenv from "dotenv";
import { dbClient } from "../app";
// import { sendMessage, getTextMessageInput } from "./messageHelper";
import { OrdersRow } from "../model";
import { logger } from "../utils/logger";
dotenv.config();

export const receiverRoutes = express.Router();
// receiverRoutes.post("/", message);
receiverRoutes.post("/token", checkToken);

// async function message(req: express.Request, res: express.Response) {
//   try {
//     const driversId = req.session.drivers_id;

//     const contact = await dbClient.query<OrdersRow>(
//       /*SQL*/ `SELECT receiver_contact FROM orders WHERE drivers_id = $1 `,
//       [driversId]
//     );

//     const name = await dbClient.query<OrdersRow>(
//       /*SQL*/ `SELECT receiver_name FROM orders WHERE drivers_id = $1 `,
//       [driversId]
//     );

//      const tokenResult = await dbClient.query<OrdersRow>(
//        /*SQL*/ `SELECT token FROM orders WHERE drivers_id = $1 `,
//        [driversId]
//      );
    
//     console.log("contact",contact);
//     console.log("name",name);
//     console.log("tokenResult",tokenResult);
    
//     const receiverContact = contact.rows[0];
//     const receiverName = name.rows[0];
//     const token = tokenResult.rows[0];

//     const data = getTextMessageInput(
//       "852" + receiverContact.receiver_contact.toString(),
//       `Hi ${JSON.stringify(
//         Object.values(receiverName)
//       )}! Here is your receiver token: ${JSON.stringify(
//         Object.values(token)
//       )}. Click the link http://localhost:8080/receivers.html to input your verification code. Have a great day!`
//     );
//     const resp = await sendMessage(data);
//     console.log(resp.status);
    
//     res.status(200).json({ message: "message sent!" });
//   } catch (err: any) {
//     console.error(err.message);
//     res.status(500).json({ message: "internal server error" });
//   }
// }

async function checkToken(req: express.Request, res: express.Response) {
  try {
    const token: string = req.body.token;

    const queryResult = await dbClient.query<OrdersRow>(
      /*SQL*/ `SELECT id, token FROM orders WHERE token = $1`,
      [token]
    );
    const foundToken = queryResult.rows[0];

    if (!token) {
      res.status(400).json({ message: "missing token!" });
      return;
    }
    if (!foundToken) {
      res.status(400).json({ message: "invalid token! " });
      return;
    } else {
      await dbClient.query<OrdersRow>(
        /*SQL*/ `UPDATE orders SET orders_status = '已完成' WHERE token = $1 `,
        [token]
      );

      res.status(200).json({ message: "successful!" });
    }
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}
