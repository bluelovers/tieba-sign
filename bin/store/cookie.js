var Conf = require('conf');
var conf = new Conf({
    configName: 'cookie',
});
module.exports = {
    save: function (cookie) {
        conf.set(cookie);
    },
    load: function () {
        return conf.store;
    },
    clear: function () {
        conf.clear();
    },
};
