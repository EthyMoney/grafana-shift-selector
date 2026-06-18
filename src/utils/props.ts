import { TPropOptions } from '../types';
import { formatToDate, getTimeNowObject } from './time';

const defaultOptions: TPropOptions = {
  data: {
    shifts: null,
  },
  state: {
    shifts: {
      data: null,
      hasMultipleShiftGroups: false,
    },
  },
  settings: {
    time: {
      current: { hour: 0, minute: 0 },
      relativeTo: formatToDate(),
      isRealTime: false,
      isEndToNow: false,
      refreshInterval: 60 * 1000,
    },
    dataSource: {
      type: 'static',
      static: {
        data: '[]',
      },
      filter: {
        group: '',
        shifts: [],
      },
    },
    groups: {
      label: {
        isTrimmed: false,
      },
    },
  },
  db: {
    table: {
      shifts: {
        name: 'shifts',
        columns: {
          uuid: 'uuid',
          name: 'name',
          start_time: 'start_time',
          end_time: 'end_time',
          order: 'shift_order',
          group_uuid: 'shift_group_uuid',
        },
      },
      shift_groups: {
        name: 'shift_groups',
        columns: {
          uuid: 'uuid',
          name: 'name',
          site_uuid: 'site_uuid',
        },
      },
      filter: {
        column: {
          name: '',
          value: '',
        },
      },
    },
  },
  ux: {
    time: {
      isFixed: false,
      value: null,
    },
    realtime: {
      shift: {
        isAutoSelect: false,
        isEndToNow: false,
        isCustomRefreshInterval: false,
        refreshInterval: 60 * 1000,
      },
    },
  },
  ui: {
    element: {
      progressBar: {
        isVisible: false,
      },
      date: {
        input: {
          isVisible: true,
          value: formatToDate(),
        },
        label: {
          isVisible: false,
          value: 'Select day',
        },
      },
      time: {
        input: {
          isVisible: false,
          value: '',
        },
      },
      rangeButton: {
        label: {
          type: 'text-and-icon',
          startEnd: 'Start-End',
          start: 'Start',
          end: 'End',
        },
      },
      shiftButton: {
        label: {
          type: 'text-and-icon',
          time: {
            isVisible: true,
          },
          options: {
            sunny: [],
            sunset: [],
            night: [],
          },
        },
      },
      replay: {
        time: {
          isEnabled: false,
          unit: undefined,
          end: null,
          isNextDay: false,
        },
        maxTime: {
          value: 0,
          min: 0,
          max: 0,
          step: 1,
        },
      },
    },
  },
};

