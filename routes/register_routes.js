const registerAPI = require("./api/route");

module.exports = function (router) {
    registerAPI(router);
};