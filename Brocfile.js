var merge  = require('broccoli-merge-trees')

// Trees
var jsTree = require('./broccoli/js')
var cssTree = require('./broccoli/css')

// Return tree
module.exports = merge([jsTree, cssTree])
