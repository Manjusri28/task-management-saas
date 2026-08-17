# task-management-saas

# Task Management SaaS

## 📌 Project Description

Task Management SaaS is a full-stack web application designed to help users create, manage, organize, and track their tasks efficiently.

The application provides a clean and user-friendly interface for managing tasks while using a backend API and database to store and manage application data.

This project demonstrates full-stack web development skills, including frontend development, backend API development, database integration, authentication, and CRUD operations.

---

## ✨ Features

* 🔐 User Registration and Login
* 👤 User Authentication
* 📋 Create and Manage Tasks
* ✏️ Update Existing Tasks
* 🗑️ Delete Tasks
* ✅ Track Task Status
* 📊 Dashboard for Task Management
* 🔎 Organize and manage tasks efficiently
* 💾 Persistent data storage
* 🔒 Protected backend routes
* 📱 Responsive and user-friendly interface

---

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Axios
* React Router

### Backend

* Node.js
* Express.js
* JavaScript
* REST API

### Database

* MongoDB
* Mongoose

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* MongoDB

---

## 📁 Project Structure

```text
Task Management SaaS/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Manjusri28/task-management-saas.git
```

Navigate into the project:

```bash
cd task-management-saas
```

---

### 2. Setup the Frontend

Navigate to the client folder:

```bash
cd client
```

Install the required dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on the local Vite development server.

---

### 3. Setup the Backend

Open another terminal and navigate to the server folder:

```bash
cd server
```

Install the backend dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the values with your own MongoDB connection string and secret key.

> ⚠️ Never upload your `.env` file or database credentials to GitHub.

---

## ▶️ Running the Application

You need to run both the frontend and backend servers.

### Start Backend

From the `server` directory:

```bash
npm run dev
```

or, depending on the configuration:

```bash
npm start
```

### Start Frontend

From the `client` directory:

```bash
npm run dev
```

After both servers are running, open the local frontend URL shown by Vite in your browser.

---

## 🔗 Application Architecture

The application follows a client-server architecture:

```text
                ┌─────────────────────┐
                │      Frontend       │
                │   React + Vite      │
                └──────────┬──────────┘
                           │
                           │ REST API
                           ▼
                ┌─────────────────────┐
                │       Backend       │
                │ Node.js + Express   │
                └──────────┬──────────┘
                           │
                           │ Mongoose
                           ▼
                ┌─────────────────────┐
                │      MongoDB        │
                │      Database       │
                └─────────────────────┘
```

---

## 🔄 CRUD Operations

The application demonstrates the core CRUD operations:

| Operation | Description             |
| --------- | ----------------------- |
| Create    | Create new tasks        |
| Read      | View and retrieve tasks |
| Update    | Modify existing tasks   |
| Delete    | Remove tasks            |

---

## 🔒 Authentication

The application includes user authentication to protect user-specific data and application functionality.

Authentication-related information is handled securely through the backend, while protected routes help prevent unauthorized access.

---

## 📡 API

The backend provides RESTful API endpoints that allow the frontend to communicate with the server.

The API is responsible for operations such as:

* User authentication
* User management
* Task management
* Retrieving task information
* Creating tasks
* Updating tasks
* Deleting tasks

The backend runs locally on:

```text
http://localhost:5000
```

---

## 🧪 Testing

Postman can be used to test the backend REST API.

The API can be tested for:

* Registration
* Login
* Authentication
* Creating tasks
* Retrieving tasks
* Updating tasks
* Deleting tasks

---

## 🖥️ Screenshots

Screenshots of the application can be added here to demonstrate the user interface.

### Login Page

*Add login page screenshot here.*

### Dashboard

*Add dashboard screenshot here.*

### Task Management

*Add task management screenshot here.*

---

## 🚀 Future Enhancements

Possible future improvements include:

* 📧 Email notifications
* 🔔 Task reminders
* 📅 Calendar integration
* 👥 Team collaboration
* 📈 Advanced analytics
* 🔍 Advanced task filtering and search
* 🏷️ Task categories and tags
* 🎨 Additional UI themes
* ☁️ Cloud deployment
* 📱 Improved mobile experience

---

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

* Building a full-stack web application
* Developing React components
* Creating REST APIs
* Connecting a frontend application with a backend
* Working with MongoDB and Mongoose
* Implementing authentication
* Performing CRUD operations
* Managing application state
* Using Axios for API communication
* Testing APIs using Postman
* Debugging frontend and backend issues
* Using Git and GitHub for version control

---

## 📦 Project Status

**Completed ✅**

The application has been developed as a full-stack Task Management SaaS project and is available on GitHub.

---

## 👩‍💻 Author

**Manjusri**

GitHub:
https://github.com/Manjusri28

---

## 📄 License

This project is created for educational and portfolio purposes.
