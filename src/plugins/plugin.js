export default class Plugin {
    constructor(options) {
        if (new.target === Plugin) {
            throw new TypeError("Cannot construct Plugin instances directly");
        }

        if (options?.enabled == false) {
            this.enabled = false
        } else {
            this.enabled = true
        }
    }
}