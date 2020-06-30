import Plugin from "./plugin"
import Locale from "../utils/locale"

let defaultOptions = {}
export default class Hello extends Plugin {
    constructor(options) {
        super(options)

        this.name = "hello"
        this.options = { ...options, ...defaultOptions }
    }

    eventNewPlayer(playerName) {
        nm.ChatMessage(nm.Extensions.Format(Locale.get("hello/joinedRoom", Locale.type.all), playerName))
    }

    eventPlayerLeft(playerName) {
        nm.ChatMessage(nm.Extensions.Format(Locale.get("hello/leftRoom", Locale.type.all), playerName))
    }
}