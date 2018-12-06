import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';

const moduleName = 'ovhManagerHello';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('hello', {
      url: '/hello',
      template: 'Hello',
    });
  });

export default moduleName;
