import r from "ramda"
import bitbox, { factory, resolve, curry } from "bitbox"
import inferno from "inferno"
import box from "./box"
import App from "./components/app"
import "inferno-devtools"
import h from "inferno-hyperscript"
import tags from "./tags"
const tag = tags(h)

const render = curry((fn, sel, props) => inferno.render(h(fn, props), document.querySelector(sel)))

box.render = curry((box, fn, sel, props) =>
    inferno.render(h(fn, resolve(props, box.$)), document.querySelector(sel))
)

const state = bitbox(
    {
        apptitle: "Demo",
        secondsElapsed: 0,
        todos: [
            {
                id: 1,
                text: "Buy milk"
            },
            {
                id: 2,
                text: "Go running"
            },
            {
                id: 3,
                text: "Rest"
            }
        ],
        addTodo(text) {
            return this.todos.push({ text, id: this.todos.length })
        }
    }
    //render(App, "#app")
)

bitbox(state, render(box.secondsElapsed(tag.h1), `#a`))

const Todo = ({ id, text }) => box.li({ key: id }, box.span(id), `-`, box.strong(text))
const Todos = box.todos(box.ul, box.map(curry(p => box(Todo, p))))

bitbox(state, render(Todos, `#app`))

const a = bitbox({ count: 1 }, box.render(box.count(tag.section, tag.h1, tag.u), "#b"))

a.count++

setInterval(() => {
    state.secondsElapsed++
    a.count++
}, 1000)

window.tag = tag
window.state = state
window.App = App
