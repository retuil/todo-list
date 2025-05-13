function createElement(tag, attributes, children, events) {
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
        this.state = {
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
        this.update();
    }

    onMarkedDone(index) {
        console.log(index);
        this.state.todos[index].done = !this.state.todos[index].done;
        this.update();
    }

    onDeleteTask(index) {
        this.state.todos.splice(index, 1);
        this.update();
    }

    render() {
        const todoItems = this.state.todos.map((todo, index) =>
            createElement("li", {
                class: todo.done ? ["completed"] : []
            }, [
                createElement("input", todo.done ? {
                    type: "checkbox",
                    checked: "",
                } : {
                    type: "checkbox",
                }, [], {
                    change: () => this.onMarkedDone(index),
                }),
                createElement("label", {}, todo.text),
                createElement("button", {}, "🗑️", {
                    click: () => this.onDeleteTask(index),
                }),
            ])
        );

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
        this.update();
    }

    render() {
        return createElement("div", {class: "add-todo"}, [
            createElement("input", {
                    id: "new-todo",
                    type: "text",
                    placeholder: "Задание",
                    value: this.state.currentInput,
                },
                [],
                {
                    input: this.onAddInputChange.bind(this),
                }
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
