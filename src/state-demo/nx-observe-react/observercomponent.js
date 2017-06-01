import Component from "inferno-component"
import { observe, unobserve } from "bitbox"

export default Wrapped =>
    class extends Component {
        state = {}
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
                props: mapStateToProps(state)
            })
        }
        render() {
            //return <div>{JSON.stringify(this.props)}</div>;
            return (
                !!this.state.ready && <Wrapped {...this.state.props}>{this.props.children}</Wrapped>
            )
        }
    }
