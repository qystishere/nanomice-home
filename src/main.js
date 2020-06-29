import Home from "./home"

import UI from "./plugins/ui"
import Hello from "./plugins/hello"
import Fly from "./plugins/fly"

let home = new Home({
    ui: {
        mapName: "Home"
    },
    plugins: [new UI(), new Hello(), new Fly()]
})

register("home", home.getScript(), true)