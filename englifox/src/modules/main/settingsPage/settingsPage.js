import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { appRouter } from "../../../App";
import { ConfirmModal } from "../../utils/confirm-modal/confirm-modal";
import { elementCreator } from "../../utils/element-creator/elementCreator";
import { firebaseService } from "../../utils/firebase/FirebaseService/FirebaseService";
import { LoadingModal } from "../../utils/loadingModal/loadingModal";
import styles from "./styles/settingsPage.module.css";


export class SettingsPage {
    constructor(userId) {
        this.userId = userId
        this.container = elementCreator("div", styles["settings-page"])
        this.form = elementCreator("form", styles["settings-form"])
        this.render()
        this.LoadingModal = new LoadingModal()
    }

    render() {
        const formHeader = elementCreator("h2", styles["form-header"], "Настройки")
        const subtitle = elementCreator("p",  styles["subtitle"], "Здесь вы можете сменить настройки аккаунта")

        const changeUsernameButton = elementCreator("button", styles["change-username-button"], "Сменить имя пользователя")
        const changePasswordButton = elementCreator("button", styles["change-password-button"], "Сменить пароль")
        const resetAccountProgressButton = elementCreator("button", styles["reset-account-progress-button"], "Сбросить прогресс")
        const deleteAccountButton = elementCreator("button", styles["delete-account-button"], "Удалить аккаунт")

        changeUsernameButton.addEventListener("click", (e) => this.handleChangeUsernameButtonClick(e))
        changePasswordButton.addEventListener("click", (e) => this.handleChangePasswordButtonClick(e))
        resetAccountProgressButton.addEventListener("click", (e) => this.handleResetAccountProgressButtonClick(e))
        deleteAccountButton.addEventListener("click", (e) => this.handleDeleteAccountButtonClick(e))

        this.form.append(formHeader, subtitle, changeUsernameButton, changePasswordButton, resetAccountProgressButton, deleteAccountButton)
        this.container.append(this.form)
    }

    async handleChangeUsernameButtonClick(e) {
        e.preventDefault()
        this.LoadingModal.show()
        const modal = new ConfirmModal({ message: "Вы уверены, что хотите изменить имя пользователя?" })
        const isConfirmed = await modal.showModal()
        if(!isConfirmed) {
            this.LoadingModal.hide()
            return
        }

        const newUsername = prompt("Введите новое имя пользователя")
        if(newUsername) {
            const user = await firebaseService.readUserData(this.userId)
            await firebaseService.updateUserData(this.userId, {
                ...user,
                username: newUsername
            })
            this.LoadingModal.hide()
        }
    }

    async handleChangePasswordButtonClick(e) {
        e.preventDefault()
        this.LoadingModal.show()
        const modal = new ConfirmModal({ message: "Вы уверены, что хотите изменить пароль?" })
        const isConfirmed = await modal.showModal()
        if(!isConfirmed) {
            this.LoadingModal.hide()
            return
        }

        const newPassword = prompt("Введите новый пароль")
        if(newPassword) {
            const auth = firebaseService.getAuth()
            const currentUser = auth.currentUser
            const oldPassword = prompt("Введите старый пароль для подтверждения сммены пароля")
            if (currentUser) {
                try {
                    const credential = EmailAuthProvider.credential(currentUser.email, oldPassword)
                    await reauthenticateWithCredential(currentUser, credential)

                    await updatePassword(currentUser, newPassword)
                    alert("Пароль успешно изменен")
                } catch (error) {
                    if (error.code === "auth/wrong-password") {
                        alert("Неверный пароль")
                    } else {
                        console.log(`Ошибка: ${error.message}`)
                    }
                }
                this.LoadingModal.hide()
            }
        }
    }

    async handleResetAccountProgressButtonClick(e) {
        e.preventDefault()
        this.LoadingModal.show()
        const modal = new ConfirmModal({ message: "Вы уверены, что хотите сбросить прогресс?" })
        const isConfirmed = await modal.showModal()
        if(!isConfirmed) {
            this.LoadingModal.hide()
            return
        }

        await firebaseService.resetUserProgress(this.userId)
        this.LoadingModal.hide()
        const message = elementCreator("p", styles["message"], "Прогресс успешно сброшен")
        this.form.append(message)
        setTimeout(() => message.remove(), 2000)
    }

    async handleDeleteAccountButtonClick(e) {
        this.LoadingModal.show()
        e.preventDefault()
        const modal = new ConfirmModal({ message: "Вы уверены, что хотите удалить аккаунт?" })
        const isConfirmed = await modal.showModal()
        if(!isConfirmed) return

        await firebaseService.deleteUserData(this.userId)
        appRouter.navigate("/")
        this.LoadingModal.hide()
    }

    getContainer() {
        return this.container
    }
}
