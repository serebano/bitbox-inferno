import { compose, pure } from "incompose"

const A = props => <h1>props.value</h1>

export default compose(pure)(A)
