import Component from "inferno-component"
import Inferno from "inferno"
import bitbox, { is, project } from "bitbox"

const createVNode = Inferno.createVNode

// Inferno.createVNode = function(...args) {
//     if (is.func(args[1]) && args[1] !== Provider) args[1] = inferno(args[1])
//
//     return createVNode(...args)
// }

export class Provider extends Component {
    getChildContext() {
        return { store: this.props.store || {} }
    }
    render() {
        return this.props.children
    }
}
inferno.createVNode = createVNode
inferno.createVNode2 = Inferno.createVNode

function inferno(component) {
    return class InfernoBox extends Component {
        static displayName = `box(${component.name})`
        componentWillMount() {
            const render = this.render
            const init = (...args) => {
                let result

                function Observer(props, comp) {
                    if (comp.render === init) {
                        comp._props = props
                        comp._observer = this
                        result = render.apply(comp, args)
                    } else {
                        comp.forceUpdate()
                    }
                }

                Observer.displayName = InfernoBox.displayName

                bitbox(this.context.store, this.props, Observer, this)

                this.render = render

                return result
            }
            this.render = init
        }
        componentWillUnmount() {
            this._observer.off()
        }
        render() {
            return component(this._props)
        }
    }
}

export default inferno
