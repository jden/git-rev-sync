'use strict';

var fs = require('graceful-fs');
var path = require('path')

function _command (cmd) {
  var result = sh.exec(cmd);

  if (result.code !== 0) {
    throw new Error('failed to execute git-rev-sync command', result);
  }

  return result.stdout.replace(/^\s+|\s+$/g, '');
}

var SEP = path.sep
function getGitDir(start) {
  start = start || module.parent.filename
  if (typeof start === 'string') {
    start = start.split(SEP)
  }
  start.pop()
  var testPath = path.resolve(start.join(SEP), '.git')
  if (fs.existsSync(testPath)) {
    return testPath
  }
  return getGitDir(start)
}


var branchRegEx = /^ref: refs\/heads\/(.*)\n/
function branch () {
  var gitDir = getGitDir()
  var head = fs.readFileSync(path.resolve(gitDir, 'HEAD'), 'utf8')
  var b = head.match(branchRegEx)

  if (b) {
    return b[1]
  } else {
    return 'Detatched: ' + head.trim()
  }
}

function long () {
  var b = branch()
  if (/Detatched: /.test(b)) {
    return b.substr(11)
  } else {
    var gitDir = getGitDir()
    var ref = fs.readFileSync(path.resolve(gitDir, 'refs', 'heads', b), 'utf8')
    return ref.trim()
  }
}

function short () {
  return long().substr(0,7)
}

function tag () {
  throw new Error('not implemented')
}

function log () {
  throw new Error('not implemented')
}

module.exports = {
  short : short,
  long : long,
  branch : branch,
  tag : tag,
  log : log
}
