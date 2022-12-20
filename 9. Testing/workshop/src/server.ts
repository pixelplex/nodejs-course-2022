import { connectToDatabase } from '@utils';
import { config } from 'config';
import { DataSource } from 'typeorm';

import { app } from './app';

let dbConnection: DataSource;

async function init(): Promise<void> {
  try {
    dbConnection = await connectToDatabase(config.DEV.DB);
    app.listen(config.DEV.PORT, () => console.log(`Listening ${config.DEV.PORT}`));
  } catch (error) {
    console.log(error);
    dbConnection.destroy();
    process.exit(1);
  }
}

init();
