//import Inferno from "inferno"
import Component from "inferno-component"
//import PropTypes from "prop-types"

const specialReactKeys = { children: true, key: true, ref: true }

export default class Provider extends Component {
    //static contextTypes = { nxStores() {} }
    //static childContextTypes = { nxStores() {} }
    constructor(props, context) {
        super(props, context)
        this.contextTypes = {
            nxStores() {}
        }
        this.childContextTypes = {
            nxStores() {}
        }
        this.store = props.store
    }
    render() {
        return this.props.children
    }

    getChildContext() {
        const stores = {}
        // inherit stores
        const baseStores = this.context.nxStores
        if (baseStores)
            for (let key in baseStores) {
                stores[key] = baseStores[key]
            }
        // add own stores
        for (let key in this.props)
            if (!specialReactKeys[key] && key !== "suppressChangedStoreWarning")
                stores[key] = this.props[key]
        return { nxStores: stores }
    }

    componentWillReceiveProps(nextProps) {
        // Maybe this warning is too aggressive?
        if (Object.keys(nextProps).length !== Object.keys(this.props).length)
            console.warn(
                "NX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children"
            )
        if (!nextProps.suppressChangedStoreWarning)
            for (let key in nextProps)
                if (!specialReactKeys[key] && this.props[key] !== nextProps[key])
                    console.warn(
                        "NX Provider: Provided store '" +
                            key +
                            "' has changed. Please avoid replacing stores as the change might not propagate to all children"
                    )
    }
}