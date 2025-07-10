# 📝 Django To-Do Web Application

A simple task management web application built with Django. This project allows users to manage their daily tasks.

---

## 🌐 Live Demo
Visit https://amirsamh.pythonanywhere.com to use the web application.

## 🚀 Features

- User registration and login system  
- Create, update, and delete tasks  
- Mark tasks as complete/incomplete
- Mark tasks as important 
- Create lists
- Deployed on PythonAnywhere

---

## 🔧 Tech Stack

- **Backend:** Python, Django  
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Database:** SQLite (default, configurable)  
- **Deployment:** PythonAnywhere

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/amirsamh/todo.git
cd todo
```
### 2. Migrate the database
```bash
python manage.py makemigrations todo
python manage.py migrate
```

### 3. Run on localhost
```bash
python manage.py runserver
```