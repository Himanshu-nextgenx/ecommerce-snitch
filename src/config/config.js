import dotenv from 'dotenv';



dotenv.config();

if (!process.env.PORT  ) {    

    console.error("error: port is not defined in environment variables");
   }

   if (!process.env.MONGO_URI) {
    console.error("error: MONGO_URI is not defined in environment variables");
   }

   if (!process.env.JWT_SECRET) {
    console.error("error: JWT_SECRET is not defined in environment variables");
   }
const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI ,
  jwtSecret: process.env.JWT_SECRET,
}


export default config;