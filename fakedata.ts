import { faker } from "@faker-js/faker";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

export interface User {
  email: string;
  first_name: string;
  last_name: string;
}

//user
async function createRandomUser() {
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();
  const email = faker.internet.email(first_name, last_name);
  const title = faker.helpers.arrayElement(["Mr", "Miss"]);
  const contact_num = faker.helpers.arrayElement(["51906988", "51170071", "93493702"]);
  console.log(first_name, last_name, email, title);

  let userResult = await client.query(
    "insert into users (first_name, last_name,email,title,contact_num) values ($1,$2,$3,$4,$5)",
    [first_name, last_name, email, title, contact_num]
  );
  console.log(userResult);
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

//driver
async function createRandomDriver() {
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();
  const email = faker.internet.email(first_name, last_name);
  const title = faker.helpers.arrayElement(["Mr", "Miss"]);
  const contact_num = faker.helpers.arrayElement(["51906988", "51170071", "93493702"]);
  //車牌
  const alphabetGenerator =
    alphabet[Math.floor(Math.random() * alphabet.length)] + alphabet[Math.floor(Math.random() * alphabet.length)];
  const fourNumber = Math.floor(Math.random() * 9999);
  const car_license_num = alphabetGenerator + fourNumber;
  const car_type = faker.helpers.arrayElement(["Van"]);
  console.log(first_name, last_name, email, title, contact_num, car_license_num, car_type);

  let driverResult = await client.query(
    "insert into drivers (first_name, last_name,email,title,contact_num,car_license_num,car_type) values ($1,$2,$3,$4,$5,$6,$7)",
    [first_name, last_name, email, title, contact_num, car_license_num, car_type]
  );
  console.log(driverResult);
}

//order **** date time not yet

//order anm  ***ANIMALS _UNIT_PRICE****
async function createOrderAnimal() {
  //1-5
  const orders_id = Math.floor(Math.random() * 5) + 1;
  //1-7
  const animals_id = Math.floor(Math.random() * 7) + 1;
  //1-5
  const animals_amount = Math.floor(Math.random() * 5) + 1;

  let orderAnimalResult = await client.query(
    "insert into order_animals (orders_id, animals_id,animals_amount) values ($1,$2,$3)",
    [orders_id, animals_id, animals_amount]
  );
  console.log(orderAnimalResult);
}

async function createAnimal() {
  const animalsArr = ["Cat", "Dog", "Chicken", "Duck", "Goose", "Turtle", "SeaCreatures"];
  const priceArr = [30, 40];
  let price;
  for (const animal of animalsArr) {
    if (animal === "Cat" || animal === "Dog") {
      price = priceArr[1];
    } else {
      price = priceArr[0];
    }

    let AnimalResult = await client.query("insert into animals (animals_name,price) values ($1,$2)", [animal, price]);
    console.log(AnimalResult);
  }
}

export async function createFakeData() {
  let random = 5;
  await client.connect();
  await createAnimal();
  for (let i = 0; i < random; i++) {
    await createRandomUser();
    await createRandomDriver();
    await createOrderAnimal();
  }
  await client.end();
}

createFakeData();
