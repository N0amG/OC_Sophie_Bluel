
if (document.URL.includes("index.html") || document.URL.endsWith("FrontEnd/")) {
    // Afficher les projets si on se trouve sur la page d'accueil
    import("./display.js");
}

if (document.URL.includes("login.html"))
    import("./login.js");