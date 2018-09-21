var Conf = require('conf');
var _ = require('../../lib/helpers');
var getDate = _.getDate;
var conf = new Conf({
    configName: 'records',
});
module.exports = {
    save: function (type, record) {
        var records = conf.get(getDate() + '.' + type) || [];
        records.push(record);
        conf.set(getDate() + '.' + type, records);
    },
    load: function (type) {
        return conf.get(getDate() + '.' + type) || [];
    },
    clear: function () {
        conf.clear();
    },
};
