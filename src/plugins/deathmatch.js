import Plugin from "./plugin"
import Locale from "../utils/locale"

let defaultOptions = {}
export default class Deathmatch extends Plugin {
    constructor(options) {
        super(options)

        this.name = "deathmatch"
        this.options = { ...options, ...defaultOptions }
    }

    eventRegister() {
        this.init = false
        this.started = false
        this.players = {}
        this.keys = [0x28, 0x53, 0x20]
        this.maps = ["@4075355", "@4074458", "@4074459", "@4074460", "@4074461", "@4074464", "@4074438", "@4074439", "@4074483", "@4074496", "@4074494",
            "@4074493", "@4076664,4076668", "@4076666", "@4076781", "@4076772", "@4076764", "@4076748", "@4074583", "@4074586", "@4074587", "@4076836",
            "@4076839", "@4076840", "@4076850", "@4076951", "@4077869", "@4077505", "@4078343", "@4078349", "@4077872", "@4077953", "@4077521", "@4076872",
            "@4076962", "@4077854", "@4077468", "@4077503", "@4077970", "@4077049", "@4078272", "@4077962", "@4077518", "@4076852", "@4077876", "@4077500",
            "@4077967", "@4078347", "@4077875", "@4077861", "@4078273", "@4076855", "@4077974", "@4077883", "@4076853", "@5000723", "@5000540", "@5000524",
            "@5000527", "@5000530", "@4077881", "@4078344", "@4077648", "@5001225", "@5000761", "@5000756", "@5000757", "@5003258", "@5002857", "@5001668",
            "@5001664", "@5001717", "@5001661", "@5001408", "@5001401"]

        nm.DisableAutoShaman()
        nm.DisableAutoNewGame()
        nm.DisableAutoTimeLeft()

        nm.Room.GetPlayers().forEach((player) => {
            this.eventNewPlayer(player.Name)
        })

        nm.NewGame(this.maps[Math.floor(Math.random() * this.maps.length)])
    }

    eventUnregister() {
        nm.DisableAutoShaman(false)
        nm.DisableAutoNewGame(false)
        nm.DisableAutoTimeLeft(false)
    }

    eventNewGame() {
        this.started = false

        for (let player of this.players) {
            player.cannonID = 0
            player.shootAt = Date.now()
        }

        nm.SetUIShamanName("<N>Deathmatch")
    }

    eventNewPlayer(playerName) {
        this.players[playerName] = {
            offset: {
                x: 2,
                y: 10,
            },
            cannonType: 0,
            cannonID: 0,
            shootAt: Date.now(),
        }

        for (let key of this.keys) {
            nm.BindKeyboard(playerName, key, true, true)
        }

        nm.SetUIShamanName("<N>Deathmatch", playerName)
    }

    eventPlayerDied(playerName) {
        if (this.players[playerName] == undefined) {
            return
        }
        let alivePlayers = nm.Extensions.GetAlivePlayers()
        nm.SetUIShamanName("<N>Deathmatch: <V>" + alivePlayers.length.toString() + "</V> в живых")
    }

    eventPlayerLeft(playerName) {
        delete this.players[playerName]
    }

    eventKeyboard(playerName, keyCode, down, posX, posY) {
        if (!this.started || this.players[playerName] == undefined) {
            return
        }

        let player = this.players[playerName]
        let roomPlayer = nm.Room.GetPlayer(playerName)
        if (roomPlayer.IsDead) {
            return
        }

        if (keyCode == 0x28 || keyCode == 0x53 || keyCode == 0x20) {
            if (player.shootAt < (Date.now() - 800)) {
                player.shootAt = Date.now()

                if (player.cannonID !== 0) {
                    nm.RemoveObject(player.cannonID)
                }

                var posX = roomPlayer.Turn == 0 ? (posX - player.offset.x) : (posX + player.offset.x)
                var posY = posY + player.offset.y
                var angle = roomPlayer.Turn == 0 ? 270 : 90

                if (player.cannonType == 0)
                    player.cannonID = nm.AddShamanObject(17, posX, posY, angle, 0, 0, false)
                else
                    player.cannonID = nm.AddShamanObject(1700 + player.cannonType, posX, posY, angle, 0, 0, false)
            }
        }
    }

    eventChatCommand(playerName, command) {
        if (this.players[playerName] == undefined) {
            return
        }

        let player = this.players[playerName]
        let args = command.split(" ")
        switch (args[0]) {
            case "offset":
            case "off":
                if (args.length == 0) {
                    nm.ChatMessage(nm.Extensions.Format(Locale.get("deathmatch/offset", Locale.type.self), player.offset.x, player.offset.y), playerName)
                    break
                }
                if (args.length !== 3) {
                    nm.ChatMessage(nm.Extensions.Format(Locale.get("deathmatch/use", Locale.type.self), "!off x(-100-100) y(-100-100)"), playerName)
                    break
                }

                let x = Number(args[1])
                if (Math.abs(x) >= 1 && Math.abs(x) <= 100)
                    player.offset.x = x

                let y = Number(args[2])
                if (Math.abs(y) >= 1 && Math.abs(y) <= 100)
                    player.offset.y = y

                nm.ChatMessage(nm.Extensions.Format(Locale.get("deathmatch/offset", Locale.type.self), player.offset.x, player.offset.y), playerName)
                break
            case "ct":
                if (args.length !== 2) {
                    nm.ChatMessage(nm.Extensions.Format(Locale.get("deathmatch/use", Locale.type.self), "!ct id(1-12)"), playerName)
                    break
                }

                let id = Number(args[1])
                if (id >= 0 && id <= 12) {
                    player.cannonType = id
                }

                break
            case "help":
                nm.ChatMessage(nm.Extensions.Format(Locale.get("deathmatch/use", Locale.type.self), "!off x(-100-100) y(-100-100)"), playerName)
                nm.ChatMessage(nm.Extensions.Format(Locale.get("deathmatch/use", Locale.type.self), "!ct id(1-12)"), playerName)
                break
        }
    }

    eventLoop(time, remaining) {
        if (time >= 3000 && !this.started) {
            this.started = true
        }

        if (remaining >= 500000 || remaining <= 0) {
            nm.NewGame(this.maps[Math.floor(Math.random() * this.maps.length - 1)])
            return
        }

        if (remaining > 10000 && nm.Extensions.GetAlivePlayers().length <= 1) {
            nm.SetGameTime(10)
        }
    }
}