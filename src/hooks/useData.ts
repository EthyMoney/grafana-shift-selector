import { PanelProps } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import type { TPropOptions } from '../types';
import { parseDynamicData, parseStaticData } from '../utils/static.data';
import { initShiftsData } from '../utils/shift';
import { useCallback, useEffect, useRef } from 'react';
import { transformGrafanaResponse } from '../utils/data';
import { useStore } from '../store';
import { processProps } from '../utils/props';
import { customRefreshIntervalOptions } from '../utils/grafana/time';

export const useData = (props: PanelProps<TPropOptions>) => {
  const store = useStore();
  const customRefreshInterval = useRef<NodeJS.Timeout | null>(null);

  const refreshDashboard = useCallback(() => {
    const normalizedOptions = processProps(props.options);
    store.setProps(normalizedOptions);
    store.getShifts({ ...props, options: normalizedOptions });
  }, [props, store]);

  useEffect(() => {
    const path = locationService.getLocation();
    const url = new URLSearchParams(path.search);
    let shifts;
    const normalizedOptions = processProps(props.options);

    if (normalizedOptions.settings.dataSource.type === 'static' && normalizedOptions.settings.dataSource.static.data) {
      shifts = parseStaticData(normalizedOptions);
    } else if (normalizedOptions.settings.dataSource.type === 'database' && props.data) {
      shifts = parseDynamicData(transformGrafanaResponse(props.data, normalizedOptions), normalizedOptions);
    }

    if (shifts) {
      store.setProps(initShiftsData(normalizedOptions, shifts));
      store.setShifts(shifts);

      const activeGroupUUID = url.get('group_uuid');
      const activeShiftUUID = url.get('active_shift_uuid');
      const shiftUUID = url.get('shift_uuid');

      if (activeGroupUUID && activeShiftUUID && shifts[activeGroupUUID]) {
        const setActive = shifts[activeGroupUUID].shifts.find((shift) => shift.uuid === activeShiftUUID);

        if (setActive && store.setToActive !== setActive) {
          store.setClickedShift(activeGroupUUID, setActive /* active */);
        }
      }

      if (activeGroupUUID && shiftUUID && shifts[activeGroupUUID]) {
        const active = shifts[activeGroupUUID].shifts.find((shift) => shift.uuid === shiftUUID);

        if (active) {
          store.setShift(activeGroupUUID, active);
        }
      }

      if (
        normalizedOptions.settings.time.refreshInterval &&
        customRefreshIntervalOptions.find((option) => option.value === normalizedOptions.settings.time.refreshInterval)
      ) {
        customRefreshInterval.current = setInterval(refreshDashboard, normalizedOptions.settings.time.refreshInterval);
      }
    }
    return () => {
      if (customRefreshInterval.current) {
        clearInterval(customRefreshInterval.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...store,
  };
};
