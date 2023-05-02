import fs from "fs";
import path from "path";
import { dbClient } from "../app";

const orders = fs.readFileSync(path.join(__dirname, "orders.csv"));
console.log('orders', orders);
let ordersStr = orders.toString();
console.log('ordersStr', ordersStr);
let ordersArray = ordersStr.replace(/(?:\\[rn]|[\r]+)+/g, "").split("\n");
console.log('ordersArray', ordersArray);

// const animals = fs.readFileSync(path.join(__dirname, "animals.csv"));
// let animalsStr = animals.toString();
// let animalsArray = animalsStr.replace(/(?:\\[rn]|[\r]+)+/g, "").split("\n");

// const orderAnimals = fs.readFileSync(path.join(__dirname, "animals.csv"));
// let orderAnimalsStr = orderAnimals.toString();
// let orderAnimalsArray = orderAnimalsStr.replace(/(?:\\[rn]|[\r]+)+/g, "").split("\n");

export async function insertDB() {
  // await dbClient.query(/*SQL*/ `DELETE FROM orders`);
  for (let i = 1; i < ordersArray.length; i++) {
    // const elem = dataArray[i].split(',')
    // console.log(elem)
    await dbClient.query(/*SQL*/
      `INSERT INTO orders (pick_up_date,
                pick_up_time,
                pick_up_district,
                pick_up_room,
                pick_up_floor,
                pick_up_building,
                pick_up_street,
                deliver_district,
                deliver_room,
                deliver_floor,
                deliver_building,
                deliver_street,
                users_id,
                drivers_id,
                receiver_name,
                receiver_contact,
                distance_km,
                distance_price,
                reference_code,
                orders_status,
                token,
                remarks,
                created_at)
            values
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19,
            $20, $21, $22, $23 )`,
        ordersArray[i].split(",").map((v) => {
        console.log(v);
        return v.toString() || Math.ceil(Math.random() * 3);
      })
    );
  }

  // await dbClient.query(/*SQL*/ `DELETE FROM animals`);
  // for (let i = 1; i < animalsArray.length; i++) {
  //   await dbClient.query(/*SQL*/
  //     `INSERT INTO animals (animals_name,price) VALUES ($1,$2)`,
  //       animalsArray[i].split(",").map((v) => {
  //       console.log(v);
  //       return v.toString();
  //     })
  //   );
  // }

  // await dbClient.query(/*SQL*/ `DELETE FROM order_animals`);
  // for (let i = 1; i < orderAnimalsArray.length; i++) {
  //   await dbClient.query(/*SQL*/
  //     `INSERT INTO order_animals (orders_id, animals_id, animals_amount,animals_history_price) VALUES ($1,$2,$3,$4)`,
  //     orderAnimalsArray[i].split(",").map((v) => {
  //       console.log(v);
  //       return v.toString();
  //     })
  //   );
  // }
}
// for (let i = 1; i < dataArray.length; i++) {
//   console.log("-------------------------");
//   let counter = 0;
//   dataArray[i].split(",").map((v) => {
//     console.log(counter >= 23 ? counter : "", ': ', v);
//     counter++;
//     return v.toString();
//   });
// }
insertDB();
