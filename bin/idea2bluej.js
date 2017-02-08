#!/usr/bin/env node

const idea2bluej = require('../index')

const chalk = require('chalk')
const version = require('../package.json').version

console.log(chalk.blue('IDEA2BlueJ v' + version + '\n'))

var argv = require('yargs')
  .default('libs', '+libs')
  .default('src', 'src')
  .argv

if (argv._.length > 1) argv.projectOut = argv._[1]
if (argv._.length > 0) argv.projectIn = argv._[0]

function error (message) {
  console.log(chalk.bgRed(message))
  console.log(chalk.bgRed('Usage: idea2bluej --projectIn [IntelliJ IDEA project path]'))
}

function log (message) {
  if (!argv.quiet && !argv.q) console.log(message)
}

function run () {
  let start = process.hrtime()

  if (!argv.projectIn) return error('No IntelliJ IDEA project folder specified!')
  if (!argv.projectOut) return error('No BlueJ output folder specified!')

  // Step 1 - Validate paths & setup
  log('Validating project structure...')
  if (!idea2bluej.validateInput(argv.projectIn)) return error('IntelliJ IDEA project folder not valid!')
  if (!idea2bluej.validateOutput(argv.projectOut)) return error('BlueJ output folder not valid!')
  if (!idea2bluej.validateSource(argv.src)) return error('IntelliJ IDEA source folder not valid!')
  if (!idea2bluej.validateLibs(argv.libs)) return error('IntelliJ IDEA libs folder not valid!')

  // Step 2 - Clone project structure
  log('Cloning project structure...')
  if (!idea2bluej.cloneProject()) return error('Could not clone IntelliJ IDEA project!')

  // Step 3 - Rename libs folder
  log('Renaming "' + argv.libs + '" folder to "+libs"...')
  if (!idea2bluej.renameLibs()) return error('Could not rename "' + argv.libs + '" folder!')

  // Step 4 - Inject empty 'package.bluej' folders throughout src
  log('Injecting "package.bluej" files into source packages...')
  if (!idea2bluej.injectPackages()) return error('Could not inject BlueJ packages!')

  // Step 5 - Move all contents of src up a directory
  log('Moving "' + argv.src + '" contents into project root source path...')
  if (!idea2bluej.moveSource()) return error('Could not move "' + argv.src + '" contents into project root!')

  // Step 6 - Remove all .idea/.git/.iml files/folders
  log('Cleaning generated BlueJ project...')
  if (!idea2bluej.cleanProject()) return error('Could not clean generated project!')

  // Step 7 - Done!
  let end = process.hrtime(start)
  let seconds = end[0] + (end[1] * 1e-9)
  console.log(chalk.green('Project converted in ' + seconds.toFixed(3) + 's'))
}

run()
