import Logo from "./logo"
import "./App.css"

export function Title(props) {
    return <h3>{props.value}</h3>
}
const foo = {
    value: "The foo",
    get count() {
        return this.value.length
    }
}

function Name(props) {
    return (
        <div>
            <h1>{props.value}</h1>
            <input onInput={e => (props.value = e.target.value)} value={props.value} />
        </div>
    )
}
export function Count(props) {
    return (
        <div style={{ border: "2px solid #c00" }}>
            <h4>Count:{props.name} - {props.color} / [{props.count}]</h4>
            <button onClick={() => props.count++}>inc</button>
            <button onClick={() => (props.count = foo.count)}>reset</button>
            <button onClick={() => (props.name = `count -> ${props.count}`)}>
                setname
            </button>
        </div>
    )
}

export default function App(props) {
    return (
        <div className="App">
            <div className="App-header">
                <Logo width="40" height="40" />
                <h2>{`inferno(box) #depless`}</h2>
            </div>
            <Name {...foo} />
            <p className="App-intro">
                <Title {...foo} />
                <Count count={10} color="red" name={foo.count} />
            </p>
        </div>
    )
}
