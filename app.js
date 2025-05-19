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
  // Saves selected filter value from dropdown
  const savedFilter = combinedFilterElement.value;
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

  // Preserves user's dropdown selection after select options are refreshed upon dynamic rendering
  Array.from(combinedFilterElement.options).forEach((option) => {
    if (option.value === savedFilter) {
      option.selected = true;
    }
  });

  // Iterates through each item (categories) in the array
  uniqueCategories.forEach((category) => {
    // Creates a new option element in the filter dropdown
    const option = document.createElement("option");
    // Sets value attribute of the option property to a string format: category:category name
    option.value = `category:${category}`;
    // Sets visible text of created option in the filter dropdown using the applied string format
    option.textContent = `Category: ${category}`;
    /* 
    if statement that checks if current dropdown option's value matches value from savedFilter
    If values match from both variables, savedFilter options are preserved when dropdown is dynamically updated
    */
    if (savedFilter === option.value) option.selected = true;
    // Dyncamically adds newly created optiion to filter dropdown
    combinedFilterElement.appendChild(option);
  });

  // Iterates through each task object in a given position
  tasks.forEach((task, index) => {
    // Intialized/declared variable to store data for created tr element
    const row = document.createElement("tr");
    // Gets current status of a task
    let currentStatus = task.status;
    // Converts the task’s deadline string into a Date object to be compared to the current time
    const deadlineDate = new Date(task.deadline);
    /*
    Checks if task is overdue. 
    If the task is not complete and the deadline has passed from current date, then the task is overdue (true)
    */
    const isOverdue = currentStatus !== "Completed" && deadlineDate < now;
    // Sets displayStatus of task to overdue if true, otherwise remains as currentStatus
    const displayedStatus = isOverdue ? "Overdue" : currentStatus;

    // if statement to check if current filter status starts with status:
    if (filter.startsWith("status:")) {
      // If above line is true, splits filter string at :, then extracts second part [1], which is value of status:
      const statusValue = filter.split(":")[1];
      // If statement that skips task if displayStatus doesn't match the selected statusValue
      if (displayedStatus !== statusValue) return;
      // If displayStatus doesn't match selected statusValue, checks if current filter status startswith category:
    } else if (filter.startsWith("category:")) {
      // If above line is true, splits filter string at :, then extracts second part [1], which is value of category:
      const categoryValue = filter.split(":")[1];
      // If statement that skips task if task's category doesn't match the selected categoryValue
      if (task.category !== categoryValue) return;
    }

    /*
    Dynamically creates table row data (displays taskName, category, and deadline)
    Renders data using string interpolation. if task staus (value) is overdue, applies "overdue" CSS styling to value
    Adds a dropdown to each task entry to update status and adds a delete button to remove task when clicked
    */
    row.innerHTML = `
      <td>${task.taskName}</td>
      <td>${task.category}</td>
      <td>${task.deadline}</td>
      <td class="${displayedStatus === "Overdue" ? "overdue" : ""}">
        ${displayedStatus}
      </td>
      <td>
        <select onchange="updateStatus(${index}, this.value)">
          <option value="In Progress" ${
            task.status === "In Progress" ? "selected" : ""
          }>In Progress</option>
          <option value="Completed" ${
            task.status === "Completed" ? "selected" : ""
          }>Completed</option>
        </select>
        <button onclick="deleteTask(${index})">Delete</button>
      </td>
    `;
    // Adds fully contructed table row data to table body element, which visually displays task data
    tbody.appendChild(row);
  });
}

// Function to update status data
function updateStatus(index, newStatus) {
  // Sets current status data to newStatus data once submitted
  tasks[index].status = newStatus;
  // Stores updated task data in user's local storage
  saveTasks();
  // Dynamically updates task data display
  displayTasks();
}

// Function to delete task data
function deleteTask(index) {
  // if statement used to collect user's response to dialog box (message) after clicking delete button
  if (confirm("Are you sure you want to delete this task?")) {
    /*
    If user selects "ok" as response to message:
    1 task is deleted from memory at the specified index from the task array
    */
    tasks.splice(index, 1);
    // Stores updated task data in user's local storage
    saveTasks();
    // Dynamically updates task data display
    displayTasks();
  }
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
    alert("Please fill all fields to add task data");
    return;
  }

  // Adds a new task object (using the properties listed) to the tasks array
  tasks.push({ taskName, category, deadline, status });
  // Stores updated task data in user's local storage
  saveTasks();
  // Dynamically updates task data display
  displayTasks();

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
