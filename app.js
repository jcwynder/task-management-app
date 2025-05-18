// Empty array initialization/declaration to store objects
let tasks = [];

const tbody = document.getElementById("taskContent");
const filter = document.getElementById("combinedFilter");
const combinedFilterElement = document.getElementById("combinedFilter");

// Function to save user tasks to their local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to implement functionality for user to load task data from their local storage
window.onload = function () {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  displayTasks(); // Dynamically updates task data display
};

// Function to add task data
function addTask() {
  // Initialization/declaration for variables using DOM method to retrieve reference to DOM elements
  const taskName = document.getElementById("taskName").value.trim();
  const category = document.getElementById("category").value.trim();
  const deadline = document.getElementById("deadline").value;
  const status = document.getElementById("status").value;

  // if statement used to alert user to input data using all input fields if any field(s) is left blank upon submission
  if (!taskName || !category || !deadline) {
    alert("Please fill all fields.");
    return;
  }

  // Adds a new task object (using the properties listed) to the tasks array
  tasks.push({ taskName, category, deadline, status });
  saveTasks(); // Stores updated task data in user's local storage
  displayTasks(); // Dynamically updates task data display

  // Clears input fields after user submits data from input fields
  document.getElementById("taskName").value = "";
  document.getElementById("category").value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("status").value = "In Progress";
}
