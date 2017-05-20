import { observable } from "bitbox"
import { render } from "inferno"
import App from "./App"
import "./index.css"
import appStore from "./store"

const store = observable(appStore)

Object.assign(window, { appStore, store })

require("inferno-devtools")
render(<App store={store} />, document.getElementById("app"))

setInterval(() => store.count++)
store.name = `box - ${store.count}`
