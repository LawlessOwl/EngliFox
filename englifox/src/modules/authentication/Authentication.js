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

    validateUserInputs() {
        const email = this.emailInput.value.trim()
        const password = this.passwordInput.value.trim()
        if (
            email !== "" &&
            email.length >= 6 &&
            password !== "" &&
            password.length >= 6
            ) {
            this.sendFormButton.removeAttribute("disabled")
        } else {
            this.sendFormButton.setAttribute("disabled", "true")
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

        this.emailInput.addEventListener("input", () => this.validateUserInputs())
        this.usernameInput.addEventListener("input", () => this.validateUserInputs())
        this.passwordInput.addEventListener("input", () => this.validateUserInputs())
        this.form.addEventListener("submit", (e) => this.sendUserInfo(e))
    }
    validateUserInputs() {
        const email = this.emailInput.value.trim()
        const username = this.usernameInput.value.trim()
        const password = this.passwordInput.value.trim()
        if (
            email !== "" &&
            email.length > 6 &&
            email.includes("@") &&
            username !== "" &&
            username.length >= 6 &&
            password !== "" &&
            password.length >= 6
            ) {
            this.sendFormButton.removeAttribute("disabled")
        } else {
            this.sendFormButton.setAttribute("disabled", "true")
        }
    }

    sendUserInfo(e) {
        e.preventDefault()

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
            super.validateUserInputs()
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
        this.emailInput.addEventListener("input", () => this.validateUserInputs())
        this.passwordInput.addEventListener("input", () => this.validateUserInputs())

        this.form.addEventListener("submit", (e) => this.authStatus(e))
    }
    authStatus(e) {
        e.preventDefault()

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

registrationForm.validateUserInputs()
loginForm.validateUserInputs()
return authWindow
}
