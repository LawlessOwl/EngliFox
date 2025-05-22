import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { appRouter } from "../../App.js";
import { elementCreator } from "../utils/element-creator/elementCreator.js";
import { auth } from "../utils/firebase/firebase.js";
import { firebaseService } from "../utils/firebase/FirebaseService/FirebaseService.js";
import { LoadingModal } from "../utils/loadingModal/loadingModal.js";
import styles from "./Authentication.module.css";

class AuthForm {
    constructor(type) {
        this.form = elementCreator("form", styles[`${type}-form`])
        this.emailInput = elementCreator("input", styles[`${type}-email-input`])
        this.emailInput.type = "email"
        this.emailInput.placeholder = "Введите ваш имейл"


        this.passwordInput = elementCreator("input", styles[`${type}-password-input`])
        this.passwordInput.type = "password"
        this.passwordInput.placeholder = "Введите ваш пароль"

        this.sendFormButton = elementCreator("button", styles[`${type}-send-form`], "Отправить")
        this.sendFormButton.type = "submit"

        this.LoadingModal = new LoadingModal()

        this.form.append(this.emailInput, this.passwordInput, this.sendFormButton)
    }

    validateUserInputs(shouldShowErrors = false) {
        const email = this.emailInput.value.trim()
        const password = this.passwordInput.value.trim()

        const isEmailValid = email !== "" && email.length > 6 && email.includes("@")
        const isPasswordValid = password !== "" && password.length >= 6

        if (shouldShowErrors) {
            this.showOrRemoveError(this.emailInput, "Некорректный имейл", isEmailValid)
            this.showOrRemoveError(this.passwordInput, "Пароль должен быть длиннее 6-ти символов", isPasswordValid)
        }

        return isEmailValid && isPasswordValid
    }

    showOrRemoveError(input, errorMessage, condition) {
        const existingErrorElement = input.parentElement.querySelector(`.${styles["input-error"]}`)

        if (!condition) {
            if (!existingErrorElement) {
                const errorElement = elementCreator("p", styles["input-error"], errorMessage)
                input.parentElement.append(errorElement)
            }
        } else {
            if (existingErrorElement) {
                existingErrorElement.remove()
            }
        }
    }

    getForm() {
        return this.form
    }
}

class RegistrationForm extends AuthForm {
    constructor() {
        super("registration")
        this.usernameInput = elementCreator("input", styles[`username-input`])
        this.usernameInput.type = "text"
        this.usernameInput.placeholder = "Введите ваше имя пользователя"
        this.form.prepend(this.usernameInput)

        this.form.addEventListener("submit", (e) => this.sendUserInfo(e))
    }

    validateUserInputs(shouldShowErrors = false) {
        const email = this.emailInput.value.trim()
        const username = this.usernameInput.value.trim()
        const password = this.passwordInput.value.trim()

        const isEmailValid = email !== "" && email.length > 6 && email.includes("@")
        const isPasswordValid = password !== "" && password.length >= 6
        const isUsernameValid = username !== "" && username.length >= 6

        if (shouldShowErrors) {
            this.showOrRemoveError(this.usernameInput, "Имя пользователя должно быть длиннее 6-ти символов", isUsernameValid)
            this.showOrRemoveError(this.emailInput, "Имейл должен быть длиннее 6-ти символов", isEmailValid)
            this.showOrRemoveError(this.passwordInput, "Пароль должен быть длиннее 6-ти символов", isPasswordValid)
        } else {

            this.removeAllErrors()
        }

        return isEmailValid && isPasswordValid && isUsernameValid
    }

    removeAllErrors() {
        const errorElements = this.form.querySelectorAll(`.${styles["input-error"]}`)
        errorElements.forEach(element => element.remove())
    }

    sendUserInfo(e) {
        e.preventDefault()

        const isValid = this.validateUserInputs(true)
        if (!isValid) return

        this.LoadingModal.show()

        const email = this.emailInput.value.trim()
        const username = this.usernameInput.value.trim()
        const password = this.passwordInput.value.trim()


        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            const userId = user.uid

            const userInfo = {
                username,
                email,
                password,
                points: 0,
                completedTasks: {},
            }

            return firebaseService.writeUserData(userId, userInfo)
        })
        .then(() => {
            console.log(`Пользователь ${username} успешно зарегистрирован`)
            this.emailInput.value = ""
            this.usernameInput.value = ""
            this.passwordInput.value = ""
            this.validateUserInputs(false)
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(`Проблема проблема: ${errorCode} - ${errorMessage}`)
        })
        .finally(() => {
            this.LoadingModal.hide()
        })
    }
}

class LoginForm extends AuthForm {
    constructor(auth) {
        super("login")

        this.form.addEventListener("submit", (e) => this.authStatus(e))
    }

    removeAllErrors() {
        const errorElements = this.form.querySelectorAll(`.${styles["input-error"]}`)
        errorElements.forEach(element => element.remove())
    }

    authStatus(e) {
        e.preventDefault()

        const isValid = this.validateUserInputs(true)
        if (!isValid) return

        this.LoadingModal.show()

        const email = this.emailInput.value.trim()
        const password = this.passwordInput.value.trim()

        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user

            const userProfile = await firebaseService.readUserData(user.uid)

            if (userProfile) {
                appRouter.navigate("/home")
            } else {
                console.log("Пользователь не найден")
            }
        })
        .catch((error) => {
            const existingErrorElement = this.form.querySelector(`.${styles["error-element"]}`)
            if (existingErrorElement) {
                existingErrorElement.remove()
            }

            const errorElement = elementCreator("p", styles["error-element"], `произошла ошибочка: введите правильный email и пароль`)
            this.form.append(errorElement)
        })
        .finally(() => {
            this.LoadingModal.hide()
        })
    }
}

export const renderAuth = () => {
const authWindow = elementCreator("div", styles["authentication-window"])

const goToRegistrationButton = elementCreator("button", styles["registration-button"], "Регистрация")

const goToLoginButton = elementCreator("button", styles["login-button"], "Войти")

const registrationModalWindow = elementCreator("div", styles["registration-modal-window"], null, {
    display: "none"
})

const loginModalWindow = elementCreator("div", styles["login-modal-window"], null, {
    display: "none"
})

const openRegistrationModal = () => {
    registrationModalWindow.style.display = "block"
    loginModalWindow.style.display = "none"
}

const openLoginModal = () => {
    loginModalWindow.style.display = "block"
    registrationModalWindow.style.display = "none"
}

goToRegistrationButton.addEventListener("click", openRegistrationModal)
goToLoginButton.addEventListener("click", openLoginModal)

const registrationForm = new RegistrationForm()
const loginForm = new LoginForm()

registrationModalWindow.append(registrationForm.getForm())
loginModalWindow.append(loginForm.getForm())

authWindow.append(goToRegistrationButton, goToLoginButton, registrationModalWindow, loginModalWindow)

return authWindow
}
