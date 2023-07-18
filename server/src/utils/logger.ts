import winston, { format } from "winston";
import chalk from "chalk";
import path from "path";

const errorColor = chalk.red.bold;
const warningColor = chalk.yellow.bold;
const successColor = chalk.green.bold;
const infoColor = chalk.white;

const logFolderPath = process.env.LOG_FOLDER_PATH ?? "./logs";
const maxLogFileSize = parseInt(process.env.LOG_FILE_MAX_SIZE ?? "10485760");

const customLevels = {
  error: 0,
  warning: 1,
  info: 2,
  success: 3,
};

const timestampFormat = format.timestamp({
  format: "DD-MMM-YYYY HH:mm:ss.SSS",
});

const simpleOutputFormat = format.printf((log) => {
  return `${log.timestamp}\t${log.level}: ${log.message}`;
});

const coloredOutputFormat = format.printf((log) => {
  let color = infoColor;

  switch (log.level) {
    case "error":
      color = errorColor;
      break;
    case "warning":
      color = warningColor;
      break;
    case "success":
      color = successColor;
      break;
  }

  return `${log.timestamp}\t${color(log.message)}`;
});

const fileFormat = format.combine(timestampFormat, simpleOutputFormat);
const consoleFormat = format.combine(timestampFormat, coloredOutputFormat);

const getFileTransportOption = (fileType: "error" | "combined"): winston.transports.FileTransportOptions => {

  const baseOptions: winston.transports.FileTransportOptions = {
    level: "success",
    maxsize: maxLogFileSize,
    format: fileFormat
  }

  if (fileType === "error") {
    return { ...baseOptions, filename: path.resolve(logFolderPath, "error.log"), level: "error" }
  }
  else if (fileType === "combined") {
    return { ...baseOptions, filename: path.resolve(logFolderPath, "combined.log"), level: "success" }
  }

  return baseOptions;
}


const loggerOptions: winston.LoggerOptions = {
  levels: customLevels,
  transports: [
    new winston.transports.Console({ format: consoleFormat, level: "success" }),
    new winston.transports.File({ filename: path.resolve(logFolderPath, "error.log"), level: "error", maxsize: maxLogFileSize, format: fileFormat }),
    new winston.transports.File({ filename: path.resolve(logFolderPath, "combined.log"), level: "success", maxsize: maxLogFileSize, format: fileFormat })
  ]
}

const logger = winston.createLogger(loggerOptions);

// TODO: Add another log level called morgan and have a separate file for it
class LoggerStream {
  write(text: string) {
    logger.info(text.replace(/\n$/, ''));
  }
}
export let loggerStream = new LoggerStream();

const HelperLogger = {
  error: (message: string): winston.Logger => logger.error(message),
  warning: (message: string): winston.Logger => logger.warning(message),
  info: (message: string): winston.Logger => logger.info(message),
  success: (message: string): winston.Logger => logger.log("success", message),
}

export default HelperLogger;