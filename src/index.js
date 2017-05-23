/** @jsx bx */
import bitbox, { is, factory, operators } from "bitbox"
import Inferno, { render, linkEvent } from "inferno"
import Component from "inferno-component"
import createElement from "inferno-create-element"
import h from "inferno-hyperscript"
import { isVNode } from "inferno-test-utils"

import * as bb from "bitbox"
import appStore from "./store"
import "./index.css"
import "inferno-devtools"
import tags from "./tags"
import infernoBox from "./box"
import createComponent from "./createComponent"

const index = tags(h)
const store = bitbox(appStore)

store.nodes = []

const foo = bitbox({
    count: 0
})

const bar = bitbox({ count: 0 }, operators.print)

const box = factory(function box(path, ...rest) {
    const ext = !path.length
        ? is.func(rest[0]) && !rest[0].isObserver && rest.shift()
        : path[path.length - 1]

    if (is.func(ext) && !ext.isObserver) {
        if (ext.tagName) return Reflect.get(index, ext.tagName)
        const tagName = (ext.tagName = ext.name.toLowerCase())
        const component = infernoBox(ext) //createObserver(ext)
        component.isObserver = true
        component.tagName = tagName
        console.log(`component`, component)
        Reflect.set(index, tagName, component)

        const [props, ...children] = rest
        if (!is.object(props) || isVNode(props)) return createElement(component, {}, ...rest)

        return createElement(component, props, ...rest)
    }

    if (!path.length) {
        return createElement(...rest)
    }

    const [props, ...children] = rest
    if (!is.object(props) || isVNode(props)) return createElement(path.join("."), {}, ...rest)

    return createElement(path.join("."), props, ...children)
})

const { div, section, h1, h2, h3, ul, li, b, input, button } = box

const app = bitbox({
    counters: [foo, bar, { count: 10 }, { count: 20 }]
})

function Timer(box, ...args) {
    const timer = (box.timer = {
        start: Date.now(),
        current: Date.now(),
        get elapsedTime() {
            return this.current - this.start + " seconds"
        },
        tick() {
            this.current = Date.now()
        }
    })
    const observer = this
    return props => {
        operators.print({ box, timer, args, props, observer })
        observer.reload(function reloaded() {
            render(
                h(
                    "pre",
                    null,
                    operators.stringify(4)({
                        observer: { name: observer.name, changes: observer.changes },
                        box,
                        args,
                        props
                    })
                ),
                document.querySelector("#a")
            )
        })
        setInterval(() => timer.tick(), 1000)
    }
}

const time = new bitbox(Time, {
    color: "red",
    key: "time",
    ms: 1
})

new bitbox(Time, {
    el: "#b",
    color: "green"
})

function setName(target, e) {
    target.name = e.target.value
}

function ExampleComponent() {
    return div(
        h1("Hello ", store.name, "!"),
        input({
            value: store.name,
            onInput: linkEvent(store, setName)
        })
    )
}

function TimeView() {
    return <h3>{time.localeTime}</h3>
}

function actionButton(target, action, label) {
    return button({ onClick: linkEvent(target, action) }, label)
}

function addCounter(counters) {
    return div(
        actionButton(
            counters,
            target => target.push({ id: target.length, count: target.length }),
            `add counter`
        ),
        actionButton(counters, target => target.pop(), `pop counter`)
    )
}

function App({ store }) {
    return section(
        {
            style: {
                background: store.bg || `#f4f4f4`,
                padding: 24
            }
        },
        h1(`App ${app.counters.length}`),
        box(addCounter),
        box(Counter, {
            key: app.counters[0].id,
            counter: app.counters[0]
        }),
        box(TimeView),
        box(ExampleComponent)
    )
}

bitbox(store, function AppObserver(store) {
    render(box(App, { store }), document.querySelector("#app"))
})

// bitbox(app.counters, function Demo(counters) {
//     render(
//         section(
//             h3(`Counters - `, counters.length),
//             ul(counters.map((counter, key) => box(Counter, { key, counter })))
//         ),
//         document.querySelector(`#c`)
//     )
// })

Object.assign(window, operators, bb, index, {
    h,
    index,
    Timer,
    app,
    TimeView,
    time,
    Time,
    Counter,
    bitbox,
    store,
    render,
    operators,
    bb,
    appStore,
    foo,
    bar,
    inc,
    createObserver,
    box
})
