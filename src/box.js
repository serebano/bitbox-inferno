import bitbox, { resolve, factory, is, project } from "bitbox"
import createElement from "inferno-create-element"
import h from "inferno-hyperscript"
import { isVNode } from "inferno-test-utils"
import { TAG_NAMES } from "./tags"
import compose from "./compose"
import r from "ramda"

export const tag = factory(function tag(path, ...args) {
    return path.reduce((res, key) => create(key, res))
})

export function create(tag, ...args) {
    const [props, ...children] = args

    if (!is.object(props) || isVNode(props)) {
        //console.log(`props`, { props, tag, args })
        return createElement(tag, {}, ...args)
    }

    return createElement(tag, props, ...children)
}

export const boxes = []
export const store = new Map()
const startsWith = (string, start) => string[0] === start
const proxy = factory(box)

export default proxy

function box(path, ...args) {
    if (is.func(args[0])) {
        const f = target => args.reduceRight((res, fn) => fn(res), resolve(target, path))
        if (args.length >= 2 && is.object(args[1])) {
            const [tag, props, ...rest] = args
            return create(tag, resolve(props, path), ...rest)
        }
        const b = new Proxy(f, {
            get(target, key) {
                if (key === "name") return path.join(".")
                return target[key]
            }
        })
        return b
    }

    let [tag, ...keys] = path

    if (path.length && TAG_NAMES.indexOf(tag)) {
        if (keys.length) {
            const [props = {}, ...rest] = args
            if (startsWith(keys[0], "#")) props.id = keys.shift()
            props.className = keys.join(" ")

            return create(tag, props, ...rest)
        }
        return create(tag, ...args)
    }
}

export function map(box, target, mapping) {
    return new Proxy(target, {
        get: (target, key, receiver) =>
            Reflect.has(mapping, key)
                ? Reflect.get(mapping, key)
                : Reflect.get(target, key, receiver),
        set: (target, key, value, receiver) =>
            Reflect.has(mapping, key)
                ? Reflect.set(mapping, key, value)
                : Reflect.set(target, key, value, receiver),
        has: (target, key) => Reflect.set(target, key) || Reflect.has(mapping, key)
    })
}

// box.map = (box, fn) => {
//     return target => {
//         const arr = resolve(target, box[Symbol.for("box/path")])
//         return arr.map(obj => create(fn, obj))
//     }
// }
box.h = (box, target, ...args) => {
    //return target => {
    const path = box[Symbol.for("box/path")]
    const tag = path.pop()
    const props = resolve(target, path)
    return create(tag, props, ...args)
    //}
}
box.compose = compose
box.key = (box, target, ...args) => resolve(target, box[Symbol.for("box/path")])

box.get = (box, target, ...args) => {
    //console.log(`get`, { box, path: box[Symbol.for("box/path")], target, args })
    const obj = resolve(target, box[Symbol.for("box/path")])
    return is.observable(obj) ? obj.$observers : obj
}
box.link = (box, target, fn, ...args) => (...rest) => fn(target, ...args.concat(rest))

box.ext = (box, ...args) => {
    return box(...args)
}

// box.tag = create
// box.create = create
// box.new = factory
// export function createComponent(component) {
//     return class InfernoBox extends Component {
//         static displayName = `box(${component.name})`
//         componentWillMount() {
//             const render = this.render
//             const init = (...args) => {
//                 let result
//
//                 function Observer(props, comp) {
//                     if (comp.render === init) {
//                         comp.$observer = this
//                         result = render.apply(comp, args)
//                     } else {
//                         comp.forceUpdate()
//                     }
//                 }
//
//                 Observer.displayName = InfernoBox.displayName
//                 this.$object = bitbox({}, Observer, this)
//                 this.render = render
//
//                 return result
//             }
//
//             this.render = init
//         }
//         componentWillUnmount() {
//             this._observer.off()
//         }
//         render(props, state, context) {
//             return component(props, context)
//         }
//     }
// }
