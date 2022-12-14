import cors from "cors";
import {logging, writeDateLogging} from "./middleware/loggingMiddleware";
import userRoutes from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import {CLIENT_URL, SERVER_PORT} from "./config/settings";
import {config} from "./config/mikro-orm";
import {parserCron} from "./helpers/cron";
import logger from "./config/logger";
import cookieParser from "cookie-parser";
import express, {Application} from "express";
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {generalParser} from "./helpers/parsers/generalParser";

const app: Application = express();

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager
};

app.use(express.json());

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use(cookieParser());
app.use(writeDateLogging);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoute);
app.use(logging);

app.listen(SERVER_PORT, async () => {
    DI.orm = await MikroORM.init(config);
    DI.em = DI.orm.em.fork();
    parserCron.start();

    logger.info(`Server Started on port ${SERVER_PORT}`);
});



process.once('SIGINT', () => {
    parserCron.stop();
    DI.orm.close().then(() => logger.info(`PgSQL was closed by SIGINT process`));
});
process.once('SIGTERM', () => {
    parserCron.stop();
    DI.orm.close().then(() => logger.info(`PgSQL was closed by SIGTERM process`));
});
