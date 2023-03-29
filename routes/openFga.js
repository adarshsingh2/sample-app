const { OpenFgaClient } = require('@openfga/sdk');

const fgaClient = new OpenFgaClient({
  apiScheme: process.env.OPENFGA_API_SCHEME,
  apiHost: process.env.OPENFGA_API_HOST,
  storeId: process.env.OPENFGA_STORE_ID
});


module.exports = {
  checkUserAccess(user, relation, object) {
    console.log({user,relation,object})
    return fgaClient.check({
      user,
      relation,
      object
    }, {});
  }
}
