import winston from "winston";
import config from "../config/config.js";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white",
    },
};

const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: config.NODE_ENV === 'development' ? 'debug' : 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple())
        }
        ),
        new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
});

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}