<p align="center"><img src="http://i.imgur.com/EdVkEWb.png" alt="IDEA2BlueJ"></p>

<p align="center">
  <a href="http://standardjs.com/"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="Code Style - Standard"></a>
  <a href="https://david-dm.org/varbrad/idea2bluej"><img src="https://david-dm.org/varbrad/idea2bluej/status.svg" alt="npm Dependencies Status"></a>
  <a href="https://david-dm.org/varbrad/idea2bluej?type=dev"><img src="https://david-dm.org/varbrad/idea2bluej/dev-status.svg" alt="npm DevDependencies Status"></a>
  <a href="https://travis-ci.org/varbrad/idea2bluej"><img src="https://travis-ci.org/varbrad/idea2bluej.svg?branch=master" alt="TravisCI Build Status"></a>
  <img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="License - GPL-3.0"><br>
  <a href="https://www.npmjs.com/package/idea2bluej"><img src="https://nodei.co/npm/idea2bluej.png?downloads=true&downloadRank=true" alt="npm Information Banner"></a>
</p>

## Steps
1. Ensure source project path and libs/src paths are valid.
2. Clone entire project structure.
3. Ensure generated output project path and libs/src paths are valid.
4. Rename libs folder to '+libs'.
5. Inject empty 'package.bluej' folders into every directory from 'src' downwards.
6. Move all contents of 'src' up into root directory.
7. Remove IntelliJ project files and folders, and any .git folder (to stop VC issues).

## Usage
Install as a global node package.
````shell
npm install idea2bluej -g
````

Provide paths to input project (IntelliJ IDEA project folder) and output folder (BlueJ folder).
````shell
idea2bluej [input-folder] [output-folder]
````

### Optional parameters
`--src` Defaults to a folder named `'src'` within your input project folder.

`--libs` Defaults to a folder named `'+libs'` within your input project folder.

`--quiet` Default to `false`. If true, then intermediate progress log messages are supressed.

### Optional Flags
`-q` Runs in 'quiet' mode (Equivalent to `--quiet` above)

### Deprecated Flags
`--projectIn` Replaced by unnamed argument (__required__)

`--projectOut` Replace by unnamed argument (__required__)
