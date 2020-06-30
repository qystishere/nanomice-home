import Plugin from "./plugin"
import Locale from "../utils/locale"

let defaultOptions = {}
export default class Commandor extends Plugin {
    constructor(options) {
        super(options)

        this.name = "commandor"
        this.options = { ...options, ...defaultOptions }
    }

    eventRegister() {
        this.commands = ["message"]
        this.autorespawn = false
        this.disableautonewgame = false
        this.disableautoshaman = false
        this.lastRespawnAt = 0

        for (let command of this.commands) {
            nm.System.DisableChatCommandDisplay(command, true)
        }
    }

    eventUnregister() {
        for (let command of this.commands) {
            nm.System.DisableChatCommandDisplay(command, false)
        }
        nm.DisableAutoNewGame(false)
        nm.DisableAutoShaman(false)
    }

    eventNewGame() {
        if (this.disableautonewgame)
            nm.SetGameTime(5)
    }

    eventChatCommand(playerName, command) {
        if (this.home.owner != playerName && this.home.admins.indexOf(playerName) == -1) {
            return
        }

        let args = command.split(" ")
        switch (args[0]) {
            case "message":
                if (args.length < 2) {
                    break
                }
                nm.ChatMessage(`<font color="#AAAAAA">Ξ [${Locale.get("home")}] ${[...args].splice(1, args.length).join(" ")}</font>`)
                break
            case "new":
                if (args.length != 2) {
                    break
                }

                let type
                switch (args[1]) {
                    case "bootcamp":
                        type = "#3"
                        break
                    case "vanilla":
                        type = "#" + (49 + Math.round(Math.random() * 1)).toString()
                        break
                    case "racing":
                        type = "#7"
                        break
                    case "defilante":
                        type = "#18"
                        break
                    case "tribe":
                        type = "#22"
                        break
                    case "survivor":
                        type = "#10"
                        break
                    case "village":
                        type = "@801"
                        break
                }

                if (type !== undefined) {
                    nm.NewGame(type)
                }
                break
            case "cheese":
                if (args.length != 2) {
                    break
                }
                nm.GiveCheese(args[1])
                break
            case "takecheese":
                if (args.length != 2) {
                    break
                }
                nm.TakeCheese(args[1])
                break
            case "win":
                if (args.length != 2) {
                    break
                }
                nm.PlayerVictory(args[1])
                break
            case "autorespawn":
                this.autorespawn = !this.autorespawn
                nm.ChatMessage(nm.Extensions.Format(Locale.get("commandor/autorespawn", Locale.type.self), this.autorespawn ? `✅` : `❎`), playerName)
                break
            case "time":
                if (args.length != 2) {
                    break
                }
                nm.SetGameTime(Number(args[1]), false)
                break
            case "notime":
                this.disableautonewgame = !this.disableautonewgame
                nm.DisableAutoNewGame(this.disableautonewgame)
                nm.SetGameTime(5)
                break
            case "sha":
                if (args.length != 2) {
                    break
                }
                nm.SetShaman(args[1])
                break
            case "nosha":
                this.disableautoshaman = !this.disableautoshaman
                nm.DisableAutoShaman(this.disableautoshaman)
                break
            case "snow":
                if (args.length != 2) {
                    break
                }
                nm.Snow(Number(args[1]), 10)
                break
            case "gravity":
                if (args.length != 3) {
                    break
                }
                nm.SetGravity(Number(args[1]), Number(args[2]))
                break
            case "meep":
                if (args.length != 2) {
                    break
                }
                nm.GiveMeep(args[1])
                break
            case "kill":
                if (args.length != 2) {
                    break
                }
                nm.KillPlayer(args[1])
                break

        }
    }

    eventLoop(time, remaning) {
        if (!this.autorespawn || ((Date.now() - this.lastRespawnAt) < 2000)) {
            return
        }

        nm.Room.GetPlayers().forEach((player) => {
            if (!player.IsInHole && !player.IsDead) {
                return
            }
            nm.RespawnPlayer(player.Name)
        })

        this.lastRespawnAt = Date.now()
    }
}