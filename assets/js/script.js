var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

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

    var isEdit = formEl.hasAttribute("data-task-id");

    if(isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskAsigneeInput, taskId);
    }
    else {
        var taskDataObj = {
            name: taskNameInput,
            assignee: taskAsigneeInput,
            status: "to do"
        };
        
        createTaskEl(taskDataObj);
    }
    
}

function createTaskEl(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    
    //create Div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-assignee'>" + taskDataObj.assignee + "</span>";

    //add the div to the list item
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks();

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskIdCounter++;
};
;
function createTaskActions(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for(var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }


    return actionContainerEl;
}

function taskButtonHandler(event) {
    var targetEl = event.target;

    if(targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    if(targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}

function editTask(taskId) {
    console.log("editing task # " + taskId);
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskAssignee = taskSelected.querySelector("span.task-assignee").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-assignee']").value = taskAssignee;

    document.querySelector("#save-task").textContent = "Save Chore";

    formEl.setAttribute("data-task-id", taskId);

}

function completeEditTask(taskName, taskAssignee, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-assignee").textContent = taskAssignee;

    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].assignee = taskAssignee;
        }
    }

    saveTasks();
    //alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Chore";

}

function deleteTask(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks = updatedTaskArr;

    saveTasks();
}

function taskStatusChangeHandler(event) {
    //get the task items id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if(statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }

   else if(statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }

    else if(statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for (var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    //get tasks from localstorage
    //convert tasks from string back to array
    //iterates through a task array and creates task elements on the page from it

    tasks = localStorage.getItem("tasks");
    if (!tasks) {
        tasks = [];
        return false;
    }
    tasks = JSON.parse(tasks);
    console.log(tasks);

    for(i = 0; i < tasks.length; i++) {
        tasks[i].id = taskIdCounter;
        listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-assignee'>" + tasks[i].assignee + "</span>";
        listItemEl.appendChild(taskInfoEl);
        taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);

        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "completed") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }
        taskIdCounter++;
        console.log(listItemEl);

    }
}

loadTasks();
