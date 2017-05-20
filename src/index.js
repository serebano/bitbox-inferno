import { render } from "inferno"
import App from "./App"
import "./index.css"
import * as app from "./box"

Object.assign(window, app)
//render(<App />, document.getElementById("app"))
