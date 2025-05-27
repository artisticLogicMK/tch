export const setTheme = (mode) => {
  document.documentElement.classList.remove("dark", "light")
  document.documentElement.classList.add(mode)
  document.querySelector('meta[name=theme-color]')?.setAttribute("content", mode === "dark" ? "#020617" : "#ffffff")
}

export const initTheme = () => {
  if (!("theme" in localStorage)) {
    setTheme("light")
  } else if (localStorage.theme === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark")
  } else {
    setTheme("light")
  }
}