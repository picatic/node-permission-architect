module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      lib: {
        files: ['lib/**'],
        tasks: ['jshint:lib', 'jasmine_node:all']
      },
      spec: {
        files: ['specs/**', ],
        tasks: ['jshint:specs', 'jasmine_node:all']
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
    },
    jshint: {
      options: {
        node: true
      },
      specs: {
        options: {},
        files: {
          src: ['./specs/**/*.js']
        }
      },
      lib: {
        options: {},
        files: {
          src: ['./lib/**/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('travis', ['jshint:lib', 'jasmine_node:all']);

};
