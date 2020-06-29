import Plugin from "./plugin"
import Locale from "../utils/locale"

let defaultOptions = {
    mapName: Locale.get("home"),
    shamanName: "",
    admins: []
}
export default class UI extends Plugin {
    constructor(options) {
        super()

        this.name = "UI"
        this.options = { ...options, ...defaultOptions }
    }

    eventRegister() {
        let parts = nm.Room.Name.split("#home0")
        if (parts.length == 2) {
            this.options.admins.push(parts[1])
        }

        nm.Room.GetPlayers().forEach((player) => {
            this.eventNewPlayer(player.Name)
        })
    }

    eventUnregister() {
        nm.UI.RemoveTextArea(0)
    }

    eventNewPlayer(playerName) {
        nm.UI.AddTextArea(0, `<a href="event:open_help"><b>?</b></a>`, playerName, 782, 29, 11, 17, 0x324650, 0x000000, 1, true)

        if (this.options.mapName != "") nm.SetUIMapName(this.options.mapName, playerName)
        if (this.options.shamanName != "") nm.SetUIShamanName(this.options.shamanName, playerName)
    }

    eventNewGame() {
        if (this.options.mapName != "") nm.SetUIMapName(this.options.mapName)
        if (this.options.shamanName != "") nm.SetUIShamanName(this.options.shamanName)
    }

    eventTextAreaCallback(id, playerName, callback) {
        switch (id) {
            case 0:
                switch (callback) {
                    case "open_help":
                        nm.UI.AddTextArea(1, Locale.get("help"), playerName, 200, 40, 400, 300, 0x324650, 0x000000, 1, true)
                        nm.UI.AddTextArea(2, `<a href=\"event:close_help\"><b>${Locale.get("close")}</b></a>`, playerName, 535, 355, 65, 20, 0x000000, 0x000000, 1, true)
                        break
                }
                break
            case 1:
                if (this.options.admins.indexOf(playerName) == -1) {
                    nm.ChatMessage(Locale.get("forbidden"), playerName)
                    return
                }
                let pluginName, force
                if (callback.indexOf("enable") != -1) {
                    pluginName = callback.split("_")[1]
                    force = true
                } else if (callback.indexOf("disable") != -1) {
                    pluginName = callback.split("_")[1]
                    force = false
                }

                for (let plugin of this.home.options.plugins) {
                    if (plugin.name == pluginName) {
                        if (plugin.enabled != force) {
                            if (force) {
                                nm.ChatMessage(nm.Extensions.Format(Locale.get("pluginEnabled", true), plugin.name))
                                if (plugin.eventRegister !== undefined) plugin.eventRegister()
                            } else {
                                nm.ChatMessage(nm.Extensions.Format(Locale.get("pluginDisabled", true), plugin.name))
                                if (plugin.eventUnregister !== undefined) plugin.eventUnregister()
                            }
                            plugin.enabled = force
                        }
                        break
                    }
                }
                break
            case 2:
                switch (callback) {
                    case "close_help":
                        nm.UI.RemoveTextArea(1)
                        nm.UI.RemoveTextArea(2)
                        break
                }
                break
        }
    }
}