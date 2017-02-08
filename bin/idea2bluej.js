#!/usr/bin/env node

const idea2bluej = require('../index')

const chalk = require('chalk')
const path = require('path')
const version = require('../package.json').version

console.log(chalk.blue('IDEA2BlueJ v' + version + '\n'))

var argv = require('yargs')
  .default('libs', '+libs')
  .default('src', 'src')
  .default('projectOut', 'BlueJ')
  .argv

function error (message) {
  console.log(chalk.bgRed(message))
  console.log(chalk.bgRed('Usage: idea2bluej --projectIn [IntelliJ IDEA project path]'))
}

function log (message) {
  if (!argv.quiet && !argv.q) console.log(message)
}

function run () {
  let start = process.hrtime()

  if (!argv.projectIn) {
    return error('No IntelliJ IDEA project folder specified!')
  }

  // First, join input/output paths
  log('Resolving file paths...')
  const input = path.join(process.cwd(), argv.projectIn)
  const inputLibsPath = path.join(process.cwd(), argv.projectIn, argv.libs)
  const inputSrcPath = path.join(process.cwd(), argv.projectIn, argv.src)
  const output = path.join(process.cwd(), argv.projectOut)

  // Ensure all paths exist
  if (!idea2bluej.isDirectory(input)) return error('IntelliJ IDEA project folder "' + input + '" not found!')
  if (!idea2bluej.isDirectory(inputLibsPath)) return error('IntelliJ IDEA libs folder "' + inputLibsPath + '" not found!')
  if (!idea2bluej.isDirectory(inputSrcPath)) return error('IntelliJ IDEA source folder "' + inputSrcPath + '" not found!')

  // Attempt to clone project structure
  log('Cloning project structure...')
  if (!idea2bluej.cloneSource(input, output)) {
    // Something went wrong, show an error
    return error('Could not clone source path "' + input + '" to "' + output + '"!')
  }

  // Resolve generated paths
  log('Resolving generated file paths...')
  const outputLibsPath = path.join(process.cwd(), argv.projectOut, argv.libs)
  const outputSrcPath = path.join(process.cwd(), argv.projectOut, argv.src)

  // Rename libs folder to '+libs'
  log('Renaming library folder...')
  if (!idea2bluej.renameDir(outputLibsPath, path.join(path.dirname(outputLibsPath), '/+libs'))) {
    // Couldnt rename file
    return error('Could not rename libs path "' + outputLibsPath + '" to "+libs"!')
  }

  // Inject package.bluej folders
  log('Injecting BlueJ project package files...')
  if (!idea2bluej.injectBlueJPackages(outputSrcPath)) {
    return error('Could not inject BlueJ project package files!')
  }

  // Move all folders within 'src' up a directory
  log('Moving source directory up...')
  if (!idea2bluej.moveAllInDir(outputSrcPath, path.dirname(outputSrcPath))) {
    return error('Could not move source path "' + outputSrcPath + '" to project root directory!')
  }

  // 7, Remove .iml file and '.idea' folder
  log('Removing IntelliJ IDEA project files...')
  if (!idea2bluej.removeProjectFiles(output)) {
    return error('Could not remove IntelliJ IDEA project files!')
  }

  let end = process.hrtime(start)
  let seconds = end[0] + (end[1] * 1e-9)
  console.log(chalk.green('Project converted in ' + seconds.toFixed(3) + 's\n'))
}

run()
