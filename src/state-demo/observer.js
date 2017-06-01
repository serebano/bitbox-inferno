import Component from "inferno-component"
import { observe, unobserve } from "bitbox"

export default Wrapped =>
    class extends Component {
        state = {}
        constructor(props, context) {
            super(props, context)
            this.observer = this.observer.bind(this)
        }
        componentDidMount() {
            observe(this.observer)
        }
        componentWillUnmount() {
            unobserve(this.observer)
        }
        observer() {
            let { state, mapStateToProps } = this.props
            this.setState({
                ready: true,
                props: typeof mapStateToProps === "function" ? mapStateToProps(state) : state
            })
        }
        render(props, state, context) {
            console.log(`O-render`, { props, state, context })

            //return <div>{JSON.stringify(this.props)}</div>;
            return (
                !!this.state.ready && <Wrapped {...this.state.props}>{this.props.children}</Wrapped>
            )
        }
    }
