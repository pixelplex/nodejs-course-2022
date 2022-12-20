import { DataSource, DataSourceOptions } from 'typeorm';

export async function connectToDatabase(options: DataSourceOptions): Promise<DataSource> {
  const AppDataSource = new DataSource(options);
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
  console.log('Connected to DB');
  return AppDataSource;
}
