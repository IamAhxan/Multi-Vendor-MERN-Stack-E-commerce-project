import express from 'express';
import ErrorMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import user from './controller/userController.js';
import shop from './controller/shopController.js';
import event from './controller/eventController.js';
import product from './controller/productController.js';
import coupon from './controller/coupounCode.js';
import payment from './controller/paymentController.js';
import order from './controller/orderController.js';
import conversation from './controller/conversationController.js';
import message from './controller/messageController.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "https://multi-vendor-mern-stack-frontend.vercel.app"],
    credentials: true,
}));
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Static Files - Note: This only works for files ALREADY in the repo. 
// New uploads must use Cloudinary/S3.
app.use("/upload", express.static(path.join(__dirname, "upload")));

// API Routes
app.use("/user", user);
app.use("/shop", shop);
app.use("/product", product);
app.use("/event", event);
app.use("/coupon", coupon);
app.use("/payment", payment);
app.use("/order", order);
app.use("/conversation", conversation);
app.use("/message", message);

// Health Check Route (To test if 404 is fixed)
app.get('/', (req, res) => {
    res.status(200).send('API is running successfully on Vercel!');
});

// Error handler middleware
app.use(ErrorMiddleware);

export default app;