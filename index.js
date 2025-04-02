const elementCreator = (tagName, className, textContent, style) => {
    const element = document.createElement(tagName)
    element.classList.add(className)
    
    if(textContent) {
        element.textContent = textContent
    }

    if (style) {
        Object.entries(style).forEach(([key, value]) => {
          element.style[key] = value;
        });
    }

    return element;
}

const registrationForm = elementCreator("form", "registration-form")

const usernameInput = elementCreator("input", "username-input")
usernameInput.type = "text"
usernameInput.placeholder = "Введите ваше имя"

const passwordInput = elementCreator("input", "password-input")
passwordInput.type = "password"
passwordInput.placeholder = "Введите ваш пароль"

const sendFormButton = elementCreator("button", "send-form-button", "Отправить")
sendFormButton.type = "submit"

const validateUserInputs = () => {
    if (usernameInput.value.trim() !== "" && usernameInput.value.length >= 6 && passwordInput.value.trim() !== "" && passwordInput.value.length >= 6) {
        sendFormButton.removeAttribute("disabled")
    } else {
        sendFormButton.setAttribute("disabled", "true")
    }
}

validateUserInputs()
usernameInput.addEventListener("input", validateUserInputs)
passwordInput.addEventListener("input", validateUserInputs)

const sendUserInfo = (e) => {
    e.preventDefault()

    let userInfoObj = {
        username: usernameInput.value,
        userPassword: passwordInput.value
    }

    localStorage.setItem("userInfo:", JSON.stringify(userInfoObj))
    usernameInput.value = ""
    passwordInput.value = ""
    validateUserInputs()
}
registrationForm.addEventListener("submit", sendUserInfo)

registrationForm.append(usernameInput, passwordInput, sendFormButton)

document.body.append(registrationForm)