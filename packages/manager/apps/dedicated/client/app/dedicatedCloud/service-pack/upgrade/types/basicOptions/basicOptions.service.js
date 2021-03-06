import every from 'lodash/every';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import reject from 'lodash/reject';

import { OPTION_TYPES } from '../../../option/option.constants';

export const name = 'UpgradeBasicOptionsService';

export const UpgradeBasicOptionsService = class {
  /* @ngInject */
  constructor(
    $translate,
    ovhManagerPccServicePackService,
  ) {
    this.$translate = $translate;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  async getOrderableServicePacks(serviceName, subsidiary, currentServicePackName) {
    const allServicePacks = await this
      .ovhManagerPccServicePackService
      .getServicePacks(serviceName, subsidiary);

    const allServicePacksExceptCurrent = reject(
      allServicePacks,
      { name: currentServicePackName },
    );

    return filter(
      allServicePacksExceptCurrent,
      (servicePack) => every(
        servicePack.options,
        (option) => isEqual(option.type, OPTION_TYPES.basic),
      ),
    );
  }

  getSelectionHeader() {
    return this.$translate('ovhManagerPccServicePackUpgradeBasicOptions_selection_header');
  }

  getSelectionSubHeader() {
    return this.$translate('ovhManagerPccServicePackUpgradeBasicOptions_selection_header');
  }
};

export default {
  name,
  UpgradeBasicOptionsService,
};
