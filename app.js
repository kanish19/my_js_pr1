let tasks = [];

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const activeList = document.getElementById("active-list");
const completedList = document.getElementById("completed-list");
const themeBtn = document.getElementById("theme-btn");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

/* LOAD THEME */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

/* THEME TOGGLE */
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeBtn.textContent = dark ? "☀️" : "🌙";
};

/* ADD TASK */
form.addEventListener("submit", e => {
  e.preventDefault();
  if (!input.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: input.value,
    completed: false,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  });

  input.value = "";
  render();
});

/* PROGRESS */
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

/* RENDER */
function render() {
  activeList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("div");
    checkbox.className = "checkbox";
    if (task.completed) checkbox.classList.add("checked");

    checkbox.onclick = () => {
      task.completed = !task.completed;
      render();
    };

    const content = document.createElement("div");
    content.innerHTML = `
      <div>${task.text}</div>
      <div class="time">🕒 ${task.time}</div>
    `;

    li.appendChild(checkbox);
    li.appendChild(content);

    task.completed
      ? completedList.appendChild(li)
      : activeList.appendChild(li);
  });

  updateProgress();
}
