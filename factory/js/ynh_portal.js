// === GLOBALS ===

const THEME_COOKIE_NAME = "blahaj_portal_theme"

const ASSETS_URL = "https://assets.blahaj.land"

const APPS_URL = `${ASSETS_URL}/json/apps.json`

// === TOOLS ===

const setTheme = (theme) => {
    document.querySelector('html').dataset.theme = theme
    Cookies.setCookie(THEME_COOKIE_NAME, theme)
}

const setThemeFromCookie = () => {
    setTheme(Cookies.getCookie(THEME_COOKIE_NAME) === 'dark' ? 'dark' : 'light')
}

const switchTheme = () => {
    let curTheme = document.querySelector('html').dataset.theme
    setTheme(curTheme === 'dark' ? 'light' : 'dark')
}

const Theme = {
    setThemeFromCookie: () => setThemeFromCookie(), switchTheme: () => switchTheme()
}

const fetchApps = async () => {
    let request = await fetch(APPS_URL)
    if (!request.ok) return null
    let data = await request.json()
    if (!('apps' in data)) return null
    let map = new Map()
    data.apps.forEach((e) => map.set(e.yuno, e))
    return map
}

const Cookies = {
    setCookie: (key, value, days = 1) => {
        let date = new Date()
        date.setTime(date.getTime() + (days * 86400 * 1000))
        document.cookie = `${key}=${value}; expires=${date.toUTCString()}; SameSite=Strict`
    },

    getCookie: (key) => {
        const cookies = decodeURIComponent(document.cookie)
            .split(new RegExp('; ?'))
        for (let cookie of cookies) {
            let pair = cookie.split("=")
            if (pair[0].trim() === key.trim()) return pair[1]
        }
        return null
    }
}

/** Add Event
 https://github.com/Darklg/JavaScriptUtilities/blob/master/assets/js/vanilla-js/libs/vanilla-events.js
 */
window.addEvent = (el, eventName, callback, options) => {
    if (!el) return
    if (!options || typeof (options) !== "object") options = {}
    options.capture = false
    el.addEventListener(eventName, callback, options)
}

// === INITS ===

window.addEvent(document, 'DOMContentLoaded', async () => initPortal().then())

const initPortal = async () => {
    window.addEvent(document.getElementById('add-mailalias'), "click", () => {
        let lastInput = document.querySelector('.mailalias-input')
        let inputAliasClone = lastInput.cloneNode(true)
        inputAliasClone.value = ''
        lastInput.after(inputAliasClone)
    })

    window.addEvent(document.getElementById('add-maildrop'), "click", () => {
        let lastInput = document.querySelector('.maildrop-input')
        let inputDropClone = lastInput.cloneNode(true)
        inputDropClone.value = ''
        lastInput.after(inputDropClone)
    })

    let currentState = "hide"

    window.addEvent(document.getElementById('BlahajHide'), "click", () => {
        currentState = currentState === "hide" ? "show" : "hide"
        document.getElementById('password').type = currentState === "hide" ? "password" : "text"
        document.getElementById('BlahajHide').querySelector('img').src = `${ASSETS_URL}/icons/${currentState}.png`
    })

    Theme.setThemeFromCookie()

    let themeSwitch = document.getElementById('switch-theme')
    if (themeSwitch) themeSwitch.onclick = () => Theme.switchTheme()

    let appInfos = await fetchApps()
    if (appInfos) {
        Array.from(document.getElementsByClassName("BlahajAppTile")).forEach((el) => {
            let appInfo = appInfos.get(el.getAttribute('data-appname'))
            if (appInfo) {
                el.style.backgroundColor = appInfo.color
                el.title = appInfo.desc ? appInfo.desc : appInfo.title
                el.querySelector('.BlahajName').style.color = 'var(--fixed-text)'
                el.querySelector('.BlahajAppIcon').src = appInfo.img
            }
        })
    }

    /* TODO : 1/1000 Fey easter egg */
}