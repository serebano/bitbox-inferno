import bitbox from "bitbox"
import inferno from "./box"
import App from "./App"
import appStore from "./store"
import { render } from "inferno"
import "./index.css"
import "inferno-devtools"

const store = bitbox(appStore)

const foo = bitbox({ count: 1 })
const bar = bitbox({ count: 2 })

const counter = {}
// bitbox(
//     console.log,
//     function Counter(props) {
//         return (
//             <section>
//                 <h1>{props.count}</h1>
//                 <button onClick={props.inc}>inc</button>
//             </section>
//         )
//     },
//     foo
// )

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

Object.assign(window, { bitbox, store, counter })

// obj = { count: 0 }
// app = bitbox.count(obj, console.warn)
// app.count++

const box = bitbox.count(0, count => {
    render(<h1>{count}</h1>, document.getElementById("time"))
})

box.int = setInterval(() => (box.count < 100 ? box.count++ : clearInterval(box.int)))

render(<App store={store} />, document.getElementById("app"))

// setInterval(() => store.count++)
// store.name = `box - ${store.count}`
