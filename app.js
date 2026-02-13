let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ===== LOCAL STORAGE ===== */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

/* ===== DOM ELEMENTS ===== */
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const activeList = document.getElementById("active-list");
const completedList = document.getElementById("completed-list");
const themeBtn = document.getElementById("theme-btn");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

/* ===== THEME ===== */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeBtn.textContent = dark ? "☀️" : "🌙";
};

/* ===== ADD TASK ===== */
form.addEventListener("submit", e => {
  e.preventDefault();
  if (!input.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: input.value.trim(),
    completed: false,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });

  input.value = "";
  saveTasks();
  render();
});

/* ===== PROGRESS ===== */
function updateProgress() {
  if (tasks.length === 0) {
    progressBar.style.width = "0%";
    progressText.textContent = "0% Completed";
    return;
  }

  const done = tasks.filter(t => t.completed).length;
  const percent = Math.round((done / tasks.length) * 100);

  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;
}

/* ===== RENDER ===== */
function render() {
  activeList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Checkbox
    const checkbox = document.createElement("div");
    checkbox.className = "checkbox";
    if (task.completed) checkbox.classList.add("checked");

    checkbox.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      render();
    };

    // Task content
    const content = document.createElement("div");
    content.className = "task-content";
    content.innerHTML = `
      <div class="task-text">${task.text}</div>
      <div class="time">🕒 ${task.time}</div>
    `;

    li.appendChild(checkbox);
    li.appendChild(content);

    // Actions
    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Edit active tasks
    if (!task.completed) {
      const editBtn = document.createElement("span");
      editBtn.innerHTML = "✏️";
      editBtn.title = "Edit task";
      editBtn.onclick = () => {
        const newText = prompt("Edit task", task.text);
        if (newText && newText.trim()) {
          task.text = newText.trim();
          saveTasks();
          render();
        }
      };
      actions.appendChild(editBtn);
    }

    // Delete completed tasks
    if (task.completed) {
      const deleteBtn = document.createElement("span");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.title = "Delete task";
      deleteBtn.onclick = () => {
        if (confirm("Delete this task?")) {
          tasks = tasks.filter(t => t.id !== task.id);
          saveTasks();
          render();
        }
      };
      actions.appendChild(deleteBtn);
    }

    li.appendChild(actions);

    // Add to proper list
    if (task.completed) completedList.appendChild(li);
    else activeList.appendChild(li);
  });

  updateProgress();
}

/* ===== INITIAL LOAD ===== */
loadTasks();
render();
