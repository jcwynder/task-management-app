# Task Management App

![Design preview for Task Management App](#)

## Overview

For this assignment, I was tasked with building a dynamic **Task Management App** that allows users to:

1. Add new tasks with details such as the task name, category, deadline, and status.
2. Update the status of tasks to reflect their progress (e.g., “In Progress,” “Completed,” “Overdue”).
3. Automatically update task status based on the current date (tasks past their deadline will be marked as “Overdue”).
4. Filter tasks by status or category.
5. Persist task data using local storage so tasks are saved even after refreshing the page.

To implement the core functionality of this assignment, I applied a wide range of JavaScript concepts, including **arrays**, **objects**, **DOM manipulation**, **conditionals**, and **local storage** to persist the task data.

## Implementation

To begin working on this assignment, I created 3 files:

- `<index.html>` file to render my task data and allow users to ultilize the features I created
- `<styles.css>` file to apply styling to app
- `<app.js>` file to implement functionality for the the app's requirements

### HTML Structure

After creating my required files, I proceeded into the `<index.html>` file to create the HTML structure of the app.

This app is composed of 3 primary sections:

- Input fields (wrapped in a `<div>`) to collect and proccess entered data
- A filter dropdown (also wrapped in a `<div>`) that allows users to filter task data based on selected filter option(s)
- A table to render task data, which includes a task's name, category, deadline, status, and actions

### App Styling

After creating my HTML structure, I moved onto the `<styles.css>` file to apply styling to the app.

I did not implementa great deal of styling. The styling I applied is used to control the layout, appearance, and readability of elements in the task management interface—especially the filter dropdown, table, and status indicators

Here's a list of the applied styles I used and their intended purpose:

- ```
  #filterPosition {
    margin-top: 15px;
  }
  ```

  - Used to add spacing above the filter dropdown (with `id="filterPosition"`) to visually separate it from elements above, improving layout clarity.

- ```
  table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  }
  ```

  - Used to stretch table across full width of its container, remove space between table cell borders for a cleaner look, and add space between the table and the element above it for visual separation.

- ```
  th,
  td {
  border: 1px solid #ccc;
  padding: 8px;
  }
  ```

  - Used to Adds a light gray border around all table header (`<th>`) and data (`<td>`) cells and ensure there's space between the text and the cell borders, improving readability.

- ```
  th {
  background-color: #f2f2f2;
  }
  ```

  - Used to apply a light gray background color to header cells to visually distinguish the table headers from the rest of the table rows.

- ```
  .overdue {
  color: red;
  font-weight: bold;
  }
  ```

  - Used to visually highlight overdue tasks by applying the color red and bold styling to the overdue text entries.

### Logic Implementation

After applying styles to the app, the final phase of this assignment required me to implement the logic of the app to the `<app.js>` file in order to ultilize the functions I need to include.

Below is a brief overview of the JavaScript code implemented (along with comments to describe use case):

- ```
  // Empty array initialization/declaration to store objects
  let tasks = [];
  ```

- ```
  // Function to save user tasks to their local storage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  ```

- ```
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
  ```

- ```
  // Function to update status data
  function updateStatus(index, newStatus) {
    // Sets current status data to newStatus data once submitted
    tasks[index].status = newStatus;
    // Stores updated task data in user's local storage
    saveTasks();
    // Dynamically updates task data display
    displayTasks();
  }
  ```

- ```
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
  ```

- ```
  // Function to implement functionality for user to load task data from their local storage
  window.onload = function () {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  }
  displayTasks(); // Dynamically updates task data display
  };
  ```
