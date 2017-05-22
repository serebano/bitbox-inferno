import Logo from "./logo"
import "./App.css"

export function Title(props) {
    return <h3>{props.value}</h3>
}

function Name(props) {
    return (
        <section>
            <h1>{props.name}</h1>
            <input onInput={e => (props.name = e.target.value)} value={props.name} />
        </section>
    )
}

export function Count(props) {
    return (
        <div style={{ border: "2px solid #c00" }}>
            <h4>Count [{props.count}]</h4>
            <button onClick={() => props.inc()}>inc()</button>
            <button onClick={() => (props.count = 0)}>reset</button>
        </div>
    )
}

export default function App(props) {
    return (
        <div className="App" style={{ border: `1px solid ${props.color || "grey"}`, margin: 16 }}>
            <div className="App-header">
                <Logo width="40" height="40" />
                <h2>{`inferno(box) #depless`}</h2>
            </div>
            <div className="App-intro">
                <Name />
                <Count />
            </div>
        </div>
    )
}
