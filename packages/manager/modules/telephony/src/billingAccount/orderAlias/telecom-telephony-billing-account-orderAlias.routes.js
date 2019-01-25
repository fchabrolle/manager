export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.orderAlias', {
    url: '/orderAlias',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/telecom-telephony-billing-account-orderAlias.html',
      },
      'telecomTelephonyBillingAccountOrderAliasView@telephony.billingAccount.orderAlias': {
        templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/telecom-telephony-billing-account-orderAlias-main.view.html',
        controller: 'TelecomTelephonyBillingAccountOrderAliasCtrl',
        controllerAs: 'AliasOrderCtrl',
      },
    },
    translations: ['.'],
  });
};
