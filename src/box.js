import Component from "inferno-component"
import Inferno from "inferno"
import bitbox, { is, project } from "bitbox"

const createVNode = Inferno.createVNode

Inferno.createVNode = function(...args) {
    if (is.func(args[1])) args[1] = inferno(args[1])

    return createVNode(...args)
}

function inferno(component) {
    return class InfernoBox extends Component {
        static displayName = `box(${component.name})`
        getChildContext() {
            return { store: this.context.store || this.props.store }
        }
        componentWillMount() {
            const render = this.render
            const init = (...args) => {
                let result
                this.observer = bitbox(project(this.context.store, this.props), _props => {
                    this._props = _props

                    if (this.render === init) {
                        result = render.apply(this, args)
                    } else {
                        this.forceUpdate()
                    }
                })

                this.render = render
                return result
            }
            this.render = init
        }
        componentWillUnmount() {
            this.observer.off()
        }
        render() {
            return component(this._props, bitbox)
        }
    }
}

export default inferno
