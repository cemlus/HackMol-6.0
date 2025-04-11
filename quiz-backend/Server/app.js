import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import authRoute from "./src/routes/authRoutes.js";
import complaintRoutes from "./src/routes/complaintRoutes.js";
console.log("app.js loaded")

// import crypticRoute from "./src/routes/crypticRoute.js";
// import leaderBoardRoute from "./src/routes/leaderBoardRoute.js";
import connectDB from "./src/db/mongoose.js";
// import { authenticateToken } from './src/middleware/authMiddleware.js';
import rateLimiter from './src/middleware/rateLimiterMiddleware.js';
import cors from 'cors';
import client from "prom-client";
import gameRoutes from "./src/routes/gameRoutes.js"
import testRoutes from "./src/routes/testRoutes.js";
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register:client.register });
import { createLogger, transports } from "winston";
import LokiTransport from "winston-loki";
const options = {
    transports: [
      new LokiTransport({
        host: "http://13.200.30.53:3100"
      })
    ]
  };
  const logger = createLogger(options);
  export { logger };

const app = express();
app.set('trust proxy' , 20);
app.get('/ip', (request, response) => response.send(request.ip));
app.get('/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']));
// app.use(rateLimiter);

const NUM_INSTANCES = 1;
const START_PORT = 8000;
app.use(cors(
    {
      // origin:["https://www.backslashtiet.com","https://backslashtiet.com"],
//    origin:["http://localhost:5173", "http://localhost:7001"],
    // origin: "*",
	    origin: function (origin, callback) {
    // Allow requests from frontend, no-origin (like mobile apps), or specific trusted origins
    if (
      !origin || // allow mobile apps or curl/postman
      origin === "https://frontend.topishukla.xyz" ||
      origin === "capacitor://localhost" || // for Ionic/Capacitor apps
      origin === "file://" // for Electron apps
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
    methods:["POST","GET"],
    credentials: true // Allow cookies to be sent with the request
  }
  ));
// app.use(logoutRoute);

//static files folders
connectDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const __public = dirname(__dirname) + "/public";

console.log(__public);
console.log(__dirname);

// Serve static files from the 'public/scripts' directory
app.use('/public', express.static(join(__dirname, '..', 'public')));
app.use('/scripts', express.static(join(__dirname, '..', 'public', 'scripts')));
app.use(express.static(__public));
app.use(express.static("public/views"));

app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));


app.get("/metrics",async(req,res)=>{
    res.setHeader("Content-Type",client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
})






app.use(authRoute);
app.use(gameRoutes);
app.use(complaintRoutes)
// app.use(crypticRoute);
// app.use(leaderBoardRoute);
app.use("/test",testRoutes);

function startServers() {
    for (let i = 0; i < NUM_INSTANCES; i++) {
        const port = START_PORT + i;
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:`,port);
        });
    }
}

// if (process.env.NODE_APP_INSTANCE !== undefined) {
//     startServers();
// } else {
//     const instances = NUM_INSTANCES || 3;
//     const { fork } = await import('pm2');

//     fork(import.meta.url, {
//         instances,
//         exec_mode: 'cluster'
//     }, (err) => {
//         if (err) {
//             console.error('Error starting application:', err);
//             process.exit(1);
//         }
//     });
// }
startServers();
