// Empty array initialization/declaration to store objects
let tasks = [];

/*
Initialization/declaration for variables using DOM method to retrieve reference to DOM elements
This section doesn't include variables using DOM method to create new elements
*/
const taskName = document.getElementById("taskName");
const category = document.getElementById("category");
const deadline = document.getElementById("deadline");
const status = document.getElementById("status");
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
  displayTasks();
};
