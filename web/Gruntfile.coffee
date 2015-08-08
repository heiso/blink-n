# bump
module.exports = ( grunt ) ->

  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-html2js'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  pkg = grunt.file.readJSON 'package.json'
  cfg = require './grunt/gruntConfig.coffee'

  grunt.initConfig

    cfg: cfg

    pkg: pkg

    clean:
      build: '<%= cfg.dirs.build %>'
      dist: '<%= cfg.dirs.dist %>'

    html2js:
      default:
        options:
          base: '<%= cfg.dirs.src %>'
        src: '<%= cfg.dirs.src %>/<%= cfg.files.tpl %>'
        dest: '<%= cfg.dirs.build %>/templates.js'

    jshint:
      src: '<%= cfg.dirs.src %>/<%= cfg.files.js %>'
      options:
        curly: true
        immed: true
        newcap: true
        noarg: true
        sub: true
        boss: true
        eqnull: true

    sass:
      build:
        files: [{
          expand: true,
          cwd: '<%= cfg.dirs.src %>/scss',
          src: 'index.scss',
          dest: '<%= cfg.dirs.build %>',
          ext: '<%= pkg.name %><%= pkg.version %>.css'
        }]
        options:
          style: 'expanded'
          sourcemap: 'auto'
          debugInfo: false

    copy:
      default:
        files: [
          {
            expand: true
            cwd: '<%= cfg.dirs.src %>'
            src: '<%= cfg.files.js %>'
            dest: '<%= cfg.dirs.build %>'
          }
          {
            expand: true
            cwd: '<%= cfg.dirs.src %>'
            src: '<%= cfg.files.assets %>'
            dest: '<%= cfg.dirs.build %>'
          }
          {
            expand: true
            cwd: 'bower_components'
            src: '<%= cfg.vendors.js %>'
            dest: '<%= cfg.dirs.build %>/vendors'
          }
          {
            expand: true
            cwd: 'bower_components'
            src: '<%= cfg.vendors.css %>'
            dest: '<%= cfg.dirs.build %>/vendors'
          }
        ]

    index:
      build:
        index: '<%= cfg.dirs.src %>/<%= cfg.files.index %>'
        dest: '<%= cfg.dirs.build %>/<%= cfg.files.index %>'
        src: [
          '<%= cfg.vendors.js %>'
          '<%= cfg.dirs.build %>/<%= cfg.files.js_modules_declaration %>'
          '<%= cfg.dirs.build %>/<%= cfg.files.js %>'
          '!<%= cfg.dirs.build %>/vendors/<%= cfg.files.js %>'
          '<%= cfg.vendors.css %>'
          '<%= cfg.dirs.build %>/<%= cfg.files.css %>'
        ]

    connect:
      build:
        options:
          base: '<%= cfg.dirs.build %>'
          port: 8001
          hostname: '127.0.0.1'
          open: true

    delta:
      options:
        livereload: true
      jssrc:
        files: '<%= cfg.dirs.src %>/<%= cfg.files.js %>'
        tasks: ['jshint', 'copy']
        options:
          livereload: true
      vendors:
        files: 'vendors/lib-front-minimighty/**/*.js'
        tasks: ['copy']
        options:
          livereload: true
      assets:
        files: '<%= cfg.dirs.src %>/<%= cfg.files.assets %>'
        tasks: ['copy']
      index:
        files: '<%= cfg.dirs.src %>/<%= cfg.files.index %>'
        tasks: ['index:build']
        options:
          livereload: true
      tpl:
        files: '<%= cfg.dirs.src %>/<%= cfg.files.tpl %>'
        tasks: ['html2js', 'index:build']
        options:
          livereload: true
      sass:
        files: '<%= cfg.dirs.src %>/<%= cfg.files.scss %>'
        tasks: ['sass:build']
        options:
          livereload: true
      livereload:
        files: [
          'vendors/lib-front-minimighty/**/*.js'
          'src/**/*.js'
        ]
      # configs:
      #   files: '<%= cfg.files.config %>'
      #   tasks: [ 'buildconfig', 'jshint:all', 'copy:build_appjs' ]

  grunt.renameTask 'watch', 'delta'
  grunt.registerTask 'watch', ['build', 'connect:build', 'delta']

  grunt.registerTask 'build', [
    'clean'
    'html2js'
    'jshint'
    'sass:build'
    'copy'
    'index:build'
  ]

  grunt.registerMultiTask 'index', 'Process index.html template', () ->
    basePath = new RegExp('^('+cfg.dirs.build+'|'+cfg.dirs.dist+')\/')
    files = @filesSrc.map((file) ->
      file.replace basePath, ''
    )
    i = cfg.vendors.js.length - 1
    while i >= 0
      files.unshift 'vendors/'+cfg.vendors.js[i]
      i--
    grunt.file.copy @data.index, @data.dest,
      process: ( contents, path ) ->
        grunt.template.process contents,
          data:
            scripts: files.filter (file) ->
              file.match /\.js$/
            styles: files.filter (file) ->
              file.match /\.css$/
            version: grunt.config 'pkg.version'
