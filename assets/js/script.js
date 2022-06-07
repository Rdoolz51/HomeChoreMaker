var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");

formEl.addEventListener("submit", taskFormHandler);

function taskFormHandler(event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskAsigneeInput = document.querySelector("select[name='task-assignee']").value;

    //check to see if both fields of the form are filled out.
    if(!taskNameInput || !taskAsigneeInput) {
        alert("You need to fill out both fields.");
        formEl.reset();
        return false;
    }
    else if (taskNameInput == " " || taskNameInput == "  ") {
        alert("You Left The Task Name Blank, Please Give Your Task A Name!");
        formEl.reset();
        return false;
    }

    formEl.reset();

    var taskDataObj = {
        name: taskNameInput,
        assignee: taskAsigneeInput
    };

    createTaskEl(taskDataObj);
    
}

function createTaskEl(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    
    //create Div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-assignee'>" + taskDataObj.assignee + "</span>";

    //add the div to the list item
    listItemEl.appendChild(taskInfoEl);

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
}
