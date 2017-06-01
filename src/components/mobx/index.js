// index.js
import Inferno from "inferno"
import { Provider } from "inferno-mobx"
import { observable } from "mobx"
import MyComponent from "./MyComponent"

const englishStore = observable({
    title: "Hello World"
})

const frenchStore = observable({
    title: "Bonjour tout le monde"
})

Inferno.render(
    <Provider englishStore={englishStore} frenchStore={frenchStore}>
        <MyComponent />
    </Provider>,
    document.getElementById("app")
)
