import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import controller from './telephony-scheduler.directive.controller';
import template from './telephony-scheduler.html';

export default /* @ngInject */ ($compile, $locale) => ({
  restrict: 'E',
  transclude: true,
  template,
  controller,
  controllerAs: '$ctrl',
  bindToController: true,
  scope: {
    scheduler: '=telephonyScheduler',
    timeCondition: '=?telephonyTimeCondition',
    options: '=?telephonySchedulerOptions',
  },
  link(scope, iElement, iAttributes, telephonySchedulerCtrl) {
    /* ----------  HELPERS  ----------*/

    const tmpEventInEdition = {
      event: null,
      scope: null,
    };

    function getCalendarElem() {
      return iElement.find('[data-ui-calendar]');
    }

    function destroyTmp(cancel) {
      if (tmpEventInEdition.event && tmpEventInEdition.scope) {
        tmpEventInEdition.event.stopEdition(cancel);
        tmpEventInEdition.event = null;
        tmpEventInEdition.scope.$destroy();
        tmpEventInEdition.scope = null;
      }
    }

    function manageCancel() {
      // hide overlay
      _.set(telephonySchedulerCtrl, 'loading.edit', false);
      iElement.find('.scheduler-ui-calendar').removeClass('topZIndex');

      // destroy tmp and stop edition of the event
      destroyTmp(true);
    }

    function manageSave(schedulerEvent, uiCalEvent) {
      if (uiCalEvent) {
        // update event with saved details
        _.set(uiCalEvent, 'start', moment(schedulerEvent.dateStart));
        _.set(uiCalEvent, 'end', moment(schedulerEvent.dateEnd));
        _.set(uiCalEvent, 'description', schedulerEvent.description);
        _.set(uiCalEvent, 'title', schedulerEvent.title);
        _.set(uiCalEvent, 'className', schedulerEvent.categories);

        // redraw event
        getCalendarElem().fullCalendar('updateEvent', uiCalEvent);
      }
      if (schedulerEvent.status === 'TOCREATE' && !uiCalEvent) {
        // refresh calendar to display new event to create
        getCalendarElem().fullCalendar('renderEvent', angular.extend(schedulerEvent.toFullCalendarEvent(), {
          className: schedulerEvent.categories,
        }));
      }

      // hide overlay
      _.set(telephonySchedulerCtrl, 'loading.edit', false);
      iElement.find('.scheduler-ui-calendar').removeClass('topZIndex');

      // destroy tmp and stop edition of the event - but avoid to clear original datas
      destroyTmp();
    }

    function manageDelete(schedulerEvent, uiCalEvent) {
      // hide overlay
      _.set(telephonySchedulerCtrl, 'loading.edit', false);
      iElement.find('.scheduler-ui-calendar').removeClass('topZIndex');

      // destroy tmp and stop edition of the event - but avoid to clear original datas
      destroyTmp(true);

      // remove event from calendar
      getCalendarElem().fullCalendar('removeEvents', uiCalEvent.id);
    }

    function compileEvent(element, schedulerEvent, uiCalEvent) {
      const eventScope = scope.$new();
      eventScope.event = schedulerEvent;

      // as we will be outside of the telephony-scheduler scope,
      // we will have to pass VoipScheduler and VoipTimeCondition
      // reference to telephony-scheduler-events component.
      eventScope.scheduler = telephonySchedulerCtrl.scheduler;
      eventScope.timeCondition = telephonySchedulerCtrl.timeCondition;

      eventScope.onSave = function onSave() {
        manageSave(schedulerEvent, uiCalEvent);
      };
      eventScope.onCancel = function onCancel() {
        manageCancel();
      };
      eventScope.onDelete = function onDelete(ev) {
        manageDelete(ev, uiCalEvent);
      };

      element.attr({
        'data-responsive-popover': "'telephony/scheduler/events/telephony-scheduler-events-popup.html'",
        'data-popover-append-to-body': 'true', // as we will use a form and scheduler is wrapped into a form element, we will append popover to body.
        'data-popover-trigger': 'none',
        'data-popover-placement': 'auto left',
        'data-popover-is-open': 'event.inEdition',
        'data-popover-class': 'pretty-popover telephony-scheduler-events-popup',
      });

      $compile(element)(eventScope);

      return eventScope;
    }

    /* ----------  UI CALENDAR OPTIONS  ----------*/

    const defaultOptions = {
      header: false,
      locale: localStorage && localStorage.getItem('univers-selected-language') ? _.first(localStorage.getItem('univers-selected-language').split('_')) : 'fr',
      firstDay: 1,
      editable: false, // todo manage drag and drop
      selectable: true,
      allDaySlot: false,
      allDayDefault: false,
      timeZone: telephonySchedulerCtrl.scheduler.timeZone,
      nextDayThreshold: '00:00',
      axisFormat: $locale.DATETIME_FORMATS.shortTime,
      weekMode: 'liquid',
      displayEventTime: false,
      unselectCancel: '.telephony-scheduler-events-popup, .scheduler-overlay, .telecom-telephony-line-calls-events header, flash-message, .menu-item',
      views: {
        month: {
          columnFormat: 'dddd',
        },
        agendaWeek: {
          columnFormat: $locale.DATETIME_FORMATS.mediumDate.replace('d', 'ddd D').replace('y', ''),
          titleFormat: $locale.DATETIME_FORMATS.mediumDate.replace('d', 'D').replace('y', 'YYYY'),
        },
        agendaDay: {
          titleFormat: $locale.DATETIME_FORMATS.longDate.replace('d', 'D').replace('y', 'YYYY'),
        },
      },
      events(start, end, timeZone, callback) {
        return telephonySchedulerCtrl
          .fetchEvents(start, end)
          .then(events => callback(telephonySchedulerCtrl.applyFilters(events)));
      },
      eventDestroy() {
        destroyTmp();
      },
      eventClick(event) {
        const schedulerEvent = telephonySchedulerCtrl.scheduler.getEventByUid(event.id);

        if (tmpEventInEdition.event && tmpEventInEdition.event.uid !== event.id) {
          // stop edition
          destroyTmp(true);
        }

        if (schedulerEvent.inEdition) {
          // hide overlay
          _.set(telephonySchedulerCtrl, 'loading.edit', false);
          iElement.find('.scheduler-ui-calendar').removeClass('topZIndex');

          // stop edition
          destroyTmp(true);
        } else {
          // display overlay
          _.set(telephonySchedulerCtrl, 'loading.edit', true);
          iElement.find('.scheduler-ui-calendar').addClass('topZIndex');

          // start event edition
          tmpEventInEdition.event = schedulerEvent.startEdition();

          // display popover
          tmpEventInEdition.scope = compileEvent($(this), schedulerEvent, event);
        }
      },
      select(dateStart, dateEnd, jsEvent) {
        // cancel current edition
        destroyTmp(true);

        // use fullcalendar moment hasTime method for creating new event date start/end.
        // Useful for week and day views.
        // @see https://fullcalendar.io/docs/utilities/Moment/#ambiguously-timed
        const eventDateStart = jQuery.fullCalendar.moment(dateStart).hasTime() ? moment(dateStart.toJSON()).toDate() : moment(dateStart.toDate()).startOf('day').toDate();
        const eventDateEnd = jQuery.fullCalendar.moment(dateEnd).hasTime() ? moment(dateEnd.toJSON()).toDate() : moment(dateEnd.toDate()).subtract(1, 'day').endOf('day').toDate();

        // convert to native Date to avoid time offset
        tmpEventInEdition.event = telephonySchedulerCtrl.createEvent(eventDateStart, eventDateEnd);
        tmpEventInEdition.scope = compileEvent(jsEvent ? $(jsEvent.target) : getCalendarElem().find('.fc-highlight'), tmpEventInEdition.event.startEdition());

        // display overlay
        _.set(telephonySchedulerCtrl, 'loading.edit', true);
        iElement.find('.scheduler-ui-calendar').addClass('topZIndex');
      },
    };

    _.set(telephonySchedulerCtrl, 'calendarOptions', _.defaultsDeep(scope.options || {}, defaultOptions));
  },
});
