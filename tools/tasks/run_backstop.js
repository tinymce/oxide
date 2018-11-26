const backstop = require('backstopjs');
const fs = require('fs');
const path = require('path');
const createConfig = require('./backstop_config');


module.exports = (browserSync, done, command) => {
  const exit = () => {
    browserSync.exit();
    done();
  }
  browserSync.init({
    server: { baseDir: './build' },
    ghostMode: false, // prevent scrolls and clicks between browsers
    open: false, // Don't open a browser by default.
    notify: false
  }, (err, bs) => {
    const port = bs.options.get('port');
    const config = createConfig(port);
    const configPath = 'scratch/backstop.json';
    fs.writeFileSync(configPath, JSON.stringify(config))
    backstop(command, { docker: true, config: configPath })
      .then(exit)
      .catch((err) => {
        exit();
        throw new Error(err.message);
      })
  });
}
