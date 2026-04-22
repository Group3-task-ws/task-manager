let tasks = loadTasks();
let editId = null;

// 🔥 FILTER STATES
let statusFilter = "all";
let priorityFilter = "all";
let searchText = "";

// HANDLE FORM
function handleSubmit(e) {
    e.preventDefault();

    if (editId) {
        updateTask();
    } else {
        addTask();
    }
}

// ADD TASK
function addTask() {
    let task = getFormData();

    task.id = Date.now();
    task.completed = false;

    tasks.push(task);
    saveTasks(tasks);

    renderTasks();
    clearForm();
}

// UPDATE TASK
function updateTask() {
    let updated = getFormData();

    tasks = tasks.map(t =>
        t.id === editId ? { ...t, ...updated } : t
    );

    saveTasks(tasks);

    editId = null;
    document.getElementById("submitBtn").innerText = "Add Task";

    renderTasks();
    clearForm();
}

// GET FORM DATA
function getFormData() {
    return {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        priority: document.getElementById("priority").value,
        dueDate: document.getElementById("dueDate").value
    };
}

// 🔥 FILTER FUNCTIONS
function setStatusFilter(type) {
    statusFilter = type;
    renderTasks();
}

function setPriorityFilter(value) {
    priorityFilter = value;
    renderTasks();
}

function setSearch(value) {
    searchText = value.toLowerCase();
    renderTasks();
}

// 🔥 APPLY FILTER LOGIC
function getFilteredTasks() {
    return tasks.filter(task => {

        // status filter
        if (statusFilter === "active" && task.completed) return false;
        if (statusFilter === "completed" && !task.completed) return false;

        // priority filter
        if (priorityFilter !== "all" && task.priority.toLowerCase() !== priorityFilter) {
            return false;
        }

        // search filter
        if (!task.title.toLowerCase().includes(searchText)) {
            return false;
        }

        return true;
    });
}

// RENDER
function renderTasks() {
    let container = document.getElementById("taskList");
    container.innerHTML = "";

    let filtered = getFilteredTasks();

    if (filtered.length === 0) {
        container.innerHTML = "<p>No tasks found</p>";
        return;
    }

    filtered.forEach(task => {
        let div = document.createElement("div");
        div.className = "task-card";

        if (task.completed) div.classList.add("completed");

        div.innerHTML = `
            <input type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})">

            <b>${task.title}</b> (${task.priority})

            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        container.appendChild(div);
    });
}

// TOGGLE
function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );

    saveTasks(tasks);
    renderTasks();
}

// DELETE
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
}

// EDIT
function editTask(id) {
    let t = tasks.find(t => t.id === id);

    document.getElementById("title").value = t.title;
    document.getElementById("description").value = t.description;
    document.getElementById("category").value = t.category;
    document.getElementById("priority").value = t.priority;
    document.getElementById("dueDate").value = t.dueDate;

    editId = id;
    document.getElementById("submitBtn").innerText = "Update Task";
}

// CLEAR
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("dueDate").value = "";
}

// LOAD
renderTasks();