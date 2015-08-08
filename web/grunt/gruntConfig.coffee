module.exports =

  dirs:
    src: 'src'
    build: 'build'
    dist: 'dist'
    config: 'config'

  files:
    index: 'index.html'
    js: '**/*.js'
    js_modules_declaration: '**/_*.js'
    tpl: '**/*.tpl.html'
    scss: '**/*.scss'
    css: '**/*.css'
    assets: 'assets/**/*'

  vendors:
    js: [
      'jquery/dist/jquery.min.js'
      'jquery/dist/jquery.min.map'
      'lodash/lodash.min.js'
      'angular/angular.min.js'
      'angular/angular.min.js.map'
      'ui-router/release/angular-ui-router.min.js'
      'velocity/velocity.js'
      'moment/min/moment-with-locales.js'
      'lumx/dist/lumx.js'
    ]
    css: [
      'lumx/dist/lumx.css'
      'lumx/dist/fonts/*'
    ]
