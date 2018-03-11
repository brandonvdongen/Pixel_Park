const webpackConfig = require('./webpack.config.js');
process.env.NODE_ENV = 'production';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        copy: {
            dist: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: true, cwd:'client/assets', src: ['**'], dest: 'dist/assets'},
                    {expand: true, flatten: true, src: ['client/js/phaser.js'], dest: 'dist/js'},
                ],
            },
        },
        webpack: {
            options: {
                stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'production'
            },
            prod: webpackConfig,
            dev: Object.assign({watch: true}, webpackConfig)
        },
        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'client/index.html',     // 'destination': 'source'
                }
            }
        },
        // babel: {
        //     options: {
        //         sourceMap: false,
        //         presets: ['env']
        //     },
        //     dist: {
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: 'client/',
        //                 src: ["js/*.js"],
        //                 dest: 'babel/'
        //             }
        //         ]
        //     }
        // },
        // uglify: {
        //     options: {
        //         mangle: false
        //     },
        //     my_target: {
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: 'babel/',
        //                 src: ["js/*.js"],
        //                 dest: 'dist/'
        //             }
        //         ]
        //     }
        // },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'client/css',
                    src: ['*.css'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },
        clean: {
            release: ['dist/']
        }
    });

    grunt.loadNpmTasks('grunt-webpack');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', [
        'clean',
        // 'babel',
        // 'uglify',
        'cssmin',
        'htmlmin',
        'webpack:prod',
        'copy'
    ]);

    grunt.registerTask('default', ['build']);
}
;