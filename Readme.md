# Job Application Tracker

## Overview

This repository contains the backend and frontend applications for the Job Application Tracker. The backend is built using Node.js and Express, while the frontend is built using React. The applications interact to manage companies, jobs, and applications.

## Getting Started

**Clone the repository:**

Copy the URL from the repository and follow below:

   ```bash
   git clone <repository-url>
   ```

### Backend (Node.js / Express)

1. **Prerequisites**

- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)

2. **Installation**

    Get into the backend folder:

    ```
    cd back-end
    npm install
    ```

    To make it work with https server you can follow the command below:

    ```
    openssl req -nodes -new -x509 -keyout server.key -out server.cert
    ```

2. **Environment**

    Create a .env file inside backend folder. And keep your mongodb details in the env as:

    ```
    MONGODB_URL="<Your_mongodb_url>"
    DATABASE_NAME="<Your_database_name>"
    ```

Then, you can start the server with the following command:

```
npm start
```

The server starts on port 8080. So, you can copy the link below so that you can use in the frontend for apis.

Link: [https://localhost:8080](https://localhost:8080)



### Frontend (React)

1. **Prerequisites**

- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)

2. **Installation**

    Get into the frontend folder:

    ```
    cd front-end
    npm install
    ```

    On the apiSever.js, paste the backend URL.

Then, you can start the server with the following command:

```
npm start
```

The frontend server starts on port 3000. So, you can copy the link and paste in your browser to start using the project.

Link: [https://localhost:3000](https://localhost:3000)
