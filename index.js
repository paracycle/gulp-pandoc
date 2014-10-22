/* Modules */

var pdc     = require('pdc');
var through = require('through2');
var gutil   = require('gulp-util');

/* Plugin */

var PluginError = gutil.PluginError;
var PluginName  = 'gulp-pandoc';

/* Exports */

module.exports = function(options) {
  var from = options.from;
  var to   = options.to;
  var ext  = options.ext;
  var args = options.args;
  var opts = options.opts;

  if (!from) { throw new PluginError(PluginName, '"from" is not defined'); }
  if (!to) { throw new PluginError(PluginName, '"to" is not defined'); }
  if (!ext) { throw new PluginError(PluginName, '"ext" is not defined'); }

  return through.obj(function (file, enc, cb) {
    var input = file.contents.toString();
    if (file.isNull())  {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PluginName, 'Streaming not supported'));
      return cb();
    }

    pdc(input, from, to, args, opts, function(err, output) {
      if (err) {
        this.emit('error', err.toString());
        return cb();
      }
      file.contents = new Buffer(output);
      file.path = gutil.replaceExtension(file.path, ext);
      this.push(file);
      return cb();
    }.bind(this));
  });
};
