import createElement from "inferno-create-element"
import { isVNode } from "inferno-test-utils"
import { is, curry, project, view } from "bitbox"
import { TAG_NAMES } from "./tags"
const COMPONENTS = {}

export default new Proxy(
    function createElement(tagName, ...args) {
        const [props, ...children] = args
        if (!is.object(props) || isVNode(props)) return createElement(tagName, null, ...args)
        return createElement(tagName, props, ...children)
    },
    {
        get(target, key) {
            if (key === `$tags`) return TAG_NAMES
            if (key === `$components`) return COMPONENTS

            if (TAG_NAMES.indexOf(key) > -1) {
                if (Reflect.has(COMPONENTS, key)) {
                    return Reflect.get(COMPONENTS, key)
                    // const component = (...args) => target(Reflect.get(COMPONENTS, key), ...args)
                    // component.toString = () => `${key}(...args)`
                    // return component
                }
                const tag = (...args) => {
                    if (is.func(args[0])) {
                        const tagFn = args.shift()
                        return (...tagFnArgs) => target(key, ...args.concat(tagFn(...tagFnArgs)))
                    }
                    return target(key, ...args)
                }
                tag.toString = () => `${key}(...args)`
                return tag
            }

            return function Component(fn, viewProps) {
                const component = new Proxy(fn, {
                    get(target, _key) {
                        if (_key === "name") return `box(${key})`
                        return target[_key]
                    }
                })
                return component
                if (arguments.length === 2)
                    return (props, ...args) => target(component, view(viewProps, props), ...args)
                return (...args) => target(component, ...args)
            }
        },
        set(target, key, tag) {
            if (TAG_NAMES.indexOf(key) === -1) {
                if (is.func(tag)) {
                    TAG_NAMES.push(key)
                    return Reflect.set(COMPONENTS, key, tag)
                }
            }
        },
        has(target, key) {
            return TAG_NAMES.indexOf(key) > -1
        },
        ownKeys(target) {
            return Reflect.ownKeys(target).concat(TAG_NAMES)
        }
    }
)
