import * as dotenv from "dotenv";
dotenv.config();

interface Config {
  env: string | undefined;
  port: string | undefined;
  openAIApiKey: string | undefined;
  mongo: {
    uri: string;
  };
  baseUrl: string | undefined;
}

export const config: Config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  openAIApiKey: process.env.OPENAI_API_KEY,
  mongo: {
    uri: process.env.MONGO_URI || "",
  },
  baseUrl: process.env.BASE_URL,
};
