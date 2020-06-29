import Plugin from "./plugin"

let defaultOptions = {}
export default class Fly extends Plugin {
    constructor(options) {
        super()

        this.name = "Fly"
        this.options = { ...options, ...defaultOptions }
    }

    eventRegister() {
        nm.Room.GetPlayers().forEach((player) => {
            this.eventNewPlayer(player.Name)
        })
    }

    eventNewPlayer(playerName) {
        nm.BindKeyboard(playerName, 0x20, true, true)
    }

    eventKeyboard(playerName, keyCode, down, posX, posY) {
        if (keyCode === 0x20) {
            nm.MovePlayer(playerName, 0, 0, true, 0, -50, false)
        }
    }
}