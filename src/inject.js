import hoistStatics from "hoist-non-inferno-statics"
import { componentObserve } from "./componentObserve"
import createElement from "inferno-create-element"
import createClass from "inferno-create-class"
import PropTypes from "prop-types"
import VNodeFlags from "inferno-vnode-flags"
import { createVNode } from "inferno"

const injectorContextTypes = { nxStores: PropTypes.object }
Object.seal(injectorContextTypes)

const proxiedInjectorProps = {
    contextTypes: {
        get: function() {
            return injectorContextTypes
        },
        set: function(_) {
            console.warn(
                "NX Injector: you are trying to attach `contextTypes` on an component decorated with `inject` (or `componentObserve`) HOC. Please specify the contextTypes on the wrapped componentObserve instead. It is accessible through the `wrappedComponent`"
            )
        },
        configurable: true,
        enumerable: false
    },
    isNXInjector: {
        value: true,
        writable: true,
        configurable: true,
        enumerable: true
    }
}

/**
 * Store Injection
 */
function createStoreInjector(grabStoresFn, component, injectNames) {
    let displayName =
        "inject-" +
        (component.displayName ||
            component.name ||
            (component.constructor && component.constructor.name) ||
            "Unknown")
    if (injectNames) displayName += "-with-" + injectNames

    const Injector = createClass({
        displayName: displayName,
        storeRef: function(instance) {
            this.wrappedInstance = instance
        },
        render: function() {
            // Optimization: it might be more efficient to apply the mapper function *outside* the render method
            // (if the mapper is a function), that could avoid expensive(?) re-rendering of the injector component
            // See this test: 'using a custom injector is not too reactive' in inject.js
            let newProps = {}
            for (let key in this.props)
                if (this.props.hasOwnProperty(key)) {
                    newProps[key] = this.props[key]
                }
            var additionalProps = grabStoresFn(
                this.context.nxStores || {},
                newProps,
                this.context
            ) || {}
            for (let key in additionalProps) {
                newProps[key] = additionalProps[key]
            }
            newProps.ref = this.storeRef

            return createVNode(VNodeFlags.ComponentUnknown, component, null, null, newProps)

            //return createElement(component, newProps)
        }
    })

    // Static fields from component should be visible on the generated Injector
    hoistStatics(Injector, component)

    Injector.wrappedComponent = component
    Object.defineProperties(Injector, proxiedInjectorProps)

    return Injector
}

function grabStoresByName(storeNames) {
    return function(baseStores, nextProps) {
        storeNames.forEach(function(storeName) {
            if (storeName in nextProps)
                // prefer props over stores
                return
            if (!(storeName in baseStores))
                throw new Error(
                    "NX observer: Store '" +
                        storeName +
                        "' is not available! Make sure it is provided by some Provider"
                )
            nextProps[storeName] = baseStores[storeName]
        })
        return nextProps
    }
}

/**
 * higher order component that injects stores to a child.
 * takes either a varargs list of strings, which are stores read from the context,
 * or a function that manually maps the available stores from the context to props:
 * storesToProps(mobxStores, props, context) => newProps
 */
export default function inject /* fn(stores, nextProps) or ...storeNames */() {
    let grabStoresFn
    if (typeof arguments[0] === "function") {
        grabStoresFn = arguments[0]
        return function(componentClass) {
            let injected = createStoreInjector(grabStoresFn, componentClass)
            injected.isNXInjector = false
            // supress warning
            // mark the Injector as observer, to make it react to expressions in `grabStoresFn`,
            // see #111
            injected = componentObserve(injected)
            injected.isMobxInjector = true
            // restore warning
            return injected
        }
    } else {
        const storeNames = []
        for (let i = 0; i < arguments.length; i++)
            storeNames[i] = arguments[i]
        grabStoresFn = grabStoresByName(storeNames)
        return function(componentClass) {
            return createStoreInjector(grabStoresFn, componentClass, storeNames.join("-"))
        }
    }
}
