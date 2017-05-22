import bitbox, { operators } from "bitbox"
import * as bb from "bitbox"

import inferno, { Provider } from "./box"
import App, { Count } from "./App"
import appStore from "./store"
import Inferno, { version } from "inferno"
import Component from "inferno-component"
import "./index.css"
import { inc } from "./actions"

import "inferno-devtools"
const render = (com, sel) => Inferno.render(com, document.querySelector(sel))

const store = bitbox({
    name: "bitbox app",
    count: 0,
    inc
})

const foo = bitbox.count(0, {
    inc,
    run() {
        this.id = setInterval(() => this.inc())
    }
})
const bar = bitbox.count(0, operators.print)

const clock = bitbox.localeTime(
    {
        time: Date.now(),
        start() {
            this.timer = setInterval(() => {
                this.time = Date.now()
            }, 1000)
        },
        stop() {
            clearInterval(this.timer)
        },
        get localeTime() {
            return new Date(this.time).toLocaleTimeString()
        }
    },
    operators.print
)

function ibox(component) {
    return class extends Component {
        static displayName = `box(${component.name})`
        componentWillMount() {
            const render = this.render
            this.render = (...args) => {
                let result
                bitbox(this.props.props || {}, props => {
                    if (!props.mounted) {
                        props.mounted = true
                        result = component(props) //render.apply(this, args)
                        this.render = () => component(props) //render
                    } else {
                        this.forceUpdate()
                    }
                })
                return result
            }
        }
        shouldComponentUpdate() {
            return false
        }
    }
}

const C2 = ibox(function Count(props) {
    return (
        <div style={{ border: "2px solid #c00" }}>
            <div>Count [{props.count}]</div>
            <button onClick={() => props.inc()}>inc()</button>
            <button onClick={() => props.run()}>run()</button>
            <button onClick={() => (props.count = 0)}>reset</button>
        </div>
    )
})

const Clock = ibox(function Clock() {
    return (
        <div>
            <h4>{clock.localeTime}</h4>
        </div>
    )
})

const createCounter = (count = 0) => {
    return {
        count,
        inc,
        run() {
            this.id = setInterval(() => this.inc())
        }
    }
}
const app = bitbox.counters([createCounter(), createCounter()])

const Counters = ibox(function Counters() {
    return (
        <div>
            <button onClick={() => app.counters.push(createCounter())}>Add</button>
            {app.counters.map(counter => <C2 props={counter} />)}
        </div>
    )
})
function Main() {
    return (
        <section>
            <Clock />
            <Counters />
        </section>
    )
}
//const Clocko = bitbox(Clock)
Inferno.render(<Main />, document.getElementById("app"))

clock.start()
Object.assign(window, operators, bb, {
    App,
    createCounter,
    app,
    Clock,
    clock,
    Count,
    bitbox,
    store,
    operators,
    bb,
    appStore,
    foo,
    bar,
    inc,
    render,
    inferno,
    Provider
})

// render(<Provider store={store}><App /></Provider>, "#app")
//
// render(
//     <Provider store={foo}>
//         <Count />
//     </Provider>,
//     "#time"
// )

//operators.print(foo.$)

// setInterval(() => store.count++)
// store.name = `box - ${store.count}`
