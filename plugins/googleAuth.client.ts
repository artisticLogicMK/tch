export default defineNuxtPlugin(() => {
  
  return {
    provide: {
      initGoogleSignIn: (element, handlerName) => {
        const loadGoogleScript = () => {
          return new Promise((resolve) => {
            if (window.google) {
              resolve()
            } else {
              const script = document.createElement("script")
              script.src = "https://accounts.google.com/gsi/client"
              script.async = true
              script.defer = true
              script.onload = resolve
              document.head.appendChild(script)
            }
          })
        }


        loadGoogleScript().then(() => {
          if (window.google && element && handlerName) {
            const isDarkMode = document.documentElement.classList.contains("dark")
            const cid = import.meta.env.VITE_GOOGLE_CID
            
            window.google.accounts.id.initialize({
              client_id: cid,
              callback: window[handlerName], // Dynamically use the correct handler
              auto_prompt: false,
              use_fedcm_for_prompt: true
            })

            window.google.accounts.id.renderButton(element, {
              theme: isDarkMode ? "filled_black" : "outline",
              text: "continue_with",
              size: "large",
              shape: "pill",
              width: 250,
            })
          }
        })
      },
    },
  }
})