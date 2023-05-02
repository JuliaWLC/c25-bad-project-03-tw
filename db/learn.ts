import path from "path";
import xlsx from "xlsx";
import { Client } from "pg";
import fs from "fs";

let animalsArray = fs.readFileSync(path.join(__dirname, "animals.csv"));

console.log("check readFileSync", animalsArray.toString('utf8'));
// let animalsArray = fs
//   .readFileSync(path.join(__dirname, "animals.csv"))
//   .toString()
//   // .replace(/(?:\\[rn]|[\r]+)+/g, "")
//   .split("\n");
// for (let i = 1; i < animalsArray.length; i++) {
//   // await client.query(/*SQL*/
//   //   `INSERT INTO animals (animals_name,price) VALUES ($1,$2)`,
//   //     animalsArray[i].split(",").map((v) => {
//   //     console.log(v);
//   //     return v.toString();
//   //   })
//   // );
//   let buffer = Buffer.from(animalsArray[i], "utf8");
//   console.log("check without regex", buffer, "|||||", buffer.toString("utf8"));
// }

import dotenv from "dotenv";
dotenv.config();

export async function main() {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  await client.connect();
  const animalsFile = path.join(__dirname, "animals.csv");
  const animals = xlsx.readFile(animalsFile, { type:"string" ,raw:true});
  //   const animalsRow = xlsx.utils.sheet_to_csv(
  //     animals.Sheets["Sheet1"]
  //   );

  console.log(animals.Sheets.Sheet1);
  //   for (const animalRow of animalsRow) {
  //     console.log("check check",animalRow)
  //   }

  //   await client.query(/*SQL*/ `DELETE FROM animals`);
  //   for (const animalRow of animalsRow) {
  //     let animalsSql = /*SQL*/ `INSERT INTO animals (animals_name,price) VALUES ($1,$2)`;
  //     await client.query(animalsSql, [animalRow.animals_name, animalRow.price]);
  //   }

  await client.end();
}

main();
