module.exports = function(grunt) {
 
  // Project configuration.
  grunt.config.set('webpack',{ 
    
      build: {
        devtool: "source-map",
        entry: [__dirname + '/../../.tmp/react-src/App.js'],
        output: {
          path:  __dirname + '/../../.tmp/public/react/',
          filename: 'bundle.js',
          devtoolLineToLine: true,
        sourceMapFilename: "bundle.js.map",
        pathinfo: true
        },
        stats: {
          colors: false,
          modules: true,
          reasons: true
        },
        storeStatsTo: 'webpackStats',
        progress: true,
        failOnError: true,
        watch: true,
        module: {
          loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
          ]
        }
      }
    
  });

  grunt.loadNpmTasks('grunt-webpack');
};