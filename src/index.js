import r from "ramda"
import createComponent from "./createComponent"
import Component from "inferno-component"
import bitbox, { observable, box, factory, is } from "bitbox"
import * as $ from "bitbox"
import inferno, { linkEvent } from "inferno"
import createElement from "inferno-create-element"
import h from "inferno-hyperscript"
import tag from "./tag"
import infernoMobx from "inferno-mobx"
import Input from "./components/input"
import easyState from "./easy-state"
import { ComponentObserve, componentObserve } from "./componentObserve"
import inject from "./inject"
import Provider from "./Provider"
import "inferno-devtools"
//import "./components/mobx"

import Observe from "./state-demo/observer"
//import "todomvc-app-css/index.css"

const foo = observable({
    name: `Foo Store`,
    count: 0
})

const bar = observable({
    name: `Bar Store`,
    count: 0
})

const todos = observable([
    {
        text: "Use nx-observe",
        completed: false,
        id: 0
    }
])
const Todos = componentObserve(function TodosX(props, context) {
    console.log(`Todos()`, { props, context })
    return <h1>Todos</h1>
})

const render = (node, sel) => inferno.render(node, document.querySelector(sel))
const Title = () => <h1>{bar.name}</h1>

const Demo = ({ state }) => {
    console.log(`demo-render`, { state })
    return (
        <div>
            <h1>{state.name} - {state.count}</h1>
            <button onClick={() => state.count++}>Inc</button>
        </div>
    )
}

function updateName(state, ev) {
    console.log(`state`, state)
    state.name = ev.target.value
}
const App = componentObserve(
    class extends Component {
        constructor(props) {
            super(props)
            this.state = observable({
                name: props.name || "World"
            })
        }
        render(props, state, context) {
            console.log(`demo-render`, { state, _thisstate: this.state })
            const { name } = this.state
            return (
                <div>
                    <div>Name: <input onInput={linkEvent(this.state, updateName)} /></div>
                    <p>Hello {name}!</p>
                </div>
            )
        }
    }
)

function Root(props, context) {
    return (
        <section>
            <Todos />
            <App name="serebano" />
            <Demo state={foo} />
            <Title mapStateToProps={value => ({ value })} value={foo.name} />
        </section>
    )
}

const NameDisplayer = ({ name }) => <h1>{name}</h1>

const UserNameDisplayer = inject(stores => ({
    name: stores.userStore.name
}))(NameDisplayer)

const user = observable({
    name: "Noa"
})

const App1 = () => (
    <Provider userStore={user}>
        <NameDisplayer {...foo} />
    </Provider>
)

render(<App1 />, `#app`)

//render(<Root todos={todos} />, `#app`)
// render(componentObserve(['foo'])(App)
//render(<Provider foo={foo} bar={bar}><App name={foo.name} todos={todos} /></Provider>, `#app`)

Object.assign(window, {
    $,
    foo,
    bar,
    createComponent,
    ComponentObserve,
    componentObserve,
    UserNameDisplayer,
    inject,
    Title,
    App,
    Provider,
    infernoMobx,
    //demo,
    //dev,
    tag,
    bitbox,
    inferno,
    render,
    r,
    createElement,
    h
})
