const BASE = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : "https://task-management-app-ayny.onrender.com";
const API = `${BASE}/tasks`;
const GUEST_KEY = "guestTasks";

let currentTasks = [];

const getToken = () => localStorage.getItem("token");
const isLoggedIn = () => !!getToken();

/* ---------- helpers ---------- */

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };
}

function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getGuestTasks() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGuestTasks(tasks) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(tasks));
}

function updateAuthUI() {
  document.getElementById("userStatus").textContent = isLoggedIn()
    ? "Logged in"
    : "Guest mode (tasks saved on this device)";
  document.getElementById("loginLink").hidden = isLoggedIn();
  document.getElementById("logoutBtn").hidden = !isLoggedIn();
}

/* ---------- data layer: guest (localStorage) or user (API) ---------- */

async function fetchTasks() {
  if (!isLoggedIn()) return getGuestTasks();

  const res = await fetch(API, { headers: authHeaders() });
  if (res.status === 401) {
    // token expired/invalid -> fall back to guest mode
    localStorage.removeItem("token");
    updateAuthUI();
    return getGuestTasks();
  }
  if (!res.ok) {
    console.error("Failed to load tasks");
    return [];
  }
  return res.json();
}

async function createTask(title, description) {
  if (!isLoggedIn()) {
    const tasks = getGuestTasks();
    tasks.push({
      _id: crypto.randomUUID(),
      title,
      description,
      status: "Pending"
    });
    saveGuestTasks(tasks);
    return true;
  }

  const res = await fetch(API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, description })
  });
  return res.ok;
}

async function patchTask(id, changes) {
  if (!isLoggedIn()) {
    const tasks = getGuestTasks().map(t =>
      t._id === id ? { ...t, ...changes } : t
    );
    saveGuestTasks(tasks);
    return;
  }

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(changes)
  });
}

async function removeTask(id) {
  if (!isLoggedIn()) {
    saveGuestTasks(getGuestTasks().filter(t => t._id !== id));
    return;
  }

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

/* ---------- UI actions ---------- */

async function loadTasks() {
  currentTasks = await fetchTasks();

  const box = document.getElementById("tasks");

  if (currentTasks.length === 0) {
    box.innerHTML = `<p class="empty">No tasks yet. Add your first one above.</p>`;
    return;
  }

  box.innerHTML = currentTasks
    .map(task => {
      const done = task.status === "Completed";
      return `
    <div class="task ${done ? "done" : ""}">
        <h3>${escapeHTML(task.title)}</h3>
        <p>${escapeHTML(task.description)}</p>
        <span class="badge ${done ? "completed" : "pending"}">${escapeHTML(task.status)}</span>

        <div class="task-actions">
            ${done ? "" : `<button class="btn-complete" onclick="completeTask('${task._id}')">Complete</button>`}
            <button class="btn-edit" onclick="editTask('${task._id}')">Edit</button>
            <button class="btn-delete" onclick="deleteTask('${task._id}')">Delete</button>
        </div>
    </div>`;
    })
    .join("");
}
async function addTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title) {
    alert("Please enter a task title");
    return;
  }

  const ok = await createTask(title, description);
  if (!ok) {
    alert("Failed to add task");
    return;
  }

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  loadTasks();
}

async function editTask(id) {
  const task = currentTasks.find(t => t._id === id);
  if (!task) return;

  const newTitle = prompt("Edit task title", task.title);
  if (newTitle === null || !newTitle.trim()) return;

  const newDescription = prompt("Edit description", task.description || "");
  if (newDescription === null) return;

  await patchTask(id, {
    title: newTitle.trim(),
    description: newDescription.trim()
  });
  loadTasks();
}

async function completeTask(id) {
  await patchTask(id, { status: "Completed" });
  loadTasks();
}

async function deleteTask(id) {
  await removeTask(id);
  loadTasks();
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

updateAuthUI();
loadTasks();