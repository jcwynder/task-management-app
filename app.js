// Empty array initialization/declaration to store objects
let tasks = [];

// Function to save user tasks to their local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to render task data
function displayTasks() {
  // Initialization/declaration for variables using DOM method to retrieve reference to DOM elements
  const tbody = document.getElementById("taskContent");
  const filter = document.getElementById("combinedFilters").value;
  const combinedFilterElement = document.getElementById("combinedFilters");
  // Date object initialized to the current date and time based on user's system clock
  const now = new Date();
  // Clears existing data in table body before populating it with new content for a clean refresh
  tbody.innerHTML = "";

  /* 
  Creates an array of all categories (including duplicates) from tasks array
  Wraps that array in a Set (duplicates are automatically removed since a Set only stores unique values)
  Set is converted back into a regular array of unique categories
  */
  const uniqueCategories = [...new Set(tasks.map((task) => task.category))];

  /*
  Clears the existing options in the filter dropdown 
  Then rebuilds it with four predefined options for task status (All, In Progress, Completed, Overdue)
  Used to filter tasks based on their status using the predefined options
  */
  combinedFilterElement.innerHTML = `
    <option value="">All</option>
    <option value="status:In Progress">Status: In Progress</option>
    <option value="status:Completed">Status: Completed</option>
    <option value="status:Overdue">Status: Overdue</option>
  `;
}

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

// Function to implement functionality for user to load task data from their local storage
window.onload = function () {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  displayTasks(); // Dynamically updates task data display
};
