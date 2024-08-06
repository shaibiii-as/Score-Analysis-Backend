import mongoose from "mongoose";
import { config } from "./var";
const {
  mongo: { uri: mongoUri },
} = config;

interface ExtendedConnectOptions extends mongoose.ConnectOptions {
  useUnifiedTopology?: boolean;
}

const connectionOptions: ExtendedConnectOptions = {
  useUnifiedTopology: true,
};

// Exit application on error
mongoose.connection.on("error", () => {
  process.exit(-1);
});

// Print mongoose logs in dev env
if (config.env === "development") {
  mongoose.set("debug", true);
}

/**
 * Connect to mongo db
 *
 * @returns {mongoose.Connection} Mongoose connection
 * @public
 */
export const connect = (): mongoose.Connection => {
  mongoose.connect(mongoUri, connectionOptions);
  return mongoose.connection;
};
