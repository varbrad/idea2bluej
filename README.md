# IDEA2BlueJ
Simple CLI tool to generate a BlueJ Java compatible project from a given IntelliJ IDEA Java project.

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
![License - GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-blue.svg)

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
