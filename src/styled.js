const StyledInput = styled("input", props => ({
    backgroundColor: props.valid ? "green" : "red"
}))

class SomeComponent extends InfernoComponent {
    componentDidMount() {
        console.log(this.input) // undefined
    }
    render() {
        const { valid } = this.state
        return (
            <StyledInput
                valid={valid}
                ref={el => (this.input = el)} // Never gets called
                onChange={linkEvent(this, this.handleChange)}
            />
        )
    }
    handleClick() {
        this.setState({ valid: !!this.input.value }) // Error: Cannot read property value of undefined
    }
}

Inferno.render(<SomeComponent />, document.getElementById("root"))
