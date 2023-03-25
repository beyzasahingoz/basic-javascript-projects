"use strict";

let taskList = [];

if (localStorage.getItem("taskList") !== null) {
    taskList = JSON.parse(localStorage.getItem("taskList"));
}

let editId;
let isEditTask = false;

const taskInput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span")

const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");

function formatTime(date) {
    const hrs12 = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const isAm = date.getHours() < 12;
    // 5 == 05
    return `${hrs12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${isAm ? "AM" : "PM"}`;
}

function formatDate(date) {
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}

setInterval(() => {
    const now = new Date();
    timeEl.textContent = formatTime(now);
    dateEl.textContent = formatDate(now);
}, 200);



displayTasks("all");

function displayTasks(filter) {
    let ul = document.getElementById("task-list");
    ul.innerHTML = "";

    if (taskList.length == 0) {
        ul.innerHTML = "<p class='p-3 m-0'>Empty Task List.</p>"
    } else {

        for (let task of taskList) {

            let completed = task.mode == "completed" ? "checked" : "";

            if (filter == task.mode || filter == "all") {

                let li = `
                            <li class="task list-group-item" style="background-color: #009578;>
                                <div class="form-check">
                                    <input type="checkbox" onclick="updateStatus(this)" id="${task.id}" class="form-check-input" ${completed}>
                                    <label for="${task.id}" class="form-check-label ${completed}">${task.taskName}</label>
                                </div>
                                <div class="dropdown">
                                    <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-ellipsis"></i>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Delete</a></li>
                                        <li><a onclick='editTask(${task.id}, "${task.taskName}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
                                    </ul>
                                </div>
                            </li>
                        `;
                ul.insertAdjacentHTML("beforeend", li);
            }

        }
    }
}

document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document.querySelector("#btnAddNewTask").addEventListener("keypress", function () {
    if (event.key == "Enter") {
        document.getElementById("btnAddNewTask").click();
    }
});

for (let span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    })
}

function newTask(event) {

    if (taskInput.value == "") {
        alert("You should enter a task");
    } else {
        if (!isEditTask) {
            // add
            taskList.push({ "id": taskList.length + 1, "taskName": taskInput.value, "mode": "pending" });
        } else {
            // update
            for (let task of taskList) {
                if (task.id == editId) {
                    task.taskName = taskInput.value;
                }
                isEditTask = false;
            }
        }
        taskInput.value = "";
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }

    event.preventDefault();
}

function deleteTask(id) {

    let deletedId;

    for (let index in taskList) {
        if (taskList[index].id == id) {
            deletedId = index;
        }
    }

    taskList.splice(deletedId, 1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("taskList", JSON.stringify(taskList));
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");

    console.log("edit id:", editId);
    console.log("edit mode", isEditTask);
}

btnClear.addEventListener("click", function () {
    taskList.splice(0, taskList.length);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTasks();
})

function updateStatus(selectedTask) {
    // console.log(selectedTask.parentElement.lastElementChild);
    let label = selectedTask.nextElementSibling;
    let mode;

    if (selectedTask.checked) {
        label.classList.add("checked");
        mode = "completed";
    } else {
        label.classList.remove("checked");
        mode = "pending";
    }

    for (let task of taskList) {
        if (task.id == selectedTask.id) {
            task.mode = mode;
        }
    }

    displayTasks(document.querySelector("span.active").id);

    localStorage.setItem("taskList", JSON.stringify(taskList));
}