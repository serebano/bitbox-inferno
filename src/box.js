import { box, observable, observe } from "bitbox"
import Component from "inferno-component"
import infernoCreateElement from "inferno-create-element"
import Inferno from "inferno"
require("inferno-devtools")

export default function component(fn) {
    const component = props => fn(props, infernoCreateElement)

    class Box extends Component {
        componentWillMount() {
            const render = this.render
            const initialRender = (...args) => {
                let result
                this.observer = observe(() => {
                    if (this.render === initialRender) result = render.apply(this, args)
                    else this.forceUpdate()
                })
                this.render = render
                return result
            }
            this.render = initialRender
        }
        componentWillUnmount() {
            this.observer.off()
        }
        render() {
            return component(this.props)
        }
    }
    Box.displayName = `box(${fn.name})`

    return Box
}

// export const store = observable({
//     name: "Scooby Doo",
//     count: 0
// })
//
// const Title = component(function Title(props) {
//     return <h1>Title: [{props.store.name}]</h1>
// })
//
// const Count = component(function Count(props) {
//     return (
//         <div style={{ border: "2px solid #c00" }}>
//             <h1>Count: [{props.store.count}]</h1>
//             <button onClick={() => props.store.count++}>inc</button>
//             <button onClick={() => (props.store.count = 0)}>reset</button>
//             <button onClick={() => (props.store.name = `count -> ${props.store.count}`)}>
//                 setname
//             </button>
//         </div>
//     )
// })
//
// const App = component(function App(props) {
//     return (
//         <div>
//             <Title store={store} />
//             <Count store={store} />
//         </div>
//     )
// })
//
// Inferno.render(<App />, document.getElementById("app"))
//
// setInterval(() => store.count++)
// store.name = `box - ${store.count}`
