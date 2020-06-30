import Plugin from "./plugin"
import Locale from "../utils/locale"

let defaultOptions = {
    mapName: `<font color="#AAAAAA">${Locale.get("home")}</font>`,
    shamanName: "",
    admins: []
}
export default class UI extends Plugin {
    constructor(options) {
        super(options)

        this.name = "ui"
        this.options = { ...options, ...defaultOptions }
    }

    eventRegister() {
        nm.Room.GetPlayers().forEach((player) => {
            this.eventNewPlayer(player.Name)
        })
    }

    eventUnregister() {
        nm.UI.RemoveTextArea(0)
        nm.UI.RemoveTextArea(1)
        nm.UI.RemoveTextArea(2)
    }

    eventNewPlayer(playerName) {
        nm.UI.AddTextArea(0, `<a href="event:open_help"><b>?</b></a>`, playerName, 782, 29, 11, 17, 0x324650, 0x000000, 1, false)

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
                        nm.UI.AddTextArea(1, this.getPanel(), playerName, 200, 40, 400, 300, 0x324650, 0x000000, 1, false)
                        nm.UI.AddTextArea(2, `<a href=\"event:close_help\"><b>${Locale.get("ui/close")}</b></a>`, playerName, 535, 355, 65, 20, 0x000000, 0x000000, 1, false)
                        break
                }
                break
            case 1:
                if (playerName !== this.home.owner && this.home.admins.indexOf(playerName) == -1) {
                    nm.ChatMessage(Locale.get("forbidden", Locale.type.self), playerName)
                    return
                }

                let parts = callback.split("_")
                if (parts.length == 1) {
                    return
                }

                let force = (pluginName, force) => {
                    for (let plugin of this.home.options.plugins) {
                        if (plugin.name != pluginName)
                            continue
                        if (plugin.enabled == force)
                            break
                        plugin.enabled = force
                        if (force) {
                            nm.ChatMessage(nm.Extensions.Format(Locale.get("ui/pluginEnabled", Locale.type.all), Locale.get(`${plugin.name}/name`)))
                            if (plugin.eventRegister !== undefined) plugin.eventRegister()
                        } else {
                            nm.ChatMessage(nm.Extensions.Format(Locale.get("ui/pluginDisabled", Locale.type.all), Locale.get(`${plugin.name}/name`)))
                            if (plugin.eventUnregister !== undefined) plugin.eventUnregister()
                        }
                        nm.UI.UpdateTextArea(1, this.getPanel(), playerName)
                        break
                    }
                }

                switch (parts[0]) {
                    case "enable":
                        force(parts[1], true)
                        break
                    case "disable":
                        force(parts[1], false)
                        break
                    case "addRights":
                        if (parts[1] == playerName)
                            break
                        if (this.home.admins.indexOf(parts[1]) != -1)
                            break
                        this.home.admins.push(parts[1])
                        nm.ChatMessage(nm.Extensions.Format(Locale.get("ui/addedAdmin", Locale.type.all), parts[1]))
                        nm.UI.UpdateTextArea(1, this.getPanel(), playerName)
                        break
                    case "removeRights":
                        if (parts[1] == playerName)
                            break
                        let index = this.home.admins.indexOf(parts[1])
                        if (index == -1)
                            break
                        this.home.admins.splice(index, 1)
                        nm.ChatMessage(nm.Extensions.Format(Locale.get("ui/removedAdmin", Locale.type.all), parts[1]))
                        nm.UI.UpdateTextArea(1, this.getPanel(), playerName)
                        break
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

    getPanel() {
        let raw = `<J> (!) </j> <b>${Locale.get("ui/players")}</b>\n\n`
        nm.Room.GetPlayers().sort((a, b) => {
            return a.Name < b.Name ? -1 : (a.Name > b.Name ? 1 : 0)
        }).forEach((player) => {
            raw += `<V>${player.Name}</V> `

            if (this.home.owner == player.Name)
                raw += `<b>[${Locale.get("ui/owner")}]</b> `
            else if (this.home.admins.indexOf(player.Name) == -1)
                raw += `<a href="event:addRights_${player.Name}"><BV>[${Locale.get("ui/addRights")}]</BV></a> `
            else
                raw += `<a href="event:removeRights_${player.Name}"><BV>[${Locale.get("ui/removeRights")}]</BV></a> `
        })
        raw += `\n\n<J> (!) </j> <b>${Locale.get("ui/plugins")}</b>\n`
        for (let plugin of this.home.options.plugins) {
            raw += `\n<b>${Locale.get(`${plugin.name}/name`)}</b>: ${Locale.get(`${plugin.name}/description`)} `
            if (plugin.name == "ui")
                continue

            if (plugin.enabled)
                raw += `<a href="event:disable_${plugin.name}"><BV>[${Locale.get("ui/disable")}]</BV></a>`
            else
                raw += `<a href="event:enable_${plugin.name}"><BV>[${Locale.get("ui/enable")}]</BV></a>`
        }
        raw += `\n\n${Locale.get("ui/disclaimer")}`
        return raw
    }
}