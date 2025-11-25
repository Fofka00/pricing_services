import { google } from 'googleapis';

export async function uploadToGoogleSheets(data: any[]) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials/sound-berm-479311-c8-bbc3ebdf3a67.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1ErStBo5olAPkQvwp3kO4nMfij0dVbboSJwsW6l697yY'; 
  const range = 'Лист1!A1';

  const values = data.map(item => [
    item.id,
    item.dt_till_max,
    JSON.stringify(item.warehouse_list),
    item.created_at,
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  console.log('Данные выгружены в Google Таблицу');
}