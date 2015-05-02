var path   = require('path')
var umd    = require('broccoli-umd')
var funnel = require('broccoli-funnel')
var coffee = require('broccoli-coffee')
var concat = require('broccoli-concat')
var uglify = require('broccoli-uglify-js')
var merge  = require('broccoli-merge-trees')
var babel  = require('broccoli-babel-transpiler')


// Banner
var pkg = require('../package.json')
var banner = ['/*!', pkg.name, pkg.version, '*/\n'].join(' ')


// Bower
var vendorTree = funnel('bower_components', {
  files: ['tether/tether.js'],
  getDestinationPath: function(relativePath) {
    return path.basename(relativePath)
  }
})


// Coffeescript
var coffeeTree = coffee(funnel('src/js', {
  include: ['drop.coffee'],
  getDestinationPath: function(relativePath) {
    return path.basename(relativePath)
  }
}), { bare: true })


// Standalone UMD
var standaloneTree = umd([coffeeTree], 'drop.js', 'drop.js', {
  deps: {
    'default': ['Tether']
  }
})


// Combined UMD
var combinedTree = umd([
  concat(merge([vendorTree, coffeeTree]), {
    inputFiles: ['tether.js', 'drop.js'],
    outputFile: '/drop.js'
  })
], 'drop.js', 'drop.js')


// Uglify
var uglifyCombinedTree = uglify(combinedTree)
var uglifyStandaloneTree = uglify(standaloneTree)


// JS files
var trees = {
  'drop.js': combinedTree,
  'drop-standalone.js': standaloneTree,
  'drop.min.js': uglifyCombinedTree,
  'drop-standalone.min.js': uglifyStandaloneTree
}

var jsTrees = []
for (var file in trees) {
  if ({}.hasOwnProperty.call(trees, file)) {
    jsTrees.push(concat(trees[file], {
      inputFiles: ['**/*'],
      outputFile: '/' + file,
      header: banner
    }))
  }
}

var jsTree = funnel(merge(jsTrees), {
  srcDir: '.',
  destDir: 'js'
})


// Return files
module.exports = jsTree

