import R from "ramda"
import inferno from "inferno"
import box from "../box"

let todosLength
let __update = true

const { div, ul, li, span } = box

const Container = children =>
    div({ className: "panel panel-default" }, div({ className: "panel-body" }, children))

const List = children => ul(children)

const ListItem = ({ id, text }) => li({ key: id }, span(text))

const TodoList = todos => ul(box.todos.map(ListItem)) //R.compose(Container, List, R.map(ListItem))

export default box(Container, box.map(ListItem))

//TodoList

function TodoListBox(props) {
    if (props.todos.length !== todosLength) __update = true

    todosLength = props.todos.length

    if (!__update) return inferno.NO_OP

    console.log("i-no-op", { props })

    __update = false

    return box.todos(TodoList, props)
}
