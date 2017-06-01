import { observable, observe, unobserve, isObservable } from "bitbox"
import autoBind from "./autoBind"
import Component from "inferno-component"
import createElement from "inferno-create-element"

const OBSERVED_RENDER = Symbol("observed component")
const OBSERVABLE_STATE = Symbol("observable state")

export default function HOC(WrappedComponent) {
    return class ObserverWrapper extends Component {
        // constructor(props) {
        //     super(props)
        //     //autoBind(this, WrappedComponent.prototype)
        //     //this.state = this[OBSERVABLE_STATE] = observable(this.state)
        // }
        componentWillMount() {
            const render = this.render
            const initialRender = (...args) => {
                let result
                this[OBSERVED_RENDER] = observe(() => {
                    if (this.render === initialRender) {
                        result = render.apply(this, args)
                    } else {
                        this.forceUpdate()
                    }
                })
                this.render = render
                return result
            }
            this.render = initialRender
        }
        componentWillUnmount() {
            unobserve(this[OBSERVED_RENDER])
        }
        shouldComponentUpdate() {
            return false
        }
        render(props) {
            return <WrappedComponent {...props} />
        }
        // componentWillMount() {
        //     console.log(`ObserverWrapper-render`, componentWillMount)
        //     if (this[OBSERVED_RENDER]) {
        //         return render(props, state, context)
        //     }
        //     let render = this.render
        //     let result
        //     this[OBSERVED_RENDER] = observe(() => {
        //         // console.log(`ObserverWrapper-observe %%`, {
        //         //     state,
        //         //     _thisState: this.state,
        //         //     OBSERVABLE_STATE: this[OBSERVABLE_STATE]
        //         // })
        //
        //         if (!this[OBSERVED_RENDER]) {
        //             result = render(props, state, context)
        //         } else {
        //             console.log(
        //                 `ObserverWrapper-forceUpdate`,
        //                 [isObservable(state), isObservable(this.state)],
        //                 { state, _thisstate: this.state }
        //             )
        //
        //             this.forceUpdate(() => (this.state = this[OBSERVABLE_STATE]))
        //         }
        //     })
        //     return result
        // }

        shouldComponentUpdate(nextProps) {
            const { props } = this
            const keys = Object.keys(props)
            const nextKeys = Object.keys(nextProps)

            if (keys.length !== nextKeys.length) {
                return true
            }

            for (let key of keys) {
                if (props[key] !== nextProps[key]) {
                    return true
                }
            }
            return false
        }
    }
}
