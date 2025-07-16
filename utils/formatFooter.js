const moment = require('moment-timezone');

module.exports = function formatFooter() {
  return `Updated • ${moment().tz('Asia/Qatar').format('MMMM Do YYYY, h:mm:ss A')}`;
};
