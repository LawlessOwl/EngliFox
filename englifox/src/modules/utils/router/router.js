export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = ""

        window.addEventListener("popstate", () => {
            this.handleRoute(window.location.pathname)
        })

        this.handleRoute(window.location.pathname)
    }

    handleRoute(path) {
        this.currentPath = path
        const route = this.routes[path] || this.routes["/404"]
        const rootElement = document.getElementById('app')
        rootElement.innerHTML = ""
        const content = route()
        rootElement.append(content)
    }

    navigate(path) {
        window.history.pushState({}, "", path)
        this.handleRoute(path)
    }
}