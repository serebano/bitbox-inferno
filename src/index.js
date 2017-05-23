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

const index = tags(h)
const store = bitbox(appStore)
store.nodes = []
const foo = bitbox({
    count: 0
})
const bar = bitbox({ count: 0 }, operators.print)

function isObjectShallowModified(prev, next) {
    if (null == prev || null == next || typeof prev !== "object" || typeof next !== "object") {
        return prev !== next
    }
    const keys = Object.keys(prev)
    if (keys.length !== Object.keys(next).length) {
        return true
    }

    for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i]
        if (next[key] !== prev[key]) {
            return true
        }
    }
    return false
}

let isUsingStaticRendering = false
export function useStaticRendering(useStaticRendering) {
    isUsingStaticRendering = useStaticRendering
}

function createObserver(component) {
    class observerComponent extends Component {
        componentWillMount() {
            if (isUsingStaticRendering === true) return
            /**
		 * If props are shallowly modified, react will render anyway,
		 * so atom.reportChanged() should not result in yet another re-render
		 */
            let skipRender = false
            /**
		 * forceUpdate will re-assign this.props. We don't want that to cause a loop,
		 * so detect these changes
		 */
            let isForcingUpdate = false
            const Atom = bitbox
            function makePropertyObservableReference(propName) {
                let valueHolder = this[propName]
                const atom = new Atom("reactive " + propName)
                Object.defineProperty(this, propName, {
                    configurable: true,
                    enumerable: true,
                    get() {
                        atom.reportObserved()
                        return valueHolder
                    },
                    set(v) {
                        if (!isForcingUpdate && isObjectShallowModified(valueHolder, v)) {
                            valueHolder = v
                            skipRender = true
                            atom.reportChanged()
                            skipRender = false
                        } else {
                            valueHolder = v
                        }
                    }
                })
            }

            // make this.props an observable reference, see #124
            //makePropertyObservableReference.call(this, "props")
            // make state an observable reference
            //makePropertyObservableReference.call(this, "state")

            // wire up reactive render
            const baseRender = this.render.bind(this)

            let $observer
            let isRenderingPending = false

            const reactiveRender = (props, state, context) => {
                isRenderingPending = false
                let rendering
                $observer = bitbox(() => {
                    rendering = baseRender(props, state, context)
                })

                return rendering
            }

            const initialRender = () => {
                if (!isRenderingPending) {
                    isRenderingPending = true
                    if (typeof this.componentWillReact === "function") this.componentWillReact() // TODO: wrap in action?
                    if (this.__isUnmounted !== true) {
                        let hasError = true
                        try {
                            isForcingUpdate = true
                            if (!skipRender) Component.prototype.forceUpdate.call(this)
                            hasError = false
                        } finally {
                            isForcingUpdate = false
                            if (hasError) $observer.off()
                        }
                    }
                }
                reactiveRender.$observer = $observer
                this.render = reactiveRender

                return reactiveRender(this.props, this.state, this.context)
            }

            this.render = initialRender
        }
        componentWillUnmount() {
            if (isUsingStaticRendering === true) return

            this.render.$observer && this.render.$observer.off()
            this.__IsUnmounted = true
        }
        shouldComponentUpdate() {
            return false
        }
        render(props, state, context) {
            return component(props, context)
        }
    }

    observerComponent.isObserver = true
    observerComponent.displayName = `${component.name}`

    return observerComponent
}

const box = factory(function box(path, ...rest) {
    //store.nodes.push({ path, rest })

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

const { div, section, h1, h2, h3, ul, li, b } = box
const title = h1

const app = bitbox({
    counters: [foo, bar, { count: 10 }, { count: 20 }]
})

function addCounter(target) {
    target.push({ count: 0 })
}

function inc(target) {
    target.count++
}
function run(target) {
    target.id = target.id ? clearInterval(target.id) : setInterval(() => target.count++)
}
function reset(target) {
    target.count = 0
}
function remove(counter) {
    const index = app.counters.indexOf(counter)
    console.log(`remove`, index, counter)
    app.counters.splice(index, 1)
}

function Counter({ counter }, context) {
    return (
        <div style={{ border: "2px solid #c00" }}>
            {title(`Count [${counter.count}]`)}
            <button onClick={linkEvent(counter, inc)}>inc()</button>
            <button onClick={linkEvent(counter, run)}>run()</button>
            <button onClick={linkEvent(counter, reset)}>reset</button>
            <button onClick={linkEvent(counter, remove)}>remove</button>
        </div>
    )
}

function Counters() {
    return (
        <section id="counters">
            <button onClick={linkEvent(app.counters, addCounter)}>Add</button>
            <div>
                {app.counters.map(counter =>
                    box(Counter, {
                        counter
                    })
                )}
            </div>
        </section>
    )
}

function ExampleComponent(props) {
    return h(".example", [
        h(
            "a.example-link",
            {
                href: "#"
            },
            ["Hello ", props.name, "!"]
        )
    ])
}

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

class Time {
    time = Date.now()
    constructor(box, props) {
        this.props = Object.assign({ ms: 1000, color: "grey", el: "#a", key: "localeTime" }, props)

        return box(this, function TimeBox(time) {
            render(
                <h1
                    style={{
                        color: time.props.color
                    }}>
                    {time[time.props.key]}
                </h1>,
                document.querySelector(time.props.el)
            )
            if (!time.timer) time.toggle()
        })
    }
    toggle() {
        this.timer = this.timer
            ? clearInterval(this.timer)
            : setInterval(() => {
                  this.time = Date.now()
              }, this.props.ms)
    }
    get localeTime() {
        return new Date(this.time).toLocaleTimeString()
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

function TimeView() {
    return <h3>{time.localeTime}</h3>
}

function addCounter() {
    return box.button(
        {
            onClick() {
                app.counters.push({ count: app.counters.length })
            }
        },
        `Add Counter #${app.counters.length}`
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
        box(addCounter),
        box(Counter, {
            counter: foo
        }),
        box(TimeView),
        box(ExampleComponent, {
            name: store.name
        })
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
