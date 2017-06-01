import r from "ramda"
import bitbox, {
    __,
    observe,
    box,
    view,
    factory,
    resolve,
    curry,
    map,
    curryN,
    compose,
    project
} from "bitbox"
import inferno from "inferno"
import h from "inferno-hyperscript"
import tag from "./tag"
import Counter from "./components/counter"
import Pure from "./components/pure"

import * as ic from "incompose"
//import "inferno-devtools"
import createElement from "inferno-create-element"

const render = curry((fn, sel, props) =>
    observe(() => inferno.render(tag(fn, props), document.querySelector(sel)))
)

const state = bitbox({
    title: "Demo",
    secondsElapsed: 0,
    counters: []
})
state.counters.push({ value: state.counters.length })

function Timer(props) {
    return tag.div(tag.h4(props.value))
}

function Container(items) {
    return tag.ul(
        {
            style: {
                background: `#eee`,
                border: `1px solid #444`,
                boxShadow: `0 0 16px #aaa`,
                padding: 0
            }
        },
        items
    )
}

const Counters = compose(Container, box.counters(map(item => tag(Counter, item))))

function App({ state }) {
    return (
        <section>
            <Timer value={state.secondsElapsed} />
            <Counter value={state.secondsElapsed} />
        </section>
    )
}

//render(App, "#app")(state)

observe(() => inferno.render(<App state={state} />, document.querySelector(`#app`)))

// createElement(ic.compose(ic.pure)(props => createElement("h1", null, props.value)), {
//     value: 1
// }),

setInterval(() => {
    state.secondsElapsed++
}, 500)

window.tag = tag
window.state = state
window.render = render
window.Counter = Counter
window.Counters = Counters
