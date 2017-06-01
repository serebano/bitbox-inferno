import tag from "../tag"
import inferno from "inferno"
import Inferno, { linkEvent } from "inferno"
import { compose, pure } from "incompose"
import bitbox, { box, view, observe } from "bitbox"

const { section, div, a, span, label, h3, button } = tag

function increment(target, key) {
    target[key]++
}
function decrement(target, key) {
    target[key]--
}

function Counter(props) {
    return section(
        {
            style: {
                border: `1px solid #777`,
                display: "inline-block",
                background: `#fff`,
                padding: 4,
                margin: 4
            }
        },
        h3(
            {
                style: {
                    margin: 0,
                    padding: 4,
                    textAlign: "center"
                }
            },
            props.value
        ),
        div(
            button({ onClick: linkEvent(props, increment, "value") }, `Increment`),
            button({ onClick: linkEvent(props, increment, "value") }, `Decrement`)
        )
    )
}

export default Counter //compose(pure)(Counter)
