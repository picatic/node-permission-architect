module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      lib: {
        files: ['lib/**','specs/**'],
        tasks: ['jasmine_node:all']
      },
      example: {
        files: ['lib/**', 'example.js'],
        tasks: ['run:example']
      }
    },
    run: {
      example: {
        options: {},
        args: ['example.js']
      }
    },
    jasmine_node: {
      coverage: {
        print: 'both'
      },
      options: {
        forceExit: true,
        projectRoot: './lib',
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        jUnit: {
          report: true,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      },
      all: ['specs/']
    },
    jsdoc: {
      dist: {
        src: ['lib/**/*js'],
        options: {
          destination: 'doc',
          'private': false
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};
