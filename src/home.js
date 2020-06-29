let defaultOptions = {
    plugins: []
}

export default class Home {
    constructor(options) {
        this.options = { ...defaultOptions, ...options }

        this.options.plugins.forEach((plugin) => {
            plugin.home = this
        })
    }

    call(key, args) {
        this.options.plugins.forEach((plugin) => {
            if (!plugin.enabled) return
            if (!plugin[key]) return
            plugin[key].apply(plugin, args)
        })
    }

    getScript() {
        return {
            EventRegister: () => { this.call("eventRegister", []) },
            EventUnregister: () => { this.call("eventUnregister", []) },
            EventChatCommand: (playerName, command) => { this.call("eventChatCommand", [playerName, command]) },
            EventEmotePlayed: (playerName, emoteId) => { this.call("eventEmotePlayed", [playerName, emoteId]) },
            EventItemUsed: (playerName, itemId) => { this.call("eventItemUsed", [playerName, itemId]) },
            EventKeyboard: (playerName, keyCode, down, posX, posY) => { this.call("eventKeyboard", [playerName, keyCode, down, posX, posY]) },
            EventMouse: (playerName, posX, posY) => { this.call("eventMouse", [playerName, posX, posY]) },
            EventLoop: (time, remaining) => { this.call("eventLoop", [time, remaining]) },
            EventNewGame: () => { this.call("eventNewGame", []) },
            EventNewPlayer: (playerName) => { this.call("eventNewPlayer", [playerName]) },
            EventPlayerDied: (playerName) => { this.call("eventPlayerDied", [playerName]) },
            EventPlayerGetCheese: (playerName) => { this.call("eventPlayerGetCheese", [playerName]) },
            EventPlayerLeft: (playerName) => { this.call("eventPlayerLeft", [playerName]) },
            EventPlayerVampire: (playerName) => { this.call("eventPlayerVampire", [playerName]) },
            EventPlayerWon: (playerName) => { this.call("eventPlayerWon", [playerName]) },
            EventPlayerRespawn: (playerName) => { this.call("eventPlayerRespawn", [playerName]) },
            EventPopupAnswer: (id, playerName, answer) => { this.call("eventPopupAnswer", [id, playerName, answer]) },
            EventSummoningStart: (playerName, objectType, posX, posY, angle) => { this.call("eventSummoningStart", [playerName, objectType, posX, posY, angle]) },
            EventSummoningCancel: (playerName) => { this.call("eventSummoningCancel", [playerName]) },
            EventTextAreaCallback: (id, playerName, callback) => { this.call("eventTextAreaCallback", [id, playerName, callback]) },
        }
    }
}