import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';

import template from './hello.html';

const moduleName = 'ovhManagerHello';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('hello', {
      url: '/hello',
      template,
      translations: ['.'],
    });
  });

export default moduleName;