const normalizeOptions = (input?: Partial<TPropOptions> | null): TPropOptions => {
  const options = input ?? {};
  const nowDate = formatToDate();

  return {
    ...defaultOptions,
    ...options,
    data: {
      ...defaultOptions.data,
      ...(options.data ?? {}),
      shifts: options.data?.shifts ?? defaultOptions.data?.shifts ?? null,
    },
    state: {
      ...defaultOptions.state,
      ...(options.state ?? {}),
      shifts: {
        ...defaultOptions.state.shifts,
        ...(options.state?.shifts ?? {}),
      },
    },
    settings: {
      ...defaultOptions.settings,
      ...(options.settings ?? {}),
      time: {
        ...defaultOptions.settings.time,
        ...(options.settings?.time ?? {}),
      },
      dataSource: {
        ...defaultOptions.settings.dataSource,
        ...(options.settings?.dataSource ?? {}),
        static: {
          ...defaultOptions.settings.dataSource.static,
          ...(options.settings?.dataSource?.static ?? {}),
        },
        filter: {
          ...defaultOptions.settings.dataSource.filter,
          ...(options.settings?.dataSource?.filter ?? {}),
        },
      },
      groups: {
        ...defaultOptions.settings.groups,
        ...(options.settings?.groups ?? {}),
        label: {
          ...defaultOptions.settings.groups.label,
          ...(options.settings?.groups?.label ?? {}),
        },
      },
    },
    db: {
      ...defaultOptions.db,
      ...(options.db ?? {}),
      table: {
        ...defaultOptions.db.table,
        ...(options.db?.table ?? {}),
        shifts: {
          ...defaultOptions.db.table.shifts,
          ...(options.db?.table?.shifts ?? {}),
          columns: {
            ...defaultOptions.db.table.shifts.columns,
            ...(options.db?.table?.shifts?.columns ?? {}),
          },
        },
        shift_groups: {
          ...defaultOptions.db.table.shift_groups,
          ...(options.db?.table?.shift_groups ?? {}),
          columns: {
            ...defaultOptions.db.table.shift_groups.columns,
            ...(options.db?.table?.shift_groups?.columns ?? {}),
          },
        },
        filter: {
          ...defaultOptions.db.table.filter,
          ...(options.db?.table?.filter ?? {}),
          column: {
            ...defaultOptions.db.table.filter.column,
            ...(options.db?.table?.filter?.column ?? {}),
          },
        },
      },
    },
    ux: {
      ...defaultOptions.ux,
      ...(options.ux ?? {}),
      time: {
        ...defaultOptions.ux.time,
        ...(options.ux?.time ?? {}),
      },
      realtime: {
        ...defaultOptions.ux.realtime,
        ...(options.ux?.realtime ?? {}),
        shift: {
          ...defaultOptions.ux.realtime.shift,
          ...(options.ux?.realtime?.shift ?? {}),
        },
      },
    },
    ui: {
      ...defaultOptions.ui,
      ...(options.ui ?? {}),
      element: {
        ...defaultOptions.ui.element,
        ...(options.ui?.element ?? {}),
        progressBar: {
          ...defaultOptions.ui.element.progressBar,
          ...(options.ui?.element?.progressBar ?? {}),
        },
        date: {
          ...defaultOptions.ui.element.date,
          ...(options.ui?.element?.date ?? {}),
          input: {
            ...defaultOptions.ui.element.date.input,
            ...(options.ui?.element?.date?.input ?? {}),
            value: options.ui?.element?.date?.input?.value || nowDate,
          },
          label: {
            ...defaultOptions.ui.element.date.label,
            ...(options.ui?.element?.date?.label ?? {}),
          },
        },
        time: {
          ...defaultOptions.ui.element.time,
          ...(options.ui?.element?.time ?? {}),
          input: {
            ...defaultOptions.ui.element.time.input,
            ...(options.ui?.element?.time?.input ?? {}),
          },
        },
        rangeButton: {
          ...defaultOptions.ui.element.rangeButton,
          ...(options.ui?.element?.rangeButton ?? {}),
          label: {
            ...defaultOptions.ui.element.rangeButton.label,
            ...(options.ui?.element?.rangeButton?.label ?? {}),
          },
        },
        shiftButton: {
          ...defaultOptions.ui.element.shiftButton,
          ...(options.ui?.element?.shiftButton ?? {}),
          label: {
            ...defaultOptions.ui.element.shiftButton.label,
            ...(options.ui?.element?.shiftButton?.label ?? {}),
            time: {
              ...defaultOptions.ui.element.shiftButton.label.time,
              ...(options.ui?.element?.shiftButton?.label?.time ?? {}),
            },
            options: {
              ...defaultOptions.ui.element.shiftButton.label.options,
              ...(options.ui?.element?.shiftButton?.label?.options ?? {}),
            },
          },
        },
        replay: {
          ...defaultOptions.ui.element.replay,
          ...(options.ui?.element?.replay ?? {}),
          time: {
            ...defaultOptions.ui.element.replay.time,
            ...(options.ui?.element?.replay?.time ?? {}),
          },
          maxTime: {
            ...defaultOptions.ui.element.replay.maxTime,
            ...(options.ui?.element?.replay?.maxTime ?? {}),
          },
        },
      },
    },
  };
};

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
  options = normalizeOptions(options);

  // Fixed-time mode is deprecated and intentionally disabled.
  options.ux.time.isFixed = false;

  options.ui.element.date.input.isVisible = true;
  options.ui.element.date.input.value = options.ui.element.date.input.value || formatToDate();

  options.settings.time = setTimeSettings(options);

  return options;
};
