const API = "http://localhost:5000/tasks";

async function loadTasks() {

    const response = await fetch(API);
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

    await fetch(API,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            title,
            description
        })
    });
    document.getElementById("title").value = "";
document.getElementById("description").value = "";

    loadTasks();
}
async function editTask(id){

    const newTitle =
    prompt("Enter new task title");

    if(!newTitle) return;

    await fetch(`${API}/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            title:newTitle
        })
    });

    loadTasks();
}

async function deleteTask(id){

    await fetch(`${API}/${id}`,{
        method:"DELETE"
    });

    loadTasks();
}

async function completeTask(id){

    await fetch(`${API}/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            status:"Completed"
        })
    });

    loadTasks();
}

loadTasks();