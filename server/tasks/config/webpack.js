var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var baseHref = '/trainer';

module.exports = function(grunt) {

  // Project configuration.
  grunt.config.set('webpack',{ 
    
      build: {
        devtool: "source-map",
        // entry: [__dirname + '/../../.tmp/react-src/App.js', __dirname + '/../../.tmp/react-src/Vendor.js'],
        output: {
          path:  __dirname + '/../../.tmp/public/react/',
          filename: '[name].js',
          devtoolLineToLine: true,
          sourceMapFilename: "[name].js.map",
          pathinfo: true
        },
        progress: false,
        failOnError: true,
        watch: false,
        // module: {
        //   loaders: [
        //     { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        //   ]
        // }

        entry: {
          'vendor.js': './assets/react/Vendor.jsx',
          app: './assets/react/App.jsx'
        },

        resolve: {
            modules: [path.join(__dirname, ''), 'node_modules', 'bower_components'],
            extensions: ['.js', '.jsx'],
            alias: {
                moment$: 'moment/moment.js',
                d3$: 'd3/d3.min.js'
            }
        },

        module: {
            rules: [{
                    test: /jquery\.flot\.resize\.js$/,
                    use: 'imports-loader?this=>window'
                }, {
                    test: /\.js/,
                    use: 'imports-loader?define=>false'
                }, {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: 'react-hot-loader'
                }, {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015', 'react'],
                            compact: false
                        }
                    }
                }, {
                    test: /\.css$/,
                    exclude: path.join(process.cwd(), '/app'),
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    })
                }, {
                    test: /\.css$/,
                    include: path.join(process.cwd(), '/app'),
                    use: 'raw-loader'
                }, {
                    test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
                    use: 'url-loader?prefix=font/&limit=10000'
                }, {
                    test: /\.(png|jpg|gif)$/,
                    use: 'url-loader?limit=10000'
                }, {
                    test: /\.scss$/,
                    use: [{
                            loader: 'style-loader'
                        }, {
                            loader: 'css-loader'
                        },/*{
                            loader: 'rtlcss-loader' // uncomment for RTL
                        },*/
                        {
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'expanded'
                            }
                        }
                    ]
                }]
                // , noParse: [/\.min\.js/]
        },

        resolveLoader: {
            alias: {
                'rtlcss-loader': path.join(__dirname, 'rtlcss-loader.js')
            }
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),
            // new HtmlWebpackPlugin({
            //     template: 'app/index.html',
            //     baseUrl: baseHref
            // }),
            new CopyWebpackPlugin([{
                from: __dirname +  '/../../assets/react/img',
                to: __dirname +'/../../.tmp/public/img',
                //context: path.join(__dirname, 'app')
            }, {
                from: __dirname +'/../../assets/react/server',
                to: __dirname +'/../../.tmp/public/server',
                //context: path.join(__dirname, 'app')
            }, {
                from: __dirname +'/../../assets/react/fonts',
                to: __dirname +'/../../.tmp/public/react/fonts',
                //context: path.join(__dirname, 'app')
            }]),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                'window.moment': 'moment',
                'moment': 'moment'
            }),
            // https://github.com/moment/moment/issues/2979#issuecomment-189899510
            new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
            new ExtractTextPlugin({filename: '[name].css', allChunks: true}),
            new webpack.DefinePlugin({
                WP_BASE_HREF: JSON.stringify(baseHref)
            })
        ]
      }
    
  });

  grunt.loadNpmTasks('grunt-webpack');
};