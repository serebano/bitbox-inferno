import { observable } from "bitbox"
import App from "./App"
import "todomvc-app-css/index.css"

const initialState = [
    {
        text: "Use nx-observe",
        completed: false,
        id: 0
    }
]

ReactDOM.render(<App todos={observable(initialState)} />, document.getElementById("app"))
