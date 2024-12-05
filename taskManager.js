// taskManager.js

// Select DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Add Task Event
taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the page from refreshing
    const task = taskInput.value.trim(); // Get the task input
    if (task) {
        addTaskToList(task); // Add task to the DOM
        saveTaskToLocalStorage(task); // Save task to localStorage
        taskInput.value = ''; // Clear the input field
    } else {
        console.error("Task input is empty.");
    }
});

// Add Task to List
function addTaskToList(task, status = "incomplete") {
    const li = document.createElement('li'); // Task container
    li.setAttribute('draggable', 'true'); // Make draggable

    // Task Number
    const taskNumber = document.createElement('span');
    taskNumber.classList.add('task-number');
    li.appendChild(taskNumber); // Add the number to the task

    // Task Text
    const taskText = document.createElement('span');
    taskText.textContent = task;
    li.appendChild(taskText);

    // Add classes for status
    if (status === "complete") li.classList.add("task-complete");
    if (status === "working") li.classList.add("task-working");

    // Add Status Buttons
    const statusContainer = document.createElement('div');
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-btn');
    statusContainer.appendChild(completeButton);

    const workingButton = document.createElement('button');
    workingButton.textContent = 'Working On';
    workingButton.classList.add('working-btn');
    statusContainer.appendChild(workingButton);

    li.appendChild(statusContainer);

    // Add Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    li.appendChild(deleteButton);

    taskList.appendChild(li);

    updateTaskNumbers(); // Update task numbers
    updateProgress(); // Update the progress bar
}

// Update Task Numbers
function updateTaskNumbers() {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach((task, index) => {
        const taskNumber = task.querySelector('.task-number');
        taskNumber.textContent = `${index + 1}.`; // Update the number
    });
}

// Drag-and-Drop Functionality
let draggedTask = null;

taskList.addEventListener('dragstart', (event) => {
    draggedTask = event.target;
    event.target.style.opacity = '0.5';
});

taskList.addEventListener('dragover', (event) => {
    event.preventDefault(); // Allow dropping
    const closestTask = document.elementFromPoint(event.clientX, event.clientY);
    if (closestTask && closestTask !== draggedTask && closestTask.nodeName === 'LI') {
        taskList.insertBefore(draggedTask, closestTask.nextSibling);
    }
});

taskList.addEventListener('dragend', () => {
    draggedTask.style.opacity = '1';
    updateTaskNumbers(); // Update numbers after reordering
    updateTaskOrderInLocalStorage(); // Update the order in localStorage
});

// Update Task Order in localStorage
function updateTaskOrderInLocalStorage() {
    const tasks = document.querySelectorAll('#task-list li span:nth-child(2)');
    const updatedTasks = Array.from(tasks).map((taskElement) => {
        const taskText = taskElement.textContent;
        const status = taskElement.closest('li').classList.contains('task-complete')
            ? 'complete'
            : taskElement.closest('li').classList.contains('task-working')
                ? 'working'
                : 'incomplete';
        return { task: taskText, status };
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Remove Task from localStorage
function removeTaskFromLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({ task }) => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Save Task to localStorage
function saveTaskToLocalStorage(task, status = "incomplete") {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ task, status });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get Tasks from localStorage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Load Tasks from localStorage on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(({ task, status }) => {
        addTaskToList(task, status);
    });
    updateTaskNumbers(); // Ensure numbers are updated
    updateProgress(); // Initialize progress on page load
});

function updateTaskStatus(task, status) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map((t) =>
        t.task === task ? { ...t, status } : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}


// Update Progress Bar
function updateProgress() {
    const tasks = document.querySelectorAll('li');
    const completedTasks = document.querySelectorAll('.task-complete');
    const totalTasks = tasks.length;
    const completedCount = completedTasks.length;
    const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}% Complete`;
}

// Task List Event Listener
taskList.addEventListener('click', (event) => {
    const taskItem = event.target.closest('li');
    if (!taskItem) return;

    const taskText = taskItem.querySelector('span:nth-child(2)').textContent;

    if (event.target.classList.contains('complete-btn')) {
        taskItem.classList.toggle('task-complete');
        updateTaskStatus(taskText, taskItem.classList.contains('task-complete') ? "complete" : "incomplete");
    } else if (event.target.classList.contains('working-btn')) {
        taskItem.classList.toggle('task-working');
        updateTaskStatus(taskText, taskItem.classList.contains('task-working') ? "working" : "incomplete");
    } else if (event.target.classList.contains('delete-btn')) {
        removeTaskFromLocalStorage(taskText);
        taskItem.remove();
    }

    updateTaskNumbers();
    updateProgress();
});

