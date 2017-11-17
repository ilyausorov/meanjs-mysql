'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      js: [
        // bower:js
        'assets/libraries/angular/angular.js',
        'assets/libraries/angular-animate/angular-animate.js',
        'assets/libraries/angular-bootstrap/ui-bootstrap-tpls.js',
        'assets/libraries/ng-file-upload/ng-file-upload.js',
        'assets/libraries/angular-messages/angular-messages.js',
        'assets/libraries/angular-mocks/angular-mocks.js',
        'assets/libraries/angular-resource/angular-resource.js',
        'assets/libraries/angular-ui-notification/dist/angular-ui-notification.js',
        'assets/libraries/angular-ui-router/release/angular-ui-router.js',
        'assets/libraries/owasp-password-strength-test/owasp-password-strength-test.js',
        // endbower
      ],
      tests: ['assets/libraries/angular-mocks/angular-mocks.js']
    },
    css: [
      'assets/css/*.css'
    ],
    less: [
      'assets/css/*.less'
    ],
    sass: [
      'assets/css/*.scss'
    ],
    js: [
      'app/views/views_javascript/controllers/_config.js',
      'app/views/views_javascript/controllers/_init.js',
      'app/views/views_javascript/controllers/**/*.js',
      'app/views/views_javascript/models/**/*.js'
    ],
    img: [
      'assets/images/**/*.jpg',
      'assets/images/**/*.png',
      'assets/images/**/*.gif',
      'assets/images/**/*.svg'
    ],
    views: ['app/views/views_html/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'settings/**/*.js', 'app/controllers/**/*.js', 'app/models/**/*.js', 'app/routes/**/*.js', 'app/sockets/**/*.js', 'app/tests/**/*.js'],
    models: 'app/models/**/*.js',
    routes: 'app/routes/**/*.js',
    sockets: 'app/sockets/**/*.js',
    config: 'app/controllers/**/*.config.js',
    policies: 'app/controllers/**/*.policy.js',
    views: 'app/views/views_html/basic_layout/*.html'
  }
};
