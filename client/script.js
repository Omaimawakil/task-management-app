const API = "https://task-management-app-ayny.onrender.com/tasks"
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

registerBtn.addEventListener("click", registerUser);
loginBtn.addEventListener("click", loginUser);

async function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res=await fetch("https://task-management-app-ayny.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });
  if(!res.ok){
    alert("Registeration failed");
    return;
  }
  document.getElementById("name").value = "";
document.getElementById("email").value = "";
document.getElementById("password").value = "";

  alert("Registration Successful");
  
  return;
}

async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://task-management-app-ayny.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });
   if(!res.ok){
    alert("Login failed. Check email and Password");
    return;
   }
  const data = await res.json();
  
  if(!data.token){
    alert("Token not recieved from server");
    return;
  }

  localStorage.setItem("token", data.token);
  document.getElementById("email").value = "";
document.getElementById("password").value = "";

  alert("Login Successful");
  loadTasks();
}

async function loadTasks() {

    const token = localStorage.getItem("token");
    if(!token){
        return;
    }

const response = await fetch(API, {
    headers: {
        Authorization:`Bearer ${token}`
    }
});
if(!response.ok){
    console.error("Failed to load tasks");
    return;
}
    const tasks = await response.json();

   document.getElementById("tasks").innerHTML =
    tasks.map(task => `
    <div class="task">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Status: ${task.status}</p>

        <button onclick="completeTask('${task._id}')">
            Complete
        </button>
        <button onclick="editTask('${task._id}')">
             Edit
        </button>
        <button onclick="deleteTask('${task._id}')">
            Delete
        </button>
    </div>
`).join("");
}

async function addTask() {

    const title =
        document.getElementById("title").value;

    const description =
        document.getElementById("description").value;

    const token = localStorage.getItem("token");
    if(!token){
        alert("Please log in first");
        return;
    }

    const  res =await fetch(API,{
        method:"POST",
        headers:{
    "Content-Type":"application/json",
    Authorization:`Bearer ${token}`
    },
        body:JSON.stringify({
            title,
            description
        })
    });
    if(!res.ok){
      alert("Failed to add task");
      return;
    }
    document.getElementById("title").value = "";
document.getElementById("description").value = "";

    loadTasks();
}
async function editTask(id){

    const newTitle =
    prompt("Enter new task title");

    if(!newTitle) return;

    const token = localStorage.getItem("token");
    if(!token){
        alert("Please log in first");
        return;
    }


    await fetch(`${API}/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
           Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
            title:newTitle
        })
    });

    loadTasks();
}

async function deleteTask(id){
    const token = localStorage.getItem("token");
    if(!token){
        alert("Please log in first");
        return;
    }

    await fetch(`${API}/${id}`,{
        method:"DELETE",
    headers:{
     Authorization:`Bearer ${token}`
    },
    });

    loadTasks();
}

async function completeTask(id){
    const token = localStorage.getItem("token");
    if(!token){
        alert("Please log in first");
        return;
    }

    await fetch(`${API}/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
            status:"Completed"
        })
    });

    loadTasks();
}
function logout() {
    localStorage.removeItem("token");
    location.reload();
}
loadTasks();
