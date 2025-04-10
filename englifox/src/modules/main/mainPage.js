import { elementCreator } from "../element-creator/elementCreator.js";
import { appRouter } from "../../App.js"
import styles from "./styles/mainPage.module.css"
/*
TODO
Что сделать?
В первую очередь заняться навигацией
Потом сделаю логику с заданиями
1) убрать поведение ссылок по умолчанию
2) потом добавить переход на нужную страницу
*/
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

export const renderMain = () => {
    const mainPageContainer = elementCreator("div", styles["main-page-container"])
    const mainPageBody = elementCreator("div", styles["main-page-body"])

    const pageHeader = elementCreator("pageHeader", styles["page-header"], "EngliFox")

    const sidebar = elementCreator("div", styles["sidebar"])

    const homePageButton = createNavButton("home")
    const ratingPageButton = createNavButton("rating")
    const settingsPageButton = createNavButton("settings")
    const logoutButton = createNavButton("logout")
   
    sidebar.append(homePageButton, ratingPageButton, settingsPageButton, logoutButton)


    const mainPageContent = elementCreator("div", "main-page-content")

    mainPageBody.append(sidebar, mainPageContent)
    mainPageContainer.append(pageHeader, mainPageBody)
    return mainPageContainer
}