const fs = require('fs-extra')
const path = require('path')

/**
 * Clones a directory from a source directory to an output directory
 * @returns true if cloned succesfully, else false
 */
function cloneSource (sourceDir, outputDir) {
  // Check to ensure the sourceDir exists
  if (fs.existsSync(sourceDir)) {
    // Empty the outputDir
    fs.emptyDirSync(outputDir)
    // Copy the source to outputDir
    fs.copySync(sourceDir, outputDir)
    // Succesfully copied directory
    return true
  }
  return false
}

/**
 * If a directory exists
 * @returns true if directory exists, else false
 */
function isDirectory (path) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory()
}

/**
 * If a file exists
 * @returns true if directory exists, else false
 */
function isFile (path) {
  return fs.existsSync(path) && fs.statSync(path).isFile()
}

/**
 * Renames a directory
 * @returns true if renamed succesfully, else false
 */
function renameDir (oldPath, newPath) {
  // Only attempt to rename if path exists and is directory
  if (fs.existsSync(oldPath) && fs.statSync(oldPath).isDirectory()) {
    fs.renameSync(oldPath, newPath)
    return true
  }
  return false
}

/**
 * Moves a directory
 * @returns true if moved succesfully, else false
 */
function moveDir (oldPath, newPath) {
  // Only attempt to rename if path exists and is directory
  if (fs.existsSync(oldPath) && fs.statSync(oldPath).isDirectory()) {
    fs.copySync(oldPath, newPath)
    fs.removeSync(oldPath)
    return true
  }
  return false
}

/**
 * Moves all files/directories in a directory to a new directory
 * @returns true if moved succesfully, else false
 */
function moveAllInDir (oldPath, newPath) {
  // Only attempt to rename if path exists and is directory
  if (fs.existsSync(oldPath) && fs.statSync(oldPath).isDirectory()) {
    // Loop thru all files in this folder
    let files = fs.readdirSync(oldPath)
    for (let i = 0; i < files.length; ++i) {
      let filePath = path.join(oldPath, files[i])
      fs.copySync(filePath, path.join(newPath, files[i]))
      fs.removeSync(filePath)
    }
    fs.removeSync(oldPath)
    return true
  }
  return false
}

function injectBlueJPackages (output) {
  let dirs = [output]
  while (dirs.length > 0) {
    // Get list of current directories within dirs[0]
    let files = fs.readdirSync(dirs[0])
    for (let i = 0; i < files.length; ++i) {
      let p = path.join(dirs[0], files[i])
      if (fs.statSync(p).isDirectory()) {
        dirs.push(p)
      }
    }
    // Add 'package.bluej' to this path
    fs.writeFileSync(path.join(dirs[0], 'package.bluej'), '')

    dirs.shift()
  }
  return true
}

function removeProjectFiles (output) {
  if (fs.existsSync(output) && fs.statSync(output).isDirectory()) {
    let files = fs.readdirSync(output)
    for (let i = 0; i < files.length; ++i) {
      let name = files[i]
      if (name.match(/(\.iml)|(\.idea)|(\.git)$/)) {
        fs.removeSync(path.join(output, name))
      }
    }
    return true
  }
  return false
}

/**
 * Deletes a file or directory.
 * @returns true if removed succesfully, else false
 */
function deletePath (filepath) {
  if (fs.existsSync(filepath)) {
    fs.removeSync(filepath)
    return true
  }
  return false
}

module.exports = {
  cloneSource: cloneSource,
  deletePath: deletePath,
  isDirectory: isDirectory,
  isFile: isFile,
  moveDir: moveDir,
  moveAllInDir: moveAllInDir,
  renameDir: renameDir,
  injectBlueJPackages: injectBlueJPackages,
  removeProjectFiles: removeProjectFiles
}
