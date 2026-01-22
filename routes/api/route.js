const pdf = require("../handler/pdf")

module.exports = function (router) {
   router.get("/ping", pdf.ping) 
   router.get("/export/do-release", pdf.exportDoRelease) 
   router.get("/export/do-acceptance", pdf.exportDoAcceptance) 
}
