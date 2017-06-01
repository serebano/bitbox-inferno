import { linkEvent } from "inferno"

function onInput(props, event) {
    props.value = event.target.value
}

function Input(props, context) {
    console.log(`Input`, { props, context })
    return <div><input type="text" onInput={linkEvent(props, onInput)} value={props.value} /></div>
}

export default Input
