import type { ComponentType } from "react"
import { forwardRef, useEffect, useState } from "react"
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

// Learn more: https://www.framer.com/docs/guides/overrides/

const useStore = createStore({
    theme: "",
})

const changeTheme = (theme: string) => {
    const htmlElement = document.getElementsByTagName("html")[0]
    const bodyElement = document.getElementsByTagName("body")[0]

    htmlElement.setAttribute("toggle-theme", `${theme}`)
    bodyElement.setAttribute("toggle-theme", `${theme}`)
    if (theme === "system") {
        localStorage.getItem("currentToggleState") &&
            localStorage.removeItem("currentToggleState")
    } else {
        localStorage.setItem("currentToggleState", `${theme}`)
    }
    const event = new Event("themeChange")
    window.dispatchEvent(event)
    // console.log(event)
    return
}

export function withToggleTheme(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()

        // Detect theme and setup stylesheets on mount
        useEffect(() => {
            const updateTheme = () => {
                const prefersDarkScheme = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                )
                const prefersLightScheme = window.matchMedia(
                    "(prefers-color-scheme: light)"
                )
                // If true set theme to system otherwise set it to light
                const detectedTheme: string =
                    prefersDarkScheme.matches || prefersLightScheme.matches
                        ? "system"
                        : "light"

                // Store the theme
                setStore({ theme: `${detectedTheme}` })
            }

            updateTheme()

            // Create attributes on html and body so that theme will be applied based on store
            const htmlElement = document.getElementsByTagName("html")[0]
            const bodyElement = document.getElementsByTagName("body")[0]
            htmlElement &&
                htmlElement.setAttribute("toggle-theme", `${store.theme}`)

            bodyElement &&
                bodyElement.setAttribute("toggle-theme", `${store.theme}`)

            // Create sets of light and dark mode tokens
            let lightThemeTokens: string[] | string = []
            let darkThemeTokens: string[] | string = []
            for (let i = 0; i < document.styleSheets.length; i++) {
                const sheet = document.styleSheets[i]
                try {
                    for (let rule of sheet.cssRules) {
                        // Get light and dark mode tokens
                        if (rule.selectorText === "body") {
                            const style = rule.style
                            for (let j = 0; j < style.length; j++) {
                                const propertyName = style[j]
                                if (propertyName.includes("--token")) {
                                    const value =
                                        style.getPropertyValue(propertyName)
                                    // Check for specific tokens or list all
                                    const combinedCssRule = `${propertyName}: ${value};`
                                    lightThemeTokens.push(combinedCssRule)
                                }
                            }
                            lightThemeTokens = lightThemeTokens.join(" ")
                        } else if (
                            rule.conditionText ===
                            "(prefers-color-scheme: dark)"
                        ) {
                            const mediaRulesString = rule.cssRules[0].cssText
                                .replace("body", "")
                                .replace(/\s*{\s*/, "")
                                .replace(/\s*}\s*$/, "")
                            darkThemeTokens = mediaRulesString
                        }
                    }
                } catch (e) {
                    console.warn("Cannot access stylesheet:", sheet.href)
                }
            }

            // Create styleSheet with id and populate with correct CSS text
            let styleElement = document.createElement("style")
            styleElement.id = "toggle-theme"
            const customCssRule = `body[toggle-theme="light"] {${lightThemeTokens}} body[toggle-theme="dark"]{${darkThemeTokens}} html[toggle-theme="light"] { color-scheme: light; } html[toggle-theme="dark"] { color-scheme: dark; }`
            styleElement.textContent = customCssRule
            document.head.appendChild(styleElement)
        }, [])

        return <Component {...props} />
    }
}

export function withLightTheme(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()

        // Handle the click
        const clickLightTheme = () => {
            setStore({ theme: "light" })
            changeTheme("light")
        }

        return (
            <Component
                {...props}
                variant={store.theme === "light" ? "Active" : "Inactive"}
                whileHover={{ scale: 1.2 }}
                onClick={clickLightTheme}
            />
        )
    }
}

export function withDarkTheme(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()

        const clickDarkTheme = () => {
            // Storing the mode
            setStore({ theme: "dark" })
            changeTheme("dark")
        }

        return (
            <Component
                {...props}
                variant={store.theme === "dark" ? "Active" : "Inactive"}
                whileHover={{ scale: 1.2 }}
                onClick={clickDarkTheme}
            />
        )
    }
}

export function withSystemTheme(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()

        const clickSystemTheme = () => {
            if (store.theme === "system") {
                return
            } else {
                // Store the theme choice
                setStore({ theme: "system" })
                changeTheme("system")
            }
        }
        return (
            <Component
                {...props}
                variant={store.theme === "system" ? "Active" : "Inactive"}
                onClick={clickSystemTheme}
                whileHover={{ scale: 1.2 }}
            />
        )
    }
}
