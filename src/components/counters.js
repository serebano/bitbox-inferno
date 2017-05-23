import Counter from "./counter"

function addCounter(target) {
    target.push({ count: 0 })
}

function Counters(counters) {
    return section(
        button({ onClick: () => addCounter(counters, 0) }, `Add Counter`),
        div(counters.map(Counter))
    )
}

export default Counters
