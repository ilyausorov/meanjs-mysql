'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      js: [
        // bower:js
        'assets/libraries/angular/angular.min.js',
        'assets/libraries/angular-animate/angular-animate.min.js',
        'assets/libraries/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'assets/libraries/angular-messages/angular-messages.min.js',
        'assets/libraries/angular-mocks/angular-mocks.js',
        'assets/libraries/angular-resource/angular-resource.min.js',
        'assets/libraries/angular-ui-notification/dist/angular-ui-notification.min.js',
        'assets/libraries/angular-ui-router/release/angular-ui-router.min.js',
        'assets/libraries/ng-file-upload/ng-file-upload.min.js',
        'assets/libraries/owasp-password-strength-test/owasp-password-strength-test.js',
        // endbower
      ]
    },
    css: 'assets/dist/application*.min.css',
    js: 'assets/dist/application*.min.js'
  }
};
