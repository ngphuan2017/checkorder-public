let isAnimating = false

const OPEN_MENU_CLASS = "open-menu"
const OPEN_UL_CLASS = "open-ul"
const SHOW_LINKS_CLASS = "show-nav-links"

document.addEventListener('DOMContentLoaded', () => {
    // Lấy thông tin từ localStorage
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    let fullname = localStorage.getItem('fullname');
    let role = parseInt(localStorage.getItem('roleId')); // Chuyển về số nếu cần so sánh
    let expire = localStorage.getItem('expire');
});

function openMenu() {
    if (isAnimating) return

    isAnimating = true
    setTimeout(() => {
        isAnimating = false
    }, 1100) // Match CSS animation duration

    const folder = document.getElementById("button-bar")
    const ul = document.getElementById("ul")
    const navLinks = document.querySelectorAll(".nav-links")

    folder.classList.toggle(OPEN_MENU_CLASS)
    ul.classList.toggle(OPEN_UL_CLASS)

    // Apply staggered animation delay
    navLinks.forEach((navLink, index) => {
        navLink.style.setProperty("--transitionDelay-100", `${0.3 + index * 0.3}s`)
        navLink.classList.toggle(SHOW_LINKS_CLASS)
    })
}

function closeMenu() {
    const folder = document.getElementById("button-bar")
    const ul = document.getElementById("ul")
    const navLinks = document.querySelectorAll(".nav-links")

    if (folder.classList.contains(OPEN_MENU_CLASS)) {
        folder.classList.remove(OPEN_MENU_CLASS)
        ul.classList.remove(OPEN_UL_CLASS)
        navLinks.forEach((link) => link.classList.remove(SHOW_LINKS_CLASS))
    }
}

// Close menu when clicking outside
document.addEventListener("click", (event) => {
    const menuButton = document.getElementById("menu-button")
    if (!menuButton.contains(event.target)) {
        closeMenu()
    }
})