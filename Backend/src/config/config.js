import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  console.error("error: port is not defined in environment variables");
}

if (!process.env.MONGO_URI) {
  console.error("error: MONGO_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
  console.error("error: JWT_SECRET is not defined in environment variables");
}
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error("error: GOOGLE_CLIENT_ID is not defined in environment variables");
} 
if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.error("error: GOOGLE_CLIENT_SECRET is not defined in environment variables");
}
if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  console.error("error: IMAGEKIT_PRIVATE_KEY is not defined in environment variables");

}
const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
};

export default config;
