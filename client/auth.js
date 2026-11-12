const BASE = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : "https://task-management-app-ayny.onrender.com";
const GUEST_KEY = "guestTasks";

document.getElementById("registerBtn").addEventListener("click", registerUser);
document.getElementById("loginBtn").addEventListener("click", loginUser);

async function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill name, email and password");
    return;
  }

  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  if (!res.ok) {
    alert("Registration failed");
    return;
  }

  document.getElementById("name").value = "";
  alert("Registration successful. Now click Login.");
}

async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    alert("Login failed. Check email and password");
    return;
  }

  const data = await res.json();
  if (!data.token) {
    alert("Token not received from server");
    return;
  }

  localStorage.setItem("token", data.token);
  await syncGuestTasks(data.token);
  window.location.href = "index.html";
}

// Upload tasks created in guest mode to the user's account
async function syncGuestTasks(token) {
  let guestTasks = [];
  try {
    guestTasks = JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
  } catch {}

  if (guestTasks.length === 0) return;

  try {
    for (const t of guestTasks) {
      await fetch(`${BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: t.title,
          description: t.description,
          status: t.status
        })
      });
    }
    localStorage.removeItem(GUEST_KEY);
  } catch (err) {
    console.error("Could not sync guest tasks", err);
  }
}