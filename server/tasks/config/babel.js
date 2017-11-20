/**
 * Compile JSX files to JavaScript.
 *
 * ---------------------------------------------------------------
 *
 * Compiles jsx files from `assest/js` into Javascript and places them into
 * `.tmp/public/js` directory.
 *
 */
module.exports = function(grunt) {

  grunt.config.set('babel', {
    dev: {
      options: {
        presets: ['react', 'es2015', 'stage-2']
      },
      files: [{
        expand: true,
        cwd: 'assets/react/',
        src: ['**/*.jsx','**/*.js'],
        dest: '.tmp/react-src/',
        ext: '.js'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-babel');
};
