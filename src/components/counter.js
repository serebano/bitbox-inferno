import box from "../box"
import inferno from "inferno"
import bitbox from "bitbox"

const { section, span, strong, div, h1, button, pre, link } = box

export const style = {
    inline: {
        display: `inline-block`
    },
    button(active) {
        return {
            background: active ? `green` : `#555`,
            border: "none",
            color: `#fff`
        }
    },
    buttons(active) {
        return Object.assign(
            {
                background: `#fff`,
                padding: 2
            },
            style.inline
        )
    },
    value(target) {
        return Object.assign(
            {
                fontSize: 18,
                padding: 8,
                opacity: target.isRunning ? 1 : 0.5,
                background: target.id % 2 ? `#eee` : `#fff`
            },
            style.inline
        )
    },
    text(style) {
        return Object.assign(
            {
                padding: 2,
                fontSize: 16
            },
            style
        )
    },
    h1: { title: { style: { opacity: 0.3 } } }
}

const json = target =>
    pre(
        { style: { padding: 8, background: `#f4f4f4`, fontSize: 14 } },
        JSON.stringify(target, null, 4)
    )

export default function Counter(target) {
    const fn = () => {
        console.log(`$Counter(target) fn`, target.key)
        return $Counter(target)
    }

    const observer = bitbox(fn)
    observer.name = target.key
    console.log(`observer`, { observer, target })
    return $Counter(target)
}

function $Counter(target) {
    return section(
        { id: `counter-${target.id}` },
        Counter.value(target),
        Counter.buttons(target),
        json(target)
    )
}

Counter.nxid = 0
Counter.item = function Item(target, value) {
    this.value = value || 0
    this.id = Counter.nxid++
    this.key = `counter-${this.id}`
    target.push(this)

    //start(this)
}

const text = (value, obj) => box.span({ style: style.text(obj) }, value)

Counter.value = target => {
    return div(
        {
            class: `counter-value`,
            style: style.value(target)
        },
        text(`#${target.id} - counter( box( `, { opacity: 0.5 }),
        text(target.value, { color: `#c00`, fontWeight: "bold" }),
        text(` ) )`, { opacity: 0.5 })
    )
}

Counter.buttons = function(target) {
    return div(
        {
            class: `counter-buttons`,
            style: style.buttons(target)
        },
        target.isRunning
            ? button(
                  { style: style.button(target.isRunning), onClick: link(target, stop) },
                  `stop(${target.isRunning})`
              )
            : button(
                  { style: style.button(target.isRunning), onClick: link(target, start) },
                  `start`
              )
    )
}

export function reset(target) {
    target.value = 0
}

export function start(target) {
    if (target.isRunning) stop(target)
    target.isRunning = setInterval(() => {
        target.value++
    })
}

export function stop(target) {
    clearInterval(target.isRunning)
    delete target.isRunning
}
