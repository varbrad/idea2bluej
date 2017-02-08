const fs = require('fs-extra')
const path = require('path')

module.exports = {

  input: null,
  output: null,
  src: null,
  libs: null,

  validateInput: function (uri) {
    this.input = path.join(process.cwd(), uri)
    return this.validateDir(this.input)
  },

  validateOutput: function (uri) {
    this.output = path.join(process.cwd(), uri)
    return true
  },

  validateSource: function (uri) {
    this.src = uri
    return this.validateDir(path.join(this.input, uri))
  },

  validateLibs: function (uri) {
    this.libs = uri
    return this.validateDir(path.join(this.input, uri))
  },

  validateDir: function (uri) {
    return fs.existsSync(uri) && fs.statSync(uri).isDirectory()
  },

  /**
   * Clones the project structure from input to output
   * @returns true if cloned succesfully, else false
   */
  cloneProject: function () {
    if (this.input && this.output) {
      fs.emptyDirSync(this.output)
      fs.copySync(this.input, this.output)
      return true
    }
    return false
  },

  renameLibs: function () {
    if (this.output && this.libs) {
      fs.renameSync(path.join(this.output, this.libs), path.join(this.output, '/+libs'))
      return true
    }
    return false
  },

  injectPackages: function () {
    if (this.output && this.src) {
      let dirs = [path.join(this.output, this.src)]
      while (dirs.length > 0) {
        let files = fs.readdirSync(dirs[0])
        for (let i = 0; i < files.length; ++i) {
          let p = path.join(dirs[0], files[i])
          if (fs.statSync(p).isDirectory()) dirs.push(p)
        }
        fs.writeFileSync(path.join(dirs[0], 'package.bluej'), '')
        dirs.shift()
      }
      return true
    }
    return false
  },

  moveSource: function () {
    if (this.output && this.src) {
      let src = path.join(this.output, this.src)
      let files = fs.readdirSync(src)
      for (let i = 0; i < files.length; ++i) {
        let p = path.join(src, files[i])
        fs.copySync(p, path.join(this.output, files[i]))
        fs.removeSync(p)
      }
      fs.removeSync(src)
      return true
    }
    return false
  },

  cleanProject: function () {
    if (this.output) {
      let files = fs.readdirSync(this.output)
      for (let i = 0; i < files.length; ++i) {
        let name = files[i]
        if (name.match(/(\.iml)|(\.idea)|(\.git)|(out)$/g)) fs.removeSync(path.join(this.output, name))
      }
      return true
    }
    return false
  }
}
