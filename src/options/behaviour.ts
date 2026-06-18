import { PanelOptionsEditorBuilder } from '@grafana/data';
import { TPropOptions } from '../types';
import { customRefreshIntervalOptions } from '../utils/grafana/time';

const category = ['Behaviour'];

export const options = (builder: PanelOptionsEditorBuilder<TPropOptions>) => {
  return builder
    .addBooleanSwitch({
      category,
      path: 'ux.realtime.shift.isAutoSelect',
      name: 'Real-time shift auto-select',
      description: 'This gives you the ability to track the shifts in real-time',
      defaultValue: false,
    })
    .addBooleanSwitch({
      category,
      path: 'ux.realtime.shift.isEndToNow',
      name: 'Change the end of time-range to now',
      description: 'This will seek the current end of the time-range to now instead of ending shift time',
      defaultValue: false,
    })
    .addBooleanSwitch({
      category,
      path: 'ux.realtime.shift.isCustomRefreshInterval',
      name: 'Enable custom refresh interval',
      description:
        'This feature enables to set a custom refresh interval for the dashboard that will check the shift status.',
      defaultValue: false,
    })
    .addSelect({
      category,
      showIf: (options) => options.ux.realtime.shift.isCustomRefreshInterval,
      path: 'ux.realtime.shift.refreshInterval',
      name: 'Custom refresh interval',
      description: 'Determine a custom dashboard refresh interval to check shifts.',
      defaultValue: 60 * 1000,
      settings: {
        options: customRefreshIntervalOptions,
      },
    })
    .addBooleanSwitch({
      category,
      path: 'ui.element.progressBar.isVisible',
      name: 'Show refresh progress',
      description: 'Show or hide the progress of the refresh rate.',
      defaultValue: false,
    });
};
