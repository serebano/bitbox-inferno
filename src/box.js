import Component from "inferno-component"
import createElement from "inferno-create-element"
import { observe } from "bitbox"

function inferno(fn) {
    const component = props => fn(props, createElement)

    return class InfernoBox extends Component {
        displayName = `box(${fn.name})`

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
}

export default inferno
