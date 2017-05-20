import { version } from "inferno"
import Logo from "./logo"
import "./App.css"
import box from "./box"

const Title = box(function Title(props) {
    return <h1>Title: [{props.store.name}]</h1>
})

const Count = box(function Count(props) {
    return (
        <div style={{ border: "2px solid #c00" }}>
            <h1>Count: [{props.store.count}]</h1>
            <button onClick={() => props.store.count++}>inc</button>
            <button onClick={() => (props.store.count = 0)}>reset</button>
            <button onClick={() => (props.store.name = `count -> ${props.store.count}`)}>
                setname
            </button>
        </div>
    )
})

export default box(function App({ store }) {
    return (
        <div className="App">
            <div className="App-header">
                <Logo width="80" height="80" />
                <h2>{`Welcome to Inferno(box) ${version}`}</h2>
            </div>
            <p className="App-intro">
                <Title store={store} />
                <Count store={store} />
                To get started, edit <code>src/App.js</code> and save to reload.
            </p>
        </div>
    )
})
