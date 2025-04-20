import { elementCreator } from "../element-creator/elementCreator"

export const confirmModal = (message) => {
    return new Promise((resolve) => {
        const modal = elementCreator("div", "confirm-modal")

        const modalMessage = elementCreator("div", "modal-message", message)

        const modalButtonsContainer = elementCreator("div", "modal-buttons-container")
        const confirmButton = elementCreator("button", "confirm-button", "Да")
        const cancelButton = elementCreator("button", "cancel-button", "Нет")
        modalButtonsContainer.append(confirmButton, cancelButton)
        modal.append(modalMessage, modalButtonsContainer)
        document.body.append(modal)

        confirmButton.addEventListener("click", () => {
            modal.remove()
            resolve(true)
        })

        cancelButton.addEventListener("click", () => {
            modal.remove()
            resolve(false)
        })
    })
}