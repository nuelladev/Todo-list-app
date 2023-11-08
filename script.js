function getImagePath(imageName) {
    // Check if we're running on GitHub Pages
    if (window.location.hostname === 'nuelladev.github.io') {
        // If on GitHub Pages, adjust the path accordingly
        return '/Todo-list-app/Assets/images/' + imageName;
    } else {
        // If running locally, use the local path
        return './Assets/images/' + imageName;
    }
}

const toggleSwitch = document.querySelector(".theme-switch-wrapper");
const body = document.querySelector("body");
const themeIcon = document.querySelector("#icon");
const headerImg = document.querySelector("#hero");

// Set the initial theme based on local storage or default
const currentTheme = localStorage.getItem("theme") || "light"; 
body.setAttribute("data-theme", currentTheme);
if (currentTheme === "dark") {
    themeIcon.src = getImagePath("icon-sun.svg");
} else {
    themeIcon.src = getImagePath("icon-moon.svg");
}

function setTheme() {
    darkMode();
    setHeaderImg();
}

function setHeaderImg() {
    if (body.getAttribute("data-theme") === "dark") {
        headerImg.style.backgroundImage = `url('${getImagePath("bg-mobile-dark.jpg")}')`;
    } else {
        headerImg.style.backgroundImage = `url('${getImagePath("bg-desktop-light.jpg")}')`;
    }
}

function darkMode() {
    const currentTheme = body.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeIcon.src = getImagePath(isDark ? "icon-sun.svg" : "icon-moon.svg");
    localStorage.setItem('theme', body.getAttribute('data-theme'));
}

toggleSwitch.addEventListener("click", setTheme);

const list = document.querySelector(".list");
const toDoText = document.querySelector(".todo-text");
let doneBtns = document.querySelectorAll(".checkBtn");
const noTasksLeft = document.querySelector("#noTasksLeft");
const remove = document.querySelectorAll(".remove");

let tasks = [];
let completedTasks = [];

toDoText.addEventListener("change", createToDo);

function createToDo(e) {
    let toDoVal = e.target.value;
    if (toDoVal.trim() === "") {
        alert("Please enter a task");
    } else {
        const toDo = document.createElement("li");
        toDo.classList.add("task");
        toDo.innerHTML = `
            <button class="checkBtn">
                <img id="checkIcon" src="${getImagePath("icon-check.svg")}" alt="check-icon"/>
            </button>
            <span class="toDoText break-word">${toDoVal}</span>
            <img alt="remove" class="remove" src="${getImagePath("icon-cross.svg")}">
        `;
        list.appendChild(toDo);
        e.target.value = "";
        tasks.push(toDo);
        bindRemove(toDo.querySelector(".remove"));
        bindDone(toDo.querySelector(".checkBtn"));
        updateTaskCount();
        addDragandDrop(toDo);
    }
}

function bindRemove(btn) {
    btn.addEventListener("click", () => {
        const mainPar = btn.parentElement;
        mainPar.remove();
        tasks = tasks.filter(task => task !== mainPar);
        completedTasks = completedTasks.filter(task => task !== mainPar);
        updateTaskCount();
    });
}

function bindDone(btn) {
    const checkIcon = btn.querySelector("#checkIcon");
    btn.addEventListener("click", () => {
        const mainPar = btn.parentElement;
        btn.classList.toggle("checked");
        checkIcon.style.display = "block";
        mainPar.classList.toggle("completed");
        if (mainPar.classList.contains("completed")) {
            completedTasks.push(mainPar);
        } else {
            completedTasks = completedTasks.filter(task => task !== mainPar);
        }
        updateTaskCount();
    });
}

remove.forEach(bindRemove);
doneBtns.forEach(bindDone);

const clearComplete = document.querySelector("#clr-completed");
clearComplete.addEventListener("click", () => {
    const allTasks = document.querySelectorAll(".task");
    allTasks.forEach(task => {
        if (task.classList.contains("completed")) {
            task.remove();
        }
    });
    tasks = tasks.filter(task => !task.classList.contains("completed"));
    completedTasks = [];
    updateTaskCount();
});

const itemsLeft = document.querySelector("#items-left");
function updateTaskCount() {
    let activeTasks = tasks.length - completedTasks.length;
    itemsLeft.textContent = `${activeTasks} items left`;
    noTasksLeft.style.display = activeTasks === 0 ? "block" : "none";
}

const category = document.querySelectorAll(".category");
category.forEach(cat => {
    cat.addEventListener("click", (e) => {
        category.forEach(c => c.classList.remove("active"));
        cat.classList.add("active");
        showCat(cat.id);
    });
});

function showCat(attr) {
    tasks.forEach(task => {
        if (attr === "all") {
            task.style.display = "flex";
        } else if (attr === "active" && !task.classList.contains("completed")) {
            task.style.display = "flex";
        } else if (attr === "completed" && task.classList.contains("completed")) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
}

function addDragandDrop(task) {
    task.setAttribute("draggable", true);
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragenter', cancelDefault);
    task.addEventListener('dragover', cancelDefault);
}

list.addEventListener("drop", dropped);
list.addEventListener("dragenter", cancelDefault);
list.addEventListener("dragover", cancelDefault);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', tasks.indexOf(e.target));
}

function dropped(e) {
    cancelDefault(e);
    let oldIndex = e.dataTransfer.getData('text/plain');
    let target = e.target.closest('.task');
    let newIndex = Array.prototype.indexOf.call(list.children, target);
    let dropped = tasks[oldIndex];
    list.removeChild(dropped);
    tasks.splice(oldIndex, 1);
    tasks.splice(newIndex, 0, dropped);
    list.insertBefore(dropped, newIndex < oldIndex ? target : target.nextSibling);
}

function cancelDefault(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

// Update the done buttons and remove buttons after initial page load
doneBtns = document.querySelectorAll(".checkBtn");
remove = document.querySelectorAll(".remove");
remove.forEach(bindRemove);
doneBtns.forEach(bindDone);
