var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");

formEl.addEventListener("submit", createTaskHandler);

function createTaskHandler(event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskAsigneeInput = document.querySelector("select[name='task-assignee']").value;
    
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    
    //create Div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-assignee'>" + taskAsigneeInput + "</span>";

    //add the div to the list item
    listItemEl.appendChild(taskInfoEl);

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
}
