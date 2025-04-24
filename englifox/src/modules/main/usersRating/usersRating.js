import { elementCreator } from "../../utils/element-creator/elementCreator"
import { firebaseService } from "../../utils/firebase/FirebaseService/FirebaseService"

export const renderUsersRating = () => {

    const usersRatingContainer = elementCreator("div", "users-rating-container")
    const usersRatingTitle = elementCreator("h2", "users-rating-title", "Рейтинг пользователей")
    const usersRatingTable = elementCreator("table", "users-rating-table")
    const usersRatingTableHeader = elementCreator("thead", "users-rating-table-header")
    const thRow = elementCreator("tr", "users-rating-table-header-row")
    const thUserPosition = elementCreator("th", "users-rating-table-header-user-position", "Позиция")
    const thUsername = elementCreator("th", "users-rating-table-header-username", "Имя пользователя")
    const thUserScore = elementCreator("th", "users-rating-table-header-user-score", "Очки")
    const usersRatingTableBody = elementCreator("tbody", "users-rating-table-body")

    usersRatingTableHeader.append(thRow)
    thRow.append(thUserPosition, thUsername, thUserScore)
    usersRatingTable.append(usersRatingTableHeader, usersRatingTableBody)
    usersRatingContainer.append(usersRatingTitle, usersRatingTable)

    firebaseService.readAllUsers()
    .then(usersMap => {
        const usersArray = Object.entries(usersMap)

        usersArray.sort((a, b) => b[1].points - a[1].points)

        usersArray.forEach(([userId, user], index) => {
            const userPosition = index + 1
            const username = user.username
            const userPoints = user.points !== undefined ? user.points : 0

            const tr = elementCreator("tr", "users-rating-table-body-row")
            const tdUserPosition = elementCreator("td", "users-rating-table-body-user-position", userPosition)
            const tdUsername = elementCreator("td", "users-rating-table-body-username", username)
            const tdUserScore = elementCreator("td", "users-rating-table-body-user-score", userPoints.toString())
            tr.append(tdUserPosition, tdUsername, tdUserScore)
            usersRatingTableBody.append(tr)
        })
    })
    .catch(error => {
        console.log(error)
    })

    return usersRatingContainer
}