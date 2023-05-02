import express from "express";
import type { Request, Response } from "express";
import { DriversRow, OrdersRow } from "../model";
import { dbClient } from "../app";
import { logger } from "../utils/logger";
import { driverIsLoggedInApi } from "../utils/guard";
import { sendMessage, getTextMessageInput } from "./messageHelper";

export const driversMainRoutes = express.Router();

driversMainRoutes.get("/", driverIsLoggedInApi);
driversMainRoutes.get("/get-driver-info", driverIsLoggedInApi, getDriverInfo);
driversMainRoutes.get("/get-district", driverIsLoggedInApi, getDistricts);
driversMainRoutes.get("/get-orders", driverIsLoggedInApi, getAllOrders);
driversMainRoutes.get("/get-orders/:oid", driverIsLoggedInApi, getAcceptOrders);
driversMainRoutes.get("/driver-earns/:oid", driverIsLoggedInApi, driverEarns);
driversMainRoutes.get("/history/", driverIsLoggedInApi, getOrdersHistory);
driversMainRoutes.get("/history/:oid", driverIsLoggedInApi, getSingleHistory);
driversMainRoutes.get("/ongoing", driverIsLoggedInApi, getOngoingOrders);
driversMainRoutes.put("/cfm-orders/:oid", driverIsLoggedInApi, confirmAcceptOrder);
driversMainRoutes.put("/ongoing/:oid", driverIsLoggedInApi, driverDelivering);
driversMainRoutes.post("/msg/:oid", driverIsLoggedInApi, message);

