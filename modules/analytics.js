const Analytics = require('analytics-node');
const analytics = new Analytics(process.env.SEGMENT_WRITE_KEY || 'vKLabdUWMNv7ifwRPaic3N7gHIDzqmoD');

module.exports = analytics;
