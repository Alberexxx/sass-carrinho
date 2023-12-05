
function adminAuht(req, res, next) {
    if ( req.session.usuario != undefined ) {
        if (req.session.usuario.email == "admin@email.com" && req.session.usuario.id == 1) {

        next();

       } else {
         res.redirect("/login")
       }
    } else {
        res.redirect("/login")
    }
}

module.exports = adminAuht