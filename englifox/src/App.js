import { renderAuth } from "./modules/authentication/Authentication.js"
import { elementCreator } from "./modules/utils/element-creator/elementCreator.js"
import { renderMain } from "./modules/main/mainPage.js"
import { Router } from "./modules/utils/router/router.js"
import { renderTasks } from "./modules/main/englishTasks/initTask.js"
import { renderUsersRating } from "./modules/main/usersRating/usersRating.js"

const routes = {
    "/": () => {
        const userData = localStorage.getItem("userInfo")
        return userData ? renderMain("home") : renderAuth()
    },
    "/home": () => renderMain("home"),
    "/rating": () => renderMain("rating"),
    "/auth": renderAuth,
}

const rootElement = elementCreator("div", "app")
rootElement.id = "app"
document.body.append(rootElement)

export const appRouter = new Router(routes)