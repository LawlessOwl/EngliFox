import { elementCreator } from "../utils/element-creator/elementCreator.js";
import { appRouter } from "../../App.js"
import styles from "./styles/mainPage.module.css"
import { renderTasks } from "./englishTasks/initTask.js";
import { renderUsersRating } from "./usersRating/usersRating.js";

const navMenuRedirect = (e, route) => {
    e.preventDefault()
    appRouter.navigate(route)
}

const createNavButton = (text) => {
    const button = elementCreator("button", styles["nav-menu-button"], text)

    if (text === "logout") {
        button.addEventListener("click", (e) => {
            e.preventDefault()
            appRouter.navigate("/auth")
        })
    } else {
        button.addEventListener("click", (e) => navMenuRedirect(e, `/${text}`))
    }
    return(button)
}

export const renderMain = (page = "home") => {
    const mainPageContainer = elementCreator("div", styles["main-page-container"])
    const mainPageBody = elementCreator("div", styles["main-page-body"])

    const pageHeader = elementCreator("pageHeader", styles["page-header"], "EngliFox")

    const sidebar = elementCreator("div", styles["sidebar"])

    const homePageButton = createNavButton("home")
    const ratingPageButton = createNavButton("rating")
    const settingsPageButton = createNavButton("settings")
    const logoutButton = createNavButton("logout")
   
    sidebar.append(homePageButton, ratingPageButton, settingsPageButton, logoutButton)

    const pageContent = elementCreator("div", "page-content")

    switch (page) {
        case "home":
            pageContent.append(renderTasks())
            break
        case "rating":
            pageContent.append(renderUsersRating())
            break
        default:
            pageContent.append(renderTasks())
            break
    }

    mainPageBody.append(sidebar, pageContent)
    mainPageContainer.append(pageHeader, mainPageBody)
    return mainPageContainer
}