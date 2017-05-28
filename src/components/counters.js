import Counter, { start } from "./counter"
import box from "../box"
import bitbox from "bitbox"
const { h3, span, section, div, main } = box

// const test = {
//     counters(target, ...rest) {
//         return box.map(target, {
//             style: {
//                 padding: 24,
//                 border: `1px solid #c00`,
//                 get background() {
//                     return target.value % 2 ? `black` : `white`
//                 },
//                 get color() {
//                     return target.value % 2 ? `white` : `black`
//                 }
//             }
//         })
//     }
// }

const button = (target, action, label) => {
    return box.button(
        {
            onClick: (...args) => {
                action(target, ...args)
            }
        },
        label
    )
}

const actions = {
    add: target => {
        const item = new Counter.item(target, 0)
        //start(item)

        console.log(`target`, { item, target })
        //target.push(item)
    },
    shift: target => target.shift(),
    pop: target => target.pop(),
    sort: target => target.sort((a, b) => a.value - b.value)
}

function Counters(target) {
    return main(
        h3(`Counters - `, span(target.length)),
        div(
            button(target, actions.add, `Add`),
            button(target, actions.shift, `Shift`),
            button(target, actions.pop, `Pop`),
            button(target, actions.sort, `Sort`)
        ),
        div(target.map(Counter))
    )
}

export default Counters
