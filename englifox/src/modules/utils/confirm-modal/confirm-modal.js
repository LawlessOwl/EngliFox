import { elementCreator } from "../element-creator/elementCreator"

export class ConfirmModal {
    constructor({message = "Вы уверены?", confirmButtonText = "Да", cancelButtonText = "Нет"}) {
        this.message = message
        this.confirmButtonText = confirmButtonText
        this.cancelButtonText = cancelButtonText
    }

    showModal(){
        return new Promise((resolve) => {
            this.modal = elementCreator("div", "modal")

            const modalContent = elementCreator("div", "modal-content")
            const modalMessage = elementCreator("p", "modal-message", this.message)

            const modalButtons = elementCreator("div", "modal-buttons")
            const confirmButton = elementCreator("button", "confirm-button", this.confirmButtonText)
            const cancelButton = elementCreator("button", "cancel-button", this.cancelButtonText)

            modalButtons.append(confirmButton, cancelButton)
            modalContent.append(modalMessage, modalButtons)
            this.modal.append(modalContent)
            document.body.append(this.modal)

            confirmButton.addEventListener("click", () => this.closeModal(true, resolve))
            cancelButton.addEventListener("click", () => this.closeModal(false, resolve))
        })
    }

    closeModal(result, resolve) {
        this.modal.remove()
        resolve(result)
    }
}