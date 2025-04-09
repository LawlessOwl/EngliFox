import { elementCreator } from "../element-creator/elementCreator.js";
/*TO DO
Что мне необходимо сделать на этой странице?
1) Это ракидать элементы по своим местам, добавим базовые стили для разграничивания
к примеру банальные полосы, чтобы вообще понимать что и где находится
2) нужно написать лоигку бокового меню с роутами
3) нужно написать логику выбора заданий
*/
export const renderMain = () => {
    const mainPageContainer = elementCreator("div", "main-page-container")

const pageHeader = elementCreator("pageHeader", "page-header", "EngliFox")

const sidebar = elementCreator("div", "sidebar")

const homePageButton = elementCreator("a", "home-page-button", "home")
const ratingPageButton = elementCreator("a", "rating-page-button", "rating")
const settingsPageButton = elementCreator("a", "settings-page-button", "settings")
const logoutButton = elementCreator("a", "logout-button", "logout")
sidebar.append(homePageButton, ratingPageButton, settingsPageButton, logoutButton)


const mainPageContent = elementCreator("div", "main-page-content")

mainPageContainer.append(pageHeader, sidebar)
return mainPageContainer
}