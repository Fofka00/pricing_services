import axios from 'axios';
import knex from 'knex';
import dotenv from 'dotenv';
import { uploadToGoogleSheets } from './uploadToGoogleSheets';

dotenv.config();

const WB_API_KEY = process.env.WB_API_KEY;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_NAME = process.env.DB_NAME || 'pricing_db';

const db = knex({
  client: 'pg',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
});

async function saveTariffs(data: any) {
  await db('tariffs').insert({
    dt_till_max: data.dtTillMax,
    warehouse_list: JSON.stringify(data.warehouseList),
  });
  console.log('Тарифы сохранены в базу');
}

async function fetchTariffs() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const response = await axios.get('https://common-api.wildberries.ru/api/v1/tariffs/box', {
      headers: {
        'Authorization': `Bearer ${WB_API_KEY}`,
      },
      params: {
        date: today,
      },
    });
    console.log('Tariffs fetched:', response.data);
    const data = response.data.response.data;
    await saveTariffs(data);
    const tariffs = await db('tariffs').select('*');
    await uploadToGoogleSheets(tariffs);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.status, error.response?.data);
    } else if (error instanceof Error) {
      console.error('Error fetching tariffs:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

setInterval(fetchTariffs, 60 * 60 * 1000);

fetchTariffs();