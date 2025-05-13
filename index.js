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
            currentInput: '',
        };
    }

    onAddTask() {
        this.state.todos.push({text: this.state.currentInput, done: false});
        this.update();
    }

    onAddInputChange(event) {
        console.log('b', this.state.currentInput);
        this.state.currentInput = event.target.value;
        console.log('a', this.state.currentInput);
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
            createElement("div", {class: "add-todo"}, [
                createElement("input", {
                        id: "new-todo",
                        type: "text",
                        placeholder: "Задание",
                        value: this.state.currentInput,
                    },
                    {},
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
