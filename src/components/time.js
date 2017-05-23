class Time {
    ms = 1000
    color = "grey"
    element = "#a"
    key: "localeTime"
    style = {
        color: `green`
    }

    constructor(bitbox, props) {
        return bitbox(Object.assign(this, props))
    }

    box(props) {
        return div(h1(this.style, String(this[props.key] || this.time)))
    }

    get localeTime() {
        if (!this.time) {
            this.time = Date.now()
            this.id = setInterval(() => {
                this.time = Date.now()
            }, this.props.ms)
        }

        return new Date(this.time).toLocaleTimeString()
    }
}

export default Time
