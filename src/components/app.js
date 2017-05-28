import r from "ramda"
import inferno from "inferno"
import box from "../box"
import h from "inferno-hyperscript"

const container = children =>
    box.div({ className: "panel panel-default" }, box.div({ className: "panel-body" }, children))

function Title(value) {
    return box.h1({ style: { color: "#555" } }, value)
}

const title = r.curry(props => box.h1({ style: { color: "#555" } }, props.apptitle))
const Timer = box.secondsElapsed(value => box.div(`seconds elapsed: `, value))

const Todo = ({ id, text }) => box.li({ key: id }, box.span(id), `-`, box.strong(text))
const Todos = box.todos(box.ul, box.map(Todo))

function App(props) {
    return box.div(box(title, props), box(Timer, props), box(Todos, props))
}
App.Timer = Timer
App.boxes = { Title, Timer, Todo, Todos, container }
export default App
