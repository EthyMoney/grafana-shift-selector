import { TPropOptions } from '../types';
import { formatToDate, getTimeNowObject } from './time';

const setTimeSettings = (options: TPropOptions): TPropOptions['settings']['time'] => {
  return {
    current: getTimeNowObject(options),
    isRealTime: options.ux.realtime.shift.isAutoSelect,
    isEndToNow: options.ux.realtime.shift.isEndToNow,
    relativeTo: options.ui.element.date.input.value || formatToDate(),
    refreshInterval: options.ux.realtime.shift.refreshInterval,
  };
};

export const processProps = (options: TPropOptions): TPropOptions => {
  // Fixed-time mode is deprecated and intentionally disabled.
  options.ux.time.isFixed = false;

  options.ui.element.date.input.isVisible = true;
  options.ui.element.date.input.value = options.ui.element.date.input.value || formatToDate();

  options.settings.time = setTimeSettings(options);

  return options;
};
