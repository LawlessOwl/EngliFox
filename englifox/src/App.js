import { renderAuth } from "./modules/authentication/Authentication.js"
import { elementCreator } from "./modules/element-creator/elementCreator.js"
import { renderMain } from "./modules/main/mainPage.js"
import { Router } from "./modules/router/router.js"



const routes = {
    "/": () => {
        const userData = localStorage.getItem("userInfo")
        return userData ? renderMain() : renderAuth()
    },
    "/main": renderMain,
    "/auth": renderAuth,
}

const rootElement = elementCreator("div", "app")
rootElement.id = "app"
document.body.append(rootElement)

export const appRouter = new Router(routes)

