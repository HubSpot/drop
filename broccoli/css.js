var funnel  = require('broccoli-funnel')
var compass = require('broccoli-compass')
var merge   = require('broccoli-merge-trees')


// Stylesheets
var sassTree = merge([
  funnel('src/css', {
    srcDir: '.',
    destDir: 'css'
  }),
  funnel('bower_components', {
    srcDir: '.',
    destDir: 'bower_components'
  }),
])

var cssTree = funnel(compass(sassTree, {
  files: '**/*',
  sassDir: 'css'
}), {
  srcDir: 'stylesheets',
  destDir: 'css'
})


// Export tree
module.exports = cssTree
