import Plugin from "./plugin"
import Locale from "../utils/locale"

let defaultOptions = {}
export default class Hello extends Plugin {
    constructor(options) {
        super()

        this.name = "Hello"
        this.options = { ...options, ...defaultOptions }
    }

    eventNewPlayer(playerName) {
        nm.ChatMessage(nm.Extensions.Format(Locale.get("joinedRoom", true), playerName))
    }

    eventPlayerLeft(playerName) {
        nm.ChatMessage(nm.Extensions.Format(Locale.get("leftRoom", true), playerName))
    }
}