/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');
  var BsLessdocParser = require('./grunt/bs-lessdoc-parser.js');
  var getLessVarsData = function () {
    var filePath = path.join(__dirname, 'less/variables.less');
    var fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    var parser = new BsLessdocParser(fileContent);
    return { sections: parser.parseFile() };
  };
  var generateRawFiles = require('./grunt/bs-raw-files-generator.js');
  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    config: {
      srcPath:  grunt.option( "src" ) || "src",
      compilePath: grunt.option( "dist" ) || "dist",
      banner: "/*!\n * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n * Copyright 2015 <%= pkg.author.name %>\n * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n */\n",
    },
    // Task configuration.
    clean: {
      options: { force: true },
      dist: ['<%= config.compilePath %>']
    },

    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: '<%= config.compilePath %>/<%= pkg.name %>.css.map'
        },
        src: '<%= config.srcPath %>/classified.less',
        dest: '<%= config.compilePath %>/<%= pkg.name %>.css'
      }
    },
    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      core: {
        options: {
          map: true
        },
        src: '<%= config.compilePath %>/<%= pkg.name %>.css'
      }
    },

    csslint: {
      options: {
        csslintrc: '<%= config.srcPath %>/.csslintrc'
      },
      dist: [
        '<%= config.compilePath %>/<%= pkg.name %>.css'
      ]
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      minifyCore: {
        src: '<%= config.compilePath %>/<%= pkg.name %>.css',
        dest: '<%= config.compilePath %>/<%= pkg.name %>.min.css'
      },
    },

    usebanner: {
      options: {
        position: 'top',
        banner: '<%= config.banner %>'
      },
      files: {
        src: '<%= config.compilePath %>/*.css'
      }
    },

    csscomb: {
      options: {
        config: '<%= config.srcPath %>/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: '<%= config.compilePath %>',
        src: ['*.css', '!*.min.css'],
        dest: '<%= config.compilePath %>'
      },
    },

    sed: {
      versionNumber: {
        pattern: (function () {
          var old = grunt.option('oldver');
          return old ? RegExp.quote(old) : old;
        })(),
        replacement: grunt.option('newver'),
        recursive: true
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Test task.
  var testSubtasks = [];

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileCore']);
  grunt.registerTask('dist-css', ['less-compile', 'autoprefixer:core', 'usebanner', 'csscomb:dist', 'cssmin:minifyCore']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css']);

  // Default task.
  grunt.registerTask('default', ['dist']);
};
