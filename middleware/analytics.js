module.exports = (req, res, next) => {
  res.data.analytics = {
    projectId: process.env.SEGMENT_PROJECT_ID || 'WwZe7ssrHl',
    writeKey: process.env.SEGMENT_WRITE_KEY || 'vKLabdUWMNv7ifwRPaic3N7gHIDzqmoD',
  };
  return next();
};
