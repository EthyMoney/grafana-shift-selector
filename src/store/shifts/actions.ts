import { TShifts } from '.';
import { TPropOptions } from '../../types';
import { TShift, TShiftGroup, TShiftGroupedData } from '../../types/shifts';
import { StateCreator } from 'zustand';
import { transformGrafanaResponse } from '../../utils/data';
import { parseDynamicData, parseStaticData } from '../../utils/static.data';
import { PanelProps } from '@grafana/data';
import { setDashboardTime } from '../../utils/grafana/time';
import { locationService } from '@grafana/runtime';

export type TShiftActions = {
  setShifts: (shifts: TShiftGroupedData) => void;
  setShift: (group_uuid: string, shift: TShift) => void;
  setClickedShift: (group_uuid: string, shift: TShift, active?: TShift) => void;
  getShifts: (props: PanelProps<TPropOptions>) => void;
  getShiftsByGroup: (id: string) => TShiftGroup | null;
  getShiftsByActiveGroup: () => TShiftGroup | null;
  getShiftsByInitGroup: () => TShiftGroup | null;
  unsetClickedShift: () => void;
};

export const StoreShiftsActions: StateCreator<TShifts, [['zustand/devtools', never]], [], TShiftActions> = (
  set,
  getState
) => ({
  setShifts: (shifts) =>
    set(
      (state) => {
        return {
          shifts: {
            ...state.shifts,
            ...shifts,
          },
        };
      },
      undefined,
      'store:shifts/addShifts'
    ),
  setShift: (group_uuid: string, shift: TShift) =>
    set(
      (state) => ({
        ...state,
        shifts: {
          ...state.shifts,
        },
        active: shift,
        activeGroupUUID: group_uuid,
      }),
      undefined,
      'store:shifts/setShift'
    ),
  setClickedShift: (group_uuid: string, shift: TShift /* active */) =>
    set(
      (state) => ({
        ...state,
        // active: active ?? state.active ?? shift ?? null,
        setToActive: shift,
        activeGroupUUID: group_uuid,
      }),
      undefined,
      'store:shifts/setShift/manually'
    ),
  unsetClickedShift: () =>
    set(
      (state) => ({
        ...state,
        setToActive: null,
        activeGroupUUID: null,
      }),
      undefined,
      'store:shifts/setShift/manually'
    ),
  getShifts: (props) =>
    set(
      (state) => {
        let shifts, active;

        if (props.options.settings.dataSource.type === 'static' && props.options.settings.dataSource.static.data) {
          shifts = parseStaticData(props.options);
        } else if (props.options.settings.dataSource.type === 'database' && props.data) {
          shifts = parseDynamicData(transformGrafanaResponse(props.data, props.options), props.options);
        }

        if (shifts) {
          active = setDashboardTime(shifts, props) ?? null;
        }

        return {
          ...state,
          shifts,
          active,
        };
      },
      undefined,
      'store:shifts/getShifts'
    ),
  getShiftsByGroup: (group_uuid: string) => {
    return getState().shifts?.[group_uuid] ?? null;
  },
  getShiftsByActiveGroup: () => {
    const group_uuid = getState().activeGroupUUID;
    return group_uuid ? getState().shifts?.[group_uuid] ?? null : null;
  },
  getShiftsByInitGroup: () => {
    const shifts = getState().shifts ?? {};
    const shiftUUID = locationService.getSearchObject()?.shift_uuid as string | undefined;

    if (shiftUUID) {
      const matchedShiftGroup = Object.values(shifts).find((group) =>
        group.shifts.some((shift) => shift.uuid === shiftUUID)
      );

      if (matchedShiftGroup?.uuid && matchedShiftGroup.shifts.length) {
        return shifts[matchedShiftGroup.uuid] ?? null;
      }
    }

    const [shiftGroup] = Object.values(shifts);

    if (shiftGroup.uuid && shiftGroup?.shifts?.length) {
      return shifts[shiftGroup.uuid] ?? null;
    }

    return null;
  },
});
