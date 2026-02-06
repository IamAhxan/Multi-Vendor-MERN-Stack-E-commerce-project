import express from 'express';
import ErrorMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'
import user from './controller/userController.js'
import shop from './controller/shopController.js'
import product from './controller/productController.js'
import cors from 'cors'

const app = express();
// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies
}));
app.use("/upload", express.static("upload"));


// import routes

app.use("/user", user);  // <-- Mount your user routes under /api
app.use("/shop", shop);  // <-- Mount your Shop routes under /api
app.use("/product", product);  // <-- Mount your Product routes under /api


// Error handler middleware
app.use(ErrorMiddleware)

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;