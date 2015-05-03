'use strict';

/**
 * @ngdoc overview
 * @name <%= mainAppName %>
 * @description
 * # <%= mainAppName %>
 *
 * Main module of this page.
 */

angular
  .module('<%= mainAppName %>Module', [<% _.forEach(ctrls, function(ctrl) { %>'<%- ctrl %>Ctrl',<% }); %>]);
