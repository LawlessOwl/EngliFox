import { elementCreator } from "../element-creator/elementCreator"
import styles from "./styles/confirm-modal.module.css"

export class ConfirmModal {
    constructor({message = "Вы уверены?", confirmButtonText = "Да", cancelButtonText = "Нет"}) {
        this.message = message
        this.confirmButtonText = confirmButtonText
        this.cancelButtonText = cancelButtonText
    }

    showModal(){
        return new Promise((resolve) => {
            this.modalShadow = elementCreator("div", styles["modal-shadow"])

            this.modal = elementCreator("div", styles["modal"])

            const modalContent = elementCreator("div", styles["modal-content"])
            const modalMessage = elementCreator("p", styles["modal-message"], this.message)

            const modalButtons = elementCreator("div", styles["modal-buttons"])
            const confirmButton = elementCreator("button", styles["confirm-button"], this.confirmButtonText)
            const cancelButton = elementCreator("button", styles["cancel-button"], this.cancelButtonText)

            modalButtons.append(confirmButton, cancelButton)
            modalContent.append(modalMessage, modalButtons)
            this.modal.append(modalContent)
            document.body.append(this.modalShadow, this.modal)

            document.body.style.overflow = "hidden"

            confirmButton.addEventListener("click", () => this.closeModal(true, resolve))
            cancelButton.addEventListener("click", () => this.closeModal(false, resolve))
            this.modalShadow.addEventListener("click", () => this.closeModal(false, resolve))
        })
    }

    closeModal(result, resolve) {
        this.modalShadow.remove()
        this.modal.remove()
        resolve(result)
    }
}
