// selector for the input section
const taskInput = document.querySelector(".taskInput input");
// selector for the filter section
let filters = document.querySelectorAll(".filters span");
// selector for the clear button
let clearAll = document.querySelector(".clearBtn");
// selector for the list of tasks
let taskBox = document.querySelector(".taskBox");

let todos = JSON.parse(localStorage.getItem("todo-list"));
// id of task which has to be edit

let editId;
let isEditTask = false;

// get id for the Add button
let addBtn = document.getElementById("addBtn");
// get id for the count of the task
var total = document.getElementById("total");

// Add event listener to Add button

addBtn.addEventListener("click", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == null && userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);

      // create an element checkbox
      var checkbox = document.createElement("INPUT");
      // set the attribute for checkbox
      checkbox.setAttribute("type", "checkbox");

      // increment in count of task
      total.textContent = +total.textContent + 1;
      // save in local storage
      localStorage.setItem("todo-list", JSON.stringify(todos));
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }

  e.preventDefault();
});

// Filtering the task list (All, Pending, Completed)

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

//Clear all the task from list
// Add event listener to clearAll button

clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
  total.textContent = +0;
});

// Functions
// show the list of tasks thorough inner div

function showTodo(filter) {
  let liTag = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <button id="editBtn"><li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li></button>
                                <button class="delBtn"><li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li></button>
                                
                            </div>
                        </li>`;
      }
    });
  }
  taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length
    ? clearAll.classList.remove("active")
    : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}
showTodo("all");

// Checked off the task to check task is completed or not

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
    // decrease the count of task
    total.textContent = +total.textContent - 1;
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
    // increase the count of task
    total.textContent = +total.textContent + 1;
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
// Edit the task from list

function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}
//Delete the task

function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
  total.textContent = +total.textContent - 1;
}
