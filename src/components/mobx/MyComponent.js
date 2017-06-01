// MyComponent.js
import Inferno, { linkEvent } from "inferno"
import Component from "inferno-component"
import { connect } from "inferno-mobx"

class MyComponent extends Component {
    render({ englishStore, frenchStore }) {
        return (
            <div>
                <p>{englishStore.title}</p>
                <p>{frenchStore.title}</p>
            </div>
        )
    }
}

const Title = (props, context) => {
    console.log(`Title`, props, context)
    return <p>{props.title}</p>
}
const EnTitle = connect(["englishStore"])(Title)
const FrTitle = connect(["frenchStore"])(Title)
const Input = (props, context) => {
    const target = context.mobxStores[props.store]
    console.log(`Input`, props, context)
    return (
        <input
            onInput={linkEvent(target, (target, event) => (target.title = event.target.value))}
            value={target.title}
        />
    )
}
function MyPureComponent({ englishStore, frenchStore }) {
    return (
        <div>
            <h1>englishStore: <Title title={englishStore.title} /></h1>
            <EnTitle />
            <FrTitle />
            <Input store="englishStore" />
            <Input store="frenchStore" />
        </div>
    )
}

export default connect(["englishStore", "frenchStore"])(MyPureComponent)
