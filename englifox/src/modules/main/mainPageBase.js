import { elementCreator } from "../utils/element-creator/elementCreator.js";
import styles from "./styles/mainPage.module.css"

export const renderHeader = () => {
    const pageHeader = elementCreator("div", styles["page-header"], "EngliFox")
    return pageHeader
}

export const renderSidebar = (router) => {
    const sidebar = elementCreator("div", styles["sidebar"])

    const routesButtons = ["home", "rating", "settings", "logout"]
    
    routesButtons.forEach(route => {
        const button = elementCreator("button", styles["nav-menu-button"], route)
        button.addEventListener("click", (e) => {
            e.preventDefault()
            router.navigate(route === "logout" ? "/auth" : `/${route}`)
        })
        sidebar.append(button)
    })
    return sidebar
}

export const renderMain = (router) => {
    const pageHeader = renderHeader()
    const sidebar = renderSidebar(router)

    const mainPageContainer = elementCreator("div", styles["main-page-container"])
    const pageBody = elementCreator("div", styles["main-page-body"])
    const contentContainer = elementCreator("div", "main-page-content")

    pageBody.append(contentContainer)
    mainPageContainer.append(pageHeader, sidebar, pageBody)

    return { mainPageContainer, contentContainer }
}