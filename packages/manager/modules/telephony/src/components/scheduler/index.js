import angular from 'angular';
import voipScheduler from './telephony-scheduler.factory';
import voipSchedulerDirective from './telephony-scheduler.directive';
import voipSchedulerService from './telephony-scheduler.service';
import constants from './telephony-scheduler.constant';

import actions from './actions';
import events from './events';

import './telephony-scheduler.less';

const moduleName = 'ovhManagerTelephonyScheduler';

angular.module(moduleName, [
  actions,
  events,
])
  .run(/* @ngTranslationsInject ./translations */)
  .constant('SCHEDULER_CATEGORY_TO_TIME_CONDITION_SLOT_TYPE', constants.SCHEDULER_CATEGORY_TO_TIME_CONDITION_SLOT_TYPE)
  .constant('SCHEDULER_CATEGORY_TO_ICS_VEVENT_CATEGORY', constants.SCHEDULER_CATEGORY_TO_ICS_VEVENT_CATEGORY)
  .factory('VoipScheduler', voipScheduler)
  .directive('telephonyScheduler', voipSchedulerDirective)
  .service('telephonyScheduler', voipSchedulerService);

export default moduleName;
