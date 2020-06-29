import EN from "../translations/en"
import RU from "../translations/ru"

export default {
    get: function (key, isMessage = false) {
        let locale
        switch (nm.Room.CommunityName) {
            case "RU":
                locale = RU
                break
            default:
                locale = EN
                break
        }

        if (isMessage)
            return `<font color="#AAAAA">Ξ [${locale["home"]}] ${locale[key]}</font>`

        return locale[key]
    }
}