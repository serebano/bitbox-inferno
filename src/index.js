import bitbox from "bitbox"
import createComponent from "./box"

import App from "./App"
import appStore from "./store"

import { render } from "inferno"

import "./index.css"
import "inferno-devtools"

const store = bitbox(appStore)
const foo = bitbox({ count: 1 })
const bar = bitbox({ count: 2 })
bitbox.count(
    {
        foo,
        bar,
        get count() {
            return this.foo.count + this.bar.count
        }
    },
    console.warn
)

bitbox(store, o => {
    if (o.count % 2) foo.count++
    else bar.count++
})

bitbox(
    { foo, bar },
    {
        get count() {
            return this.foo.count + this.bar.count
        }
    }
)

bitbox(() => console.log(`${foo.count} | ${bar.count}`))

Object.assign(window, { bitbox, store })

store.date = bitbox(date => {
    render(<div>{date.now}</div>, document.getElementById("time"))
    setTimeout(() => (date.now = Date.now()))
})

render(<App store={store} />, document.getElementById("app"))

// setInterval(() => store.count++)
// store.name = `box - ${store.count}`
