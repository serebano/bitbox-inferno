function isObjectShallowModified(prev, next) {
    if (null == prev || null == next || typeof prev !== "object" || typeof next !== "object") {
        return prev !== next
    }
    const keys = Object.keys(prev)
    if (keys.length !== Object.keys(next).length) {
        return true
    }

    for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i]
        if (next[key] !== prev[key]) {
            return true
        }
    }
    return false
}

export function observableProperty(propName) {
    let valueHolder = this[propName]
    //const atom = new Atom("reactive " + propName)
    Object.defineProperty(this, propName, {
        configurable: true,
        enumerable: true,
        get() {
            //atom.reportObserved()
            return valueHolder
        },
        set(v) {
            if (!isForcingUpdate && isObjectShallowModified(valueHolder, v)) {
                valueHolder = v
                skipRender = true
                //atom.reportChanged()
                skipRender = false
            } else {
                valueHolder = v
            }
        }
    })
}

let isUsingStaticRendering = false

export function useStaticRendering(useStaticRendering) {
    isUsingStaticRendering = useStaticRendering
}

function createComponent(component) {
    class observerComponent extends Component {
        componentWillMount() {
            if (isUsingStaticRendering === true) return

            let skipRender = false
            let isForcingUpdate = false

            // make this.props an observable reference, see #124
            observableProperty.call(this, "props")
            // make state an observable reference
            observableProperty.call(this, "state")

            // wire up reactive render
            const baseRender = this.render.bind(this)

            let $observer
            let isRenderingPending = false

            const reactiveRender = (props, state, context) => {
                isRenderingPending = false
                let result
                $observer = bitbox(() => (result = baseRender(props, state, context)))

                return result
            }

            const initialRender = () => {
                if (!isRenderingPending) {
                    isRenderingPending = true
                    if (this.__isUnmounted !== true) {
                        try {
                            isForcingUpdate = true
                            if (!skipRender) this.forceUpdate()
                        } finally {
                            isForcingUpdate = false
                        }
                    }
                }
                reactiveRender.$observer = $observer
                this.render = reactiveRender

                return reactiveRender(this.props, this.state, this.context)
            }

            this.render = initialRender
        }
        componentWillUnmount() {
            if (isUsingStaticRendering === true) return

            this.render.$observer && this.render.$observer.off()
            this.__isUnmounted = true
        }
        shouldComponentUpdate() {
            return false
        }
        render(props, state, context) {
            return component(props, context)
        }
    }

    observerComponent.isObserver = true
    observerComponent.displayName = `${component.name}`

    return observerComponent
}

export default createComponent
