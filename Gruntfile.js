module.exports = function (grunt) {

    grunt.initConfig({

        dirTmp: '.tmp/',
        dirRelease: 'js/',
        dirDebug: 'js/',
        dirSrc: 'js/src/',


        browserify: {
            options: {
                browserifyOptions: {
                    standalone: 'appBundle'
                },
            },
            dev: {
                files: {
                    '<%= dirDebug %>app.js': '<%= dirSrc %>app.js'
                },
                options: {
                    debug: true
                }
            },
            prod: {
                files: {
                    '<%= dirRelease %>app.js': '<%= dirSrc %>app.js'
                },
                options: {}
            }
        },

        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/noisejs/perlin.js'],
                        dest: 'js/lib/',
                        filter: 'isFile'
                    }

                ]
            }
        },

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                options: {
                    outputStyle: 'expanded'
                },
                files: {
                    'css/app.css': 'css/src/app.scss'
                }
            },
            min: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'css/app.min.css': 'css/src/app.scss'
                }
            }
        },


        watch: {
            js: {
                files: [
                    './js/src/**/*.js'
                ],
                tasks: [
                    'browserify',
                    'copy'
                ],
                options: {
                    livereload: true,
                    spawn: false,
                    atBegin: true
                }
            },
            css: {
                files: [
                    './css/src/**/*.scss'
                ],
                tasks: [
                    'sass'
                ],
                options: {
                    livereload: true,
                    spawn: false,
                    atBegin: true
                }
            }
        },


        connect: {
            dev: {
                options: {
                    port: 3000,
                    base: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('server', [
        'connect:dev',
        'watch'
    ]);


    grunt.registerTask('default', [
        'browserify',
        'sass',
        'copy'
    ]);
};
