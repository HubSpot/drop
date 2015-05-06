var path   = require('path')
var umd    = require('broccoli-umd')
var funnel = require('broccoli-funnel')
var concat = require('broccoli-concat')
var uglify = require('broccoli-uglify-js')
var merge  = require('broccoli-merge-trees')
var babel  = require('broccoli-babel-transpiler')


// Banner
var pkg = require('../package.json')
var banner = ['/*!', pkg.name, pkg.version, '*/\n'].join(' ')


// Vendor
// NOTE: Wait until Tether provides UMD-less version for bundle
// var vendorTree = funnel('bower_components', {
//   files: ['tether/tether.js'],
//   getDestinationPath: function(relativePath) {
//     return path.basename(relativePath)
//   }
// })
var vendorTree = funnel('src/vendor', {
  files: ['tether-no-umd.js'],
  getDestinationPath: function(relativePath) {
    return 'tether.js';
  }
});


// Transpile
var transpiledTree = babel(
  funnel('src/js', {
    include: ['drop.js'],
    getDestinationPath: function(relativePath) {
      return path.basename(relativePath);
    }
  })
);


// Standalone UMD
var standaloneTree = umd([
  concat(transpiledTree, {
    inputFiles: ['drop.js'],
    outputFile: '/drop.js',
    footer: 'return Drop;'
  })
], 'drop.js', 'drop.js', {
  deps: {
    'default': ['Tether'],
    'global': ['Tether'],
    'amd': ['tether'],
    'cjs': ['tether']
  }
});


// Combined UMD
var combinedTree = umd([
  concat(
    merge([vendorTree, transpiledTree]), {
      inputFiles: ['tether.js', 'drop.js'],
      outputFile: '/drop.js',
      footer: 'return Drop;'
    })
], 'drop.js', 'drop.js');


// Uglify
var uglifyCombinedTree = uglify(combinedTree);
var uglifyStandaloneTree = uglify(standaloneTree);


// JS files
var trees = {
  'drop.js': combinedTree,
  'drop-standalone.js': standaloneTree,
  'drop.min.js': uglifyCombinedTree,
  'drop-standalone.min.js': uglifyStandaloneTree
};

var jsTrees = [];
for (var file in trees) {
  if ({}.hasOwnProperty.call(trees, file)) {
    jsTrees.push(concat(trees[file], {
      inputFiles: ['**/*'],
      outputFile: '/' + file,
      header: banner
    }));
  }
}

var jsTree = funnel(
  merge(jsTrees), {
    srcDir: '.',
    destDir: 'js'
  }
);


// Return files
module.exports = jsTree

