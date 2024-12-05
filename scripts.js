// Select DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Add Task Event
taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the page from refreshing
    const task = taskInput.value.trim(); // Get the task input
    console.log("Task submitted", task);

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

    // Task Text
    const taskText = document.createElement('span'); // Create a <span> for task text
    taskText.textContent = task;
    li.appendChild(taskText);

    // Add classes for status
    if (status === "complete") li.classList.add("task-complete");
    if (status === "working") li.classList.add("task-working");

    // Add Status Buttons
    const statusContainer = document.createElement('div'); // Buttons container
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-btn');
    statusContainer.appendChild(completeButton);

    const workingButton = document.createElement('button');
    workingButton.textContent = 'Working On';
    workingButton.classList.add('working-btn');
    statusContainer.appendChild(workingButton);

    li.appendChild(statusContainer); // Append the buttons container to <li>

    // Add Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    li.appendChild(deleteButton);

    taskList.appendChild(li); // Append the task item to the task list


    console.log("Task added to list", task);
}

// Task List Event



// Remove Task from localStorage
function removeTaskFromLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({ task }) => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    console.log(`Updated localStorage after deletion:`, updatedTasks);
}



// Save Task to localStorage with Status
function saveTaskToLocalStorage(task, status = "incomplete") {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ task, status });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update Task Status in localStorage
function updateTaskStatus(task, status) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(t => t.task === task ? { ...t, status } : t);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Get Tasks from localStorage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Load Tasks from localStorage on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(({ task, status }) => addTaskToList(task, status));
});

// DOM Elements for Progress Bar
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Update Progress Bar
function updateProgress() {
    const tasks = document.querySelectorAll('li'); // All tasks
    const completedTasks = document.querySelectorAll('.task-complete'); // Completed tasks

    const totalTasks = tasks.length;
    const completedCount = completedTasks.length;

    // Calculate percentage
    const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    // Update the progress bar and text
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}% Complete`;
}

// Update progress when tasks change
taskList.addEventListener('click', (event) => {
    const taskItem = event.target.closest('li'); // Ensure the clicked element is a task item
    if (!taskItem) return;

    const taskText = taskItem.firstChild.textContent.trim(); // Extract task text

    if (event.target.classList.contains('complete-btn')) {
        // Toggle "Complete" status
        if (taskItem.classList.contains('task-complete')) {
            taskItem.classList.remove('task-complete');
            updateTaskStatus(taskText, "incomplete");
        } else {
            taskItem.classList.remove('task-working');
            taskItem.classList.add('task-complete');
            updateTaskStatus(taskText, "complete");
        }
    } else if (event.target.classList.contains('working-btn')) {
        // Toggle "Working On" status
        if (taskItem.classList.contains('task-working')) {
            taskItem.classList.remove('task-working');
            updateTaskStatus(taskText, "incomplete");
        } else {
            taskItem.classList.remove('task-complete');
            taskItem.classList.add('task-working');
            updateTaskStatus(taskText, "working");
        }
    } else if (event.target.classList.contains('delete-btn')) {
        // Delete Task
        removeTaskFromLocalStorage(taskText);
        taskItem.remove();
    }

    // Update progress bar after any change
    updateProgress();
});




// Initialize progress on page load
document.addEventListener('DOMContentLoaded', updateProgress);


// DOM Elements
const quoteDisplay = document.getElementById("quote-display");
const fetchQuoteButton = document.getElementById("fetch-quote");

// Define the API URL
const api_url = "https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/random";

// Fetch and display a random quote
async function getapi(url) {
    try {
        // Display a loading message
        quoteDisplay.textContent = "Fetching a motivational quote...";

        // Fetch data from the API
        const response = await fetch(url);



        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);

        }

        // Parse the response JSON
        const data = await response.json();
        console.log("API Response:", data);
        console.log("API Response:", response);
        console.log("API Status:", response.status);


        // Extract the quote and author
        const quote = data[0]?.q || "No quote found";
        const author = data[0]?.a || "Unknown";

        // Display the quote on the webpage
        quoteDisplay.textContent = `"${quote}" — ${author}`;
    } catch (error) {
        // Handle any errors
        console.error("Error fetching quote:", error);
        quoteDisplay.textContent = "Sorry, we couldn't fetch a quote. Please try again.";
    }
}

// Add an event listener to the button
fetchQuoteButton.addEventListener("click", () => getapi(api_url));







