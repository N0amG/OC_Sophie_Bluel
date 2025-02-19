
if (document.URL.includes("index.html"))
    //Afficher les projets si on se trouve sur la page d'accueil
    import("./projects.js");

if (document.URL.includes("login.html"))
    import("./login.js");