async function getDriverInfo(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id!;

    const getDriverNameResult = await dbClient.query<DriversRow>(
      /*sql*/ `SELECT first_name FROM drivers WHERE id = $1`,
      [driversID]
    );
    console.log(getDriverNameResult);
    res.json(getDriverNameResult.rows[0]); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getDistricts(_req: Request, res: Response) {
  try {
    const getDistrictsResult = await dbClient.query<OrdersRow>(
      /*sql*/ `SELECT pick_up_district, deliver_district FROM orders WHERE orders_status = '訂單待接中'`
    );
    console.log(getDistrictsResult.rows);
    res.json(getDistrictsResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getAllOrders(_req: Request, res: Response) {
  try {
    const getAllOrdersResult =
      await dbClient.query<OrdersRow>(/*sql*/ `SELECT orders.id, pick_up_district, deliver_district, pick_up_date, pick_up_time, 
      json_agg(animals.animals_name) AS animals_name, 
      json_agg(order_animals.animals_amount) AS animals_amount, 
      orders_status 
      FROM orders 
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id WHERE orders.orders_status = '訂單待接中'
      GROUP BY orders.id, pick_up_district, deliver_district, pick_up_date, pick_up_time, orders_status ORDER BY pick_up_date DESC`);
    console.log(getAllOrdersResult.rows);
    res.json(getAllOrdersResult.rows);
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getAcceptOrders(req: Request, res: Response) {
  try {
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }
    const getAcceptOrdersResult = await dbClient.query<OrdersRow>(
      /*sql*/ `SELECT orders.id,
      CONCAT(users.title, ' ', users.first_name, ' ', users.last_name) AS user_full_name, 
      users.contact_num, 
      receiver_contact,
      CONCAT(pick_up_date, ' ', pick_up_time) AS pick_up_date_time, 
      CONCAT(pick_up_room, ' ', pick_up_floor, ' ', pick_up_building, ' ', pick_up_street, ' ', pick_up_district) AS pick_up_address, 
      CONCAT(deliver_room, ' ', deliver_floor, ' ', deliver_building, ' ', deliver_street, ' ', deliver_district) AS deliver_address, 
      json_agg(animals.animals_name) AS animals_name, 
      json_agg(order_animals.animals_amount) AS animals_amount, 
      remarks, orders_status 
      FROM orders 
      JOIN users ON orders.users_id = users.id
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id
      WHERE orders_status = '訂單待接中' AND orders.id = $1
      GROUP BY orders.id, user_full_name, receiver_contact, contact_num, pick_up_date_time, pick_up_address, deliver_address, remarks, orders_status
      `,
      [ordersId]
    );
    console.log(getAcceptOrdersResult.rows);
    res.json(getAcceptOrdersResult.rows[0]); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function driverEarns(req: Request, res: Response) {
  try {
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }
    const driverEarnsResult = await dbClient.query<OrdersRow>(
      /*sql*/ `SELECT distance_km, 
      max(distance_km * distance_price) AS distance_total_price, 
      json_agg(animals.animals_name) AS animals_name,
      json_agg(order_animals.animals_amount) AS animals_amount,
      SUM(order_animals.animals_history_price * order_animals.animals_amount) AS animals_total_price, 
      max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount) AS total_price,
      (max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount)) * 0.2 AS platform_fee,
      max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount) - ((max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount)) * 0.2) AS driver_earns
      FROM orders 
      JOIN users ON orders.users_id = users.id
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id
      WHERE orders_status = '訂單待接中' AND orders.id = $1
      GROUP BY distance_km`,
      [ordersId]
    );
    console.log(driverEarnsResult.rows);
    res.json(driverEarnsResult.rows[0]); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getOrdersHistory(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id!;

    const getAllHistoryResult = await dbClient.query<OrdersRow>(
      /*sql*/ `SELECT orders.id, reference_code, orders_status, 
      json_agg(animals.animals_name) AS animals_name, 
      json_agg(order_animals.animals_amount) AS animals_amount 
      FROM orders 
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id 
      WHERE orders.orders_status = '已完成' AND orders.drivers_id = $1
      GROUP BY orders.id, reference_code, orders_status`,
      [driversID]
    );

    console.log(getAllHistoryResult.rows);
    res.json(getAllHistoryResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getSingleHistory(req: Request, res: Response) {
  try {
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }

    const getSingleQuery = await dbClient.query<OrdersRow>(
      /*sql*/ `SELECT orders.id, reference_code, orders_status, 
      CONCAT(pick_up_date, ' ', pick_up_time) AS pick_up_date_time,CONCAT(pick_up_room, ' ', pick_up_floor, ' ', pick_up_building, ' ', pick_up_street, ' ', pick_up_district) AS pick_up_address,
      CONCAT(deliver_room, ' ', deliver_floor, ' ', deliver_building, ' ', deliver_street, ' ', deliver_district) AS deliver_address, 
      json_agg(animals.animals_name) AS animals_name, 
      json_agg(order_animals.animals_amount) AS animals_amount,
      remarks
      FROM orders 
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id 
      WHERE orders.orders_status = '已完成' AND orders_id = $1
      GROUP BY orders.id, pick_up_date_time, pick_up_address, deliver_address, remarks, orders_status`,
      [ordersId]
    );
    console.log(getSingleQuery.rows);
    res.json(getSingleQuery.rows[0]);
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getOngoingOrders(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id!;
    const getOngoingOrdersResult = await dbClient.query<OrdersRow>(
      /*sql*/ `SELECT orders.id, reference_code, 
      CONCAT(users.title, ' ', users.first_name, ' ', users.last_name) AS user_full_name, 
      users.contact_num, 
      CONCAT(pick_up_date, ' ', pick_up_time) AS pick_up_date_time, 
      CONCAT(pick_up_room, ' ', pick_up_floor, ' ', pick_up_building, ' ', pick_up_street, ' ', pick_up_district) AS pick_up_address, 
      CONCAT(deliver_room, ' ', deliver_floor, ' ', deliver_building, ' ', deliver_street, ' ', deliver_district) AS deliver_address, 
      json_agg(animals.animals_name) AS animals_name, 
      json_agg(order_animals.animals_amount) AS animals_amount, 
      remarks, orders_status
      FROM orders 
      JOIN users ON orders.users_id = users.id
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id
      WHERE (orders.orders_status = '司機已接單' OR orders.orders_status = '送貨中') AND drivers_id = $1
      GROUP BY orders.id, reference_code, user_full_name, contact_num, pick_up_date_time, pick_up_address, deliver_address, remarks, orders_status
      ORDER BY orders_status ASC`,
      [driversID]
    );
    console.log(getOngoingOrdersResult.rows);
    res.json(getOngoingOrdersResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function driverDelivering(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id!;
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }
    const driverDeliveringResult = await dbClient.query<OrdersRow>(
      /*sql*/ `UPDATE orders SET orders_status = '送貨中'
      WHERE (orders_status = '司機已接單' AND orders.id = $1 AND drivers_id = $2)
      `,
      [ordersId, driversID]
    );
    console.log(driverDeliveringResult.rows);
    res.json(driverDeliveringResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function confirmAcceptOrder(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id!;
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }
    const confirmAcceptOrderResult = await dbClient.query<OrdersRow>(
      /*sql*/ `UPDATE orders SET orders_status = '司機已接單', drivers_id = $1
      WHERE orders_status = '訂單待接中' AND orders.id = $2 
      `,
      [driversID, ordersId]
    );
    console.log(confirmAcceptOrderResult.rows);
    res.json(confirmAcceptOrderResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function message(req: express.Request, res: express.Response) {
  try {
    // const driversId = req.session.drivers_id;
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }

    const contact = await dbClient.query<OrdersRow>(
      /*SQL*/ `SELECT receiver_contact FROM orders WHERE orders.id = $1 `,
      [ordersId]
    );

    const name = await dbClient.query<OrdersRow>(/*SQL*/ `SELECT receiver_name FROM orders WHERE orders.id = $1 `, [
      ordersId,
    ]);

    const tokenResult = await dbClient.query<OrdersRow>(/*SQL*/ `SELECT token FROM orders WHERE orders.id = $1 `, [
      ordersId,
    ]);

    console.log("contact", contact);
    console.log("name", name);
    console.log("tokenResult", tokenResult);

    const receiverContact = contact.rows[0];
    const receiverName = name.rows[0];
    const token = tokenResult.rows[0];
    console.log("check receiver name ", receiverName);
    const data = getTextMessageInput(
      "852" + receiverContact.receiver_contact.toString(),
      `Hi ${receiverName.receiver_name}! Here is your receiver token: ${token.token}. Click the link http://localhost:8080/receivers.html to input your verification code. Have a great day!`
    );
    const resp = await sendMessage(data);
    console.log(resp.status);

    res.status(200).json({ message: "message sent!" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}
