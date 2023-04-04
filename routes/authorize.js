const jwt_decode = require("jwt-decode");

let checkUserRole = (accessToken, role) => {
    try {
        const payload = jwt_decode(accessToken);
        const userRoles = payload && payload.realm_access && payload.realm_access.roles;
        if (userRoles) {
            return userRoles.includes(role)
        }
        return false;
    } catch (err) {
        console.error("Error while decoding token and fetching roles.", err);
        return false;
    }
}

let getTokenPayload = token => jwt_decode(token) ;

module.exports = {checkUserRole, getTokenPayload}