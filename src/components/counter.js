export default function Counter(counter) {
    return div(
        {
            style: {
                border: "2px solid #c00"
            }
        },
        title(`Count [${counter.count}]`),
        button({ onClick: linkEvent(counter, inc) }, `inc`),
        button({ onClick: linkEvent(counter, run) }, `run`),
        button({ onClick: linkEvent(counter, reset) }, `reset`),
        button({ onClick: linkEvent(counter, remove) }, `remove`)
    )
}

export function inc(target) {
    target.count++
}

export function run(target) {
    target.id = target.id ? clearInterval(target.id) : setInterval(() => target.count++)
}

export function reset(target) {
    target.count = 0
}

export function remove(target, counter) {
    target.splice(target.indexOf(counter), 1)
}
