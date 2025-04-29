import { elementCreator } from "../../utils/element-creator/elementCreator"
import { firebaseService } from "../../utils/firebase/FirebaseService/FirebaseService"
import { LoadingModal } from "../../utils/loadingModal/loadingModal"
import styles from "./styles/userRating.module.css"

export const renderUsersRating = () => {
    const loadingModal = new LoadingModal()

    const usersRatingContainer = elementCreator("div", styles["users-rating-container"])
    const usersRatingTitle = elementCreator("h2", styles["users-rating-title"], "Рейтинг пользователей")
    const usersRatingTable = elementCreator("table", styles["users-rating-table"])
    const usersRatingTableHeader = elementCreator("thead", styles["users-rating-table-header"])
    const thRow = elementCreator("tr", styles["users-rating-table-header-row"])
    const thUserPosition = elementCreator("th", styles["users-rating-table-header-user-position"], "Позиция")
    const thUsername = elementCreator("th", styles["users-rating-table-header-username"], "Имя пользователя")
    const thUserScore = elementCreator("th", styles["users-rating-table-header-user-score"], "Очки")
    const usersRatingTableBody = elementCreator("tbody", styles["users-rating-table-body"])

    usersRatingTableHeader.append(thRow)
    thRow.append(thUserPosition, thUsername, thUserScore)
    usersRatingTable.append(usersRatingTableHeader, usersRatingTableBody)
    usersRatingContainer.append(usersRatingTitle, usersRatingTable)

    loadingModal.show()
    firebaseService.readAllUsers()
    .then(usersMap => {
        const usersArray = Object.entries(usersMap)

        usersArray.sort((a, b) => b[1].points - a[1].points)

        usersArray.forEach(([userId, user], index) => {
            const userPosition = index + 1
            const username = user.username
            const userPoints = user.points !== undefined ? user.points : 0

            const tr = elementCreator("tr", styles["users-rating-table-body-row"])
            const tdUserPosition = elementCreator("td", styles["users-rating-table-body-user-position"], userPosition)
            const tdUsername = elementCreator("td", styles["users-rating-table-body-username"], username)
            const tdUserScore = elementCreator("td", styles["users-rating-table-body-user-score"], userPoints.toString())
            tr.append(tdUserPosition, tdUsername, tdUserScore)
            usersRatingTableBody.append(tr)
        })
        loadingModal.hide()
    })
    .catch(error => {
        console.log(error)
        loadingModal.hide()
    })

    return usersRatingContainer
}
