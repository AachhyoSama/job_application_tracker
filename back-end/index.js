import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import { companyRoutes } from "./routes/companyRoutes.js";
import { CompanyModel } from "./models/companyModel.js";
import { jobRoutes } from "./routes/jobRoutes.js";
import { JobModel } from "./models/jobModel.js";
import { applicationRoutes } from "./routes/applicationRoutes.js";
import { ApplicationModel } from "./models/applicationModel.js";
import { authRoutes } from "./routes/authRoutes.js";
import { AuthModel } from "./models/authModel.js";

const app = express();
const port = 8080;

// Create model instances
const companyModel = new CompanyModel();
const jobModel = new JobModel();
const applicationModel = new ApplicationModel();
const authModel = new AuthModel();

// Creating https server in express
const httpsOptions = {
    key: fs.readFileSync("./server.key"), // private key for the server (required)
    cert: fs.readFileSync("./server.cert"), // certificate for the server (required)
};
const server = https.createServer(httpsOptions, app);

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Connect to the databases and call the routes
Promise.all([
    authModel.connect(),
    companyModel.connect(),
    jobModel.connect(),
    applicationModel.connect(),
])
    .then(() => {
        // Use auth routes
        app.use("/job-tracker/auth", authRoutes);

        // Use company routes
        app.use("/job-tracker/company", companyRoutes);

        // Use job routes
        app.use("/job-tracker/jobs", jobRoutes);

        // Use application routes
        app.use("/job-tracker/applications", applicationRoutes);
    })
    .catch((error) => {
        console.error("Error connecting to the databases:", error);
    });

// Listening to the https server port
server.listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`);
});
