export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.resume', {
      url: '/resume',
      views: {
        modal: {
          component: 'pciInstancesInstanceResume',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToInstance) => goToInstance,
        breadcrumb: () => null,
      },
    });
};
