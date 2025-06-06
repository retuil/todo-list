﻿function createElement(tag, attributes, children, events) {
    const element = document.createElement(tag);

    if (attributes) {
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
    }

    if (events) {
        Object.keys(events).forEach((eventName) => {
            element.addEventListener(eventName, events[eventName]);
        });
    }

    if (Array.isArray(children)) {
        children.forEach((child) => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    } else if (typeof children === "string") {
        element.appendChild(document.createTextNode(children));
    } else if (children instanceof HTMLElement) {
        element.appendChild(children);
    }

    return element;
}

class Component {
    constructor() {
    }

    getDomNode() {
        this._domNode = this.render();
        return this._domNode;
    }

    update() {
        const newNode = this.render();
        this._domNode.replaceWith(newNode);
        this._domNode = newNode;
    }
}

class TodoList extends Component {
    constructor() {
        super();
        this.state = this.loadState() || {
            todos: [
                {text: "Сделать домашку", done: false},
                {text: "Сделать практику", done: false},
                {text: "Пойти домой", done: false},
            ],
        };
        this.addTaskComponent = new AddTask(this.onAddTask.bind(this));
    }

    onAddTask(text) {
        this.state.todos.push({text, done: false});
        this.saveState();
        this.update();
    }

    onMarkedDone(index) {
        this.state.todos[index].done = !this.state.todos[index].done;
        this.saveState();
        this.update();
    }

    onDeleteTask(index) {
        if (this.state.todos.at(index).isTriedDelete) {
            this.state.todos.splice(index, 1);
        } else {
            this.state.todos.at(index).isTriedDelete = true;
        }
        this.saveState();
        this.update();
    }

    saveState() {
        localStorage.setItem("todo-list-state", JSON.stringify(this.state));
    }

    loadState() {
        const data = localStorage.getItem("todo-list-state");
        return data ? JSON.parse(data) : null;
    }

    render() {
        const todoItems = this.state.todos
            .map(
                (todo, index) =>
                    new Task(
                        todo,
                        () => this.onMarkedDone.bind(this)(index),
                        () => this.onDeleteTask.bind(this)(index)).getDomNode());

        return createElement("div", {class: "todo-list"}, [
            createElement("h1", {}, "TODO List"),
            this.addTaskComponent.getDomNode(),
            createElement("ul", {id: "todos"}, todoItems),
        ]);
    }
}

class AddTask extends Component {
    constructor(onAddTask) {
        super();
        this.onAddTask = onAddTask;
        this.state = {
            currentInput: '',
        };
    }

    onAddInputChange(event) {
        this.state.currentInput = event.target.value;
        this._inputFocused = document.activeElement === event.target;
        this.update();
        if (this._inputFocused) {
            this.focusInput();
        }
    }

    focusInput() {
        const input = this._domNode.querySelector('#new-todo');
        if (input) {
            input.focus();
            input.selectionStart = input.selectionEnd = input.value.length;
        }
    }

    render() {
        return createElement("div", {class: "add-todo"}, [
            createElement(
                "input",
                {
                    id: "new-todo",
                    type: "text",
                    placeholder: "Задание",
                    value: this.state.currentInput,
                },
                [],
                {input: this.onAddInputChange.bind(this),}
            ),
            createElement("button", {id: "add-btn"}, "+", {
                click: () => this.onAddTask(this.state.currentInput),
            }),
        ]);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(new TodoList().getDomNode());
});

class Task extends Component {
    constructor(todo, onMarkedDone, onDeleteTask) {
        super();
        this.todo = todo;
        this.onMarkedDone = onMarkedDone;
        this.onDeleteTask = onDeleteTask;
    }

    render() {
        return createElement(
            "li",
            {class: this.todo.done ? ["completed"] : []},
            [
                createElement(
                    "input",
                    this.todo.done ? {type: "checkbox", checked: "",} : {type: "checkbox",},
                    [],
                    {change: () => this.onMarkedDone(),}),
                createElement("label", {}, this.todo.text),
                createElement(
                    "button",
                    {class: this.todo.isTriedDelete ? "confirm-delete" : "",},
                    "🗑️",
                    {click: () => this.onDeleteTask(),}),
            ])
    }
}