import { elementCreator } from "../element-creator/elementCreator.js"
import styles from "./styles/confirm-modal.module.css"

export class ConfirmModal {
    constructor({message = "Вы уверены?", confirmButtonText = "Да", cancelButtonText = "Нет", showCancelButton = true}) {
        this.message = message
        this.confirmButtonText = confirmButtonText
        this.cancelButtonText = cancelButtonText
        this.showCancelButton = showCancelButton
    }

    showModal(){
        return new Promise((resolve) => {
            this.modalShadow = elementCreator("div", styles["modal-shadow"])

            this.modal = elementCreator("div", styles["modal"])

            const modalContent = elementCreator("div", styles["modal-content"])
            const modalMessage = elementCreator("p", styles["modal-message"], this.message)

            const modalButtons = elementCreator("div", styles["modal-buttons"])
            const confirmButton = elementCreator("button", styles["confirm-button"], this.confirmButtonText)

            modalButtons.append(confirmButton)

            if (this.showCancelButton) {
                const cancelButton = elementCreator("button", styles["cancel-button"], this.cancelButtonText)
                modalButtons.append(cancelButton)
                cancelButton.addEventListener("click", () => this.closeModal(false, resolve))
            }

            modalContent.append(modalMessage, modalButtons)
            this.modal.append(modalContent)
            document.body.append(this.modalShadow, this.modal)

            document.body.style.overflow = "hidden"

            confirmButton.addEventListener("click", () => this.closeModal(true, resolve))

            if (this.showCancelButton) {
                this.modalShadow.addEventListener("click", () => this.closeModal(false, resolve))
            }
        })
    }

    closeModal(result, resolve) {
        this.modalShadow.remove()
        this.modal.remove()
        document.body.style.overflow = ""
        resolve(result)
    }
}
