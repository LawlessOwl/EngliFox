import { appRouter } from "../../App.js"
import { elementCreator } from "../utils/element-creator/elementCreator.js"
import { auth } from "../utils/firebase/firebase.js"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseService } from "../utils/firebase/FirebaseService/FirebaseService.js"

const firebaseService = new FirebaseService()

class AuthForm {
    constructor(type) {
        this.form = elementCreator("form", `${type}-form`)
        this.emailInput = elementCreator("input", `${type}-email-input`)
        this.emailInput.type = "email"
        this.emailInput.placeholder = "Введите ваш имейл"
        

        this.passwordInput = elementCreator("input", `${type}-password-input`)
        this.passwordInput.type = "password"
        this.passwordInput.placeholder = "Введите ваш пароль"

        this.sendFormButton = elementCreator("button", `${type}-send-form`, "Отправить")
        this.sendFormButton.type = "submit"

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
        this.usernameInput = elementCreator("input", `username-input`)
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
    }
}

class LoginForm extends AuthForm {
    constructor() {
        super("login")
        this.emailInput.addEventListener("input", () => this.validateUserInputs())
        this.passwordInput.addEventListener("input", () => this.validateUserInputs())

        this.form.addEventListener("submit", (e) => this.authStatus(e))
    }
    authStatus(e) {
        e.preventDefault()

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
            const errorCode = error.code
            const errorMessage = error.message
            const errorElement = elementCreator("p", "error-message", `${errorCode} - ${errorMessage}`)
            authWindow.append(errorElement)
        })
    }
}

export const renderAuth = () => {
    const authWindow = elementCreator("div", "authentication-window")

const goToRegistrationButton = elementCreator("button", "registration-button", "Регистрация")

const goToLoginButton = elementCreator("button", "login-button", "Войти")

const registrationModalWindow = elementCreator("div", "registration-modal-window", null, {
    display: "none"
})

const loginModalWindow = elementCreator("div", "login-modal-window", null, {
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