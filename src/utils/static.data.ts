import { TPropOptions } from '../types';
import type { TRawStaticShift, TShift, TShiftGroupedData } from '../types/shifts';
import { isUpcomingShift, setShiftStates, sortShifts } from './shift';
import { getTimeObject, parseTime } from './time';

type TStaticShiftPayload =
  | TRawStaticShift[]
  | {
    static?: {
      shifts?: TRawStaticShift[];
    };
    shifts?: TRawStaticShift[];
  };

const normalizeStaticShiftsPayload = (payload: TStaticShiftPayload): TRawStaticShift[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.static?.shifts)) {
    return payload.static.shifts;
  }

  if (Array.isArray(payload?.shifts)) {
    return payload.shifts;
  }

  throw new Error('Invalid static shifts format. Expected an array or { static: { shifts: [] } }.');
};

const sanitizeForId = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'item';
};

const getGroupUUID = (shift: TRawStaticShift): string => {
  if (shift.group_uuid?.trim()) {
    return shift.group_uuid.trim();
  }

  return `group_${sanitizeForId(shift.group || '')}`;
};

const getShiftUUID = (shift: TRawStaticShift, groupUUID: string, index: number): string => {
  if (shift.uuid?.trim()) {
    return shift.uuid.trim();
  }

  const label = sanitizeForId(shift.label || 'shift');
  const start = sanitizeForId(shift.startTime || 'start');
  const end = sanitizeForId(shift.endTime || 'end');

  return `${groupUUID}__${label}__${start}__${end}__${index}`;
};

export const parseStaticData = (options: TPropOptions): TShiftGroupedData | null => {
  try {
    const payload = JSON.parse(options.settings.dataSource.static.data) as TStaticShiftPayload;
    const rawShifts = normalizeStaticShiftsPayload(payload);

    let groupedData = groupShiftsByGroup(rawShifts, options);

    if (options.settings?.time?.isEndToNow) {
      groupedData = disableUpcomingShifts(groupedData, options);
    }

    return groupedData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const parseDynamicData = (rawData: TRawStaticShift[], options: TPropOptions): TShiftGroupedData | null => {
  try {
    let data = groupShiftsByGroup(rawData, options);

    if (options.settings?.time?.isEndToNow) {
      data = disableUpcomingShifts(data, options);
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const disableUpcomingShifts = (data: TShiftGroupedData, options: TPropOptions): TShiftGroupedData => {
  return Object.keys(data).reduce((res, groupKey) => {
    return {
      ...res,
      [groupKey]: {
        ...data[groupKey],
        shifts: data[groupKey].shifts.map((shift) => {
          if (!shift.isActive && isUpcomingShift(data[groupKey], shift, options.settings.time.current)) {
            return {
              ...shift,
              isDisabled: true,
            };
          }

          return shift;
        }),
      },
    };
  }, {} as TShiftGroupedData);
};

const groupShiftsByGroup = (
  shifts: TRawStaticShift[],
  options: TPropOptions
): TShiftGroupedData => {
  const shiftGroup = sortShifts<TRawStaticShift>(shifts, 'startTime').reduce((acc, shift, index) => {
    const groupUUID = getGroupUUID(shift);

    const { group } = shift;

    if (!acc[groupUUID]) {
      acc[groupUUID] = {
        label: group,
        uuid: groupUUID,
        activeShift: null,
        shifts: [],
      };
    }

    const shiftData: TShift = {
      uuid: getShiftUUID(shift, groupUUID, index),
      label: shift.label,
      start: parseTime(shift.startTime),
      end: parseTime(shift.endTime),
      order: shift.order ?? index,
    };

    acc[groupUUID].shifts.push(shiftData);

    return acc;
  }, {} as TShiftGroupedData);

  return Object.entries(shiftGroup).reduce((acc, [groupUUID, groupData]) => {
    acc[groupUUID] = getActiveShiftData(setShiftStates(groupData, options), options);
    return acc;
  }, {} as TShiftGroupedData);
};

const getActiveShiftData = (shiftGroupData: TShiftGroupedData['uuid'], options: TPropOptions) => {
  let activeShiftData: TShift | null = null;
  let activeShift: TShift['uuid'] | null = null;

  if (shiftGroupData.hasMultipleActiveShifts) {
    activeShiftData = shiftGroupData.shifts.find(({ isActive, isClosest }) => isActive && isClosest) ?? null;
  } else {
    activeShiftData = shiftGroupData.shifts.find(({ isActive }) => isActive) ?? null;
  }

  activeShift = activeShiftData?.uuid ?? null;

  shiftGroupData = {
    ...shiftGroupData,
    shifts: shiftGroupData.shifts.map((shift) => {
      if (shift?.isActive && options.settings.time?.isEndToNow) {
        if (options.ui.element.time.input.value) {
          shift.end = options.settings.time.current;
        } else {
          shift.end = getTimeObject();
        }
      }

      return shift;
    }),
  };

  return {
    ...shiftGroupData,
    activeShift,
  };
};
