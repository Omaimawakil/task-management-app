# Task Management Application

A simple yet functional Task Management Application designed to help users organize, manage, and track their daily tasks through a clean and user-friendly interface.

## Live Demo
https://taskmanager-012.netlify.app/

## Features

- **User Authentication:** Register and log in securely to manage personal tasks.
- **Guest Mode:** Use the application without creating an account. Guest tasks are saved locally on the device.
- **Add Tasks:** Create tasks with a title and description.
- **Edit Tasks:** Update existing task details whenever needed.
- **Delete Tasks:** Remove tasks that are no longer required.
- **Task Completion:** Mark tasks as completed to track progress.
- **Task Status:** Easily distinguish between pending and completed tasks.
- **Data Persistence:** Guest tasks are stored using browser LocalStorage, while authenticated users' tasks are managed through the backend and database.
- **Responsive Interface:** A clean layout designed for convenient use across different screen sizes.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- LocalStorage API

### Backend
- Node.js
- Express.js
- REST API

### Database & Authentication
- MongoDB
- JSON Web Tokens (JWT)

### Deployment
- Netlify – Frontend Hosting
- Render – Backend Hosting
- GitHub – Version Control

## Application Workflow

1. Users can access the application in Guest Mode or through Login/Register.
2. Guest users can create and manage tasks directly on their device.
3. Registered users can authenticate and manage their tasks through the backend.
4. Users can add, edit, delete, and complete tasks.
5. Task status updates help users keep track of their progress.


### Clone the Repository

```bash
git clone https://github.com/Omaimawakil/task-management-app.git
```

### Navigate to the Project

```bash
cd task-management-app
```

### Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory and configure your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend using its configured entry point.

## Project Structure

```text
task-management-app/
│
├── client/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── login.html
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── server.js
│
├── .gitignore
└── README.md
