import state from './configure-users.state';
import Step from '../../../../../components/stepper/step/step';
import StepHeader from '../../../../../components/stepper/step/step.header';

/* @ngInject */
export const factory = ($translate) => new Step(
  'configure-users',
  state,
  new StepHeader($translate.instant('dedicatedCloudDashboardTilesOptionsOrderConfigureUsers_stepper_header')),
);

export const name = 'ovhManagerPccServicePackUpgradeConfigureUsersFactory';

export default {
  factory,
  name,
};
