import R from "ramda"
import inferno from "inferno"

export default R.curry((element, component, props) => {
    return inferno.render(component(props), element)
})
