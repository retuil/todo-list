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
}

class TodoList extends Component {
    constructor() {
        super();
        this.state = {
            todos: [
                {text: "Сделать домашку"},
                {text: "Сделать практику"},
                {text: "Пойти домой"},
            ],
            currentInput: '',
        };
    }

    onAddTask() {
        this.state.todos.push({text: this.state.currentInput});
    }

    onAddInputChange(event) {
        this.state.currentInput = event.target.value;
    }

    render() {
        const todoItems = this.state.todos.map((todo) =>
            createElement("li", {}, [
                createElement("input", {type: "checkbox"}),
                createElement("label", {}, todo.text),
                createElement("button", {}, "🗑️"),
            ])
        );

        return createElement("div", {class: "todo-list"}, [
            createElement("h1", {}, "TODO List"),
            createElement("div", {class: "add-todo"}, [
                createElement("input", {
                        id: "new-todo",
                        type: "text",
                        placeholder: "Задание",
                    },
                    {
                        input: this.onAddInputChange.bind(this),
                    }
                ),
                createElement("button", {id: "add-btn"}, "+", {
                    click: this.onAddTask.bind(this),
                }),
            ]),
            createElement("ul", {id: "todos"}, todoItems),
        ]);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(new TodoList().getDomNode());
});
