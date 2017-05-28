/** @jsx bx */
import bitbox, { resolve } from "bitbox"
import * as bb from "bitbox"
import inferno from "inferno"
import box, { map, create } from "./box"
import Counter, { start, stop } from "./components/counter"
import Counters from "./components/counters"
//import "inferno-devtools"
const { section, strong, span, div, u, h2, h3, pre, button, h1, ul, li, link } = box

const app = bitbox({
    title: `Demo app`
})

const items = bitbox([])
const timers = bitbox([])
const trybox = bitbox({})

//app.deep = { items, timers, trybox }

function App() {
    return section(h1(app.title), Counters(items))
}

const render = (vnode, selector) => inferno.render(vnode, document.querySelector(selector))

const x = bitbox(() => {
    const vnode = App()
    render(vnode, `#app`)
    return vnode
})

//bitbox(items, items => items.map(start))

// , function(target) {
//     const a = target.someValue
//     const b = ["myaccount", "history", "items", 0].reduce((o, k) => o && o[k], target)
//     const c = Object.keys(target)
//     const paths = this.paths.map(path => path.join("."))
//     const mapped = box.map(target, {
//         observers: box.get(target),
//         get keys() {
//             return Object.keys(this)
//         }
//     })
//     print({ target, paths, a, b, c, mapped })
//
//     return { a, b, c }
// })

Object.assign(window, bb.operators, bb, {
    x,
    trybox,
    bitbox,
    inferno,
    items,
    items,
    render,
    box,
    App,
    app,
    create,
    Counter
})
