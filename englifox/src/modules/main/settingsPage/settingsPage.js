import { confirmModal } from "../../utils/confirm-modal/confirm-modal";
import { elementCreator } from "../../utils/element-creator/elementCreator";
import { firebaseService } from "../../utils/firebase/FirebaseService/FirebaseService";

export const renderSettings = () => {
    const settingsContainer = elementCreator("div", "settings-container")
    const settingsForm = elementCreator("form", "settings-form")
    const settingsTitle = elementCreator("h2", "settings-title", "Settings")
    const settingsSubtitle = elementCreator("p", "settings-subtitle", "Change your account settings")
    const changeUsernameButton = elementCreator("button", "change-username-button", "Change username")
    const changePasswordButton = elementCreator("button", "change-password-button", "Change password")
    const logoutButton = elementCreator("button", "logout-button", "Logout")
    const deleteAccountButton = elementCreator("button", "delete-account-button", "Delete account")

    settingsForm.append(settingsTitle, settingsSubtitle, changeUsernameButton, changePasswordButton, logoutButton, deleteAccountButton)
    settingsContainer.append(settingsForm)
    return settingsContainer
}
    