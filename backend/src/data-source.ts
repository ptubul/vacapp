import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/users_model";
//import Trip from "./entity/trips_model";

const connectDB =  new DataSource({
    type: "postgres",
    host:  process.env.DB_HOST,
    port:Number(String(process.env.DB_PORT)),
    username: process.env.DB_USER_NAME,
    password:  process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    synchronize: true,
    entities: [User],
    extra: {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false

    }
})

export default connectDB;
