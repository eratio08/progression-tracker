import pino from "pino";
import { config } from "../config";

export const logger = pino({
  level: config.LOG_LVL,
  prettyPrint: {
    colorize: true,
    crlf: false,
    errorLikeObjectKeys: ["err", "error"],
    errorProps: "",
    levelFirst: false,
    messageKey: "msg",
    timestampKey: "time",
    translateTime: "SYS:yyyy-mm-dd-HH:MM:ss.l",
    ignore: "pid,hostname"
  }
});
