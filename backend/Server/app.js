import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
console.log("app.js loaded")

import connectDB from "./src/db/mongoose.js";
// import { authenticateToken } from './src/middleware/authMiddleware.js';

// import rateLimiter from './src/middleware/rateLimiterMiddleware.js';
import cors from 'cors';
import client from "prom-client";


//Routes
import testRoutes from "./src/routes/testRoutes.js";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register:client.register });

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
    origin:["http://localhost:5173", "http://localhost:7001"],
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
