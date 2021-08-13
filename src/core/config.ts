import { TypeOrmModuleOptions } from "@nestjs/typeorm";

require("dotenv").config({
    path: __dirname+'/../../.env'
})

export const JWT_SECRET = process.env.JWT_SECRET || "secret123hushJkMbCxzaws"

// environment vars // env vars
export const db_config: TypeOrmModuleOptions = {
    type: 'mysql',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: process.env.DB_SYNC == 'true',
    host: "localhost",
    port: 3306
}

