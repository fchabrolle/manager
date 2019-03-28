
import moment from 'moment';

export default /* @ngInject */ function (
  $state,
  validParams,
) {
  const self = this;
  self.data = {};
  self.firstDayCurrentMonth = null;

  self.previousMonth = function previousMonth() {
    const lastMonth = self.data.monthBilling.subtract(1, 'month');
    $state.go('pci.projects.project.legacy.billing.history', {
      year: lastMonth.year(),
      month: lastMonth.month() + 1, // because moment indexes month from 0 to 11
    });
  };

  self.nextMonth = function nextMonth() {
    const nextMonthDate = self.data.monthBilling.add(1, 'month');
    $state.go('pci.projects.project.legacy.billing.history', {
      year: nextMonthDate.year(),
      month: nextMonthDate.month() + 1, // because moment indexes month from 0 to 11
    });
  };

  self.isLimitReached = function isLimitReached() {
    return self.data.monthBilling.isSameOrAfter(self.firstDayCurrentMonth, 'day');
  };

  self.getBillingDateInfo = function getBillingDateInfo() {
    if (self.data.monthBilling.isValid()) {
      return {
        month: self.data.monthBilling.format('MMMM'),
        year: self.data.monthBilling.year(),
      };
    }
    return null;
  };

  function init() {
    self.firstDayCurrentMonth = moment().startOf('month');

    self.data.monthBilling = moment({
      y: validParams.year,
      M: validParams.month - 1, // because moment indexes month from 0 to 11
      d: 1,
    });
  }

  init();
}