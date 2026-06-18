import React, { ComponentType } from 'react';
import { locationService } from '@grafana/runtime';
import {
  Button,
  ButtonLabel,
  ButtonWrapper,
  Container,
  DateInput,
  DatePickerPanel,
  DatePickerTitle,
  GroupLabel,
  GroupList,
  GroupRow,
  GroupShifts,
  Horizontal,
  Layout,
  Shift,
  ShiftButtonProgress,
  ShiftTimeRange,
  Vertical,
  Wrapper,
} from '../../styles/ui/shifts';
import { useStore } from '../../store';
import { TShift, TShiftGroup } from '../../types/shifts';
import { changeShift } from '../../utils/grafana/time';
import { parseStaticData } from '../../utils/static.data';
import { calculateShiftProgress, formatToDate, stringifyTime } from '../../utils/time';
import { Lock } from '../icon/icon';

export const Shifts = () => {
  const store = useStore();

  const normalizeDateInput = (value?: string): string => {
    if (!value) {
      return formatToDate();
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return formatToDate();
    }

    return formatToDate(parsed);
  };

  const dateValue = normalizeDateInput(store.props?.ui.element.date.input.value);

  const groupedShifts = React.useMemo(() => {
    if (!store.shifts) {
      return [];
    }

    return Object.values(store.shifts);
  }, [store.shifts]);

  const onDateChange = (nextDate: string) => {
    if (!store.props) {
      return;
    }

    const path = locationService.getLocation();
    const url = new URLSearchParams(path.search);
    url.set('production_date', nextDate);
    locationService.push('?' + url.toString());

    const nextProps = {
      ...store.props,
      ui: {
        ...store.props.ui,
        element: {
          ...store.props.ui.element,
          date: {
            ...store.props.ui.element.date,
            input: {
              ...store.props.ui.element.date.input,
              isVisible: true,
              value: nextDate,
            },
          },
        },
      },
    };

    store.setProps(nextProps);

    if (nextProps.settings.dataSource.type === 'static' && nextProps.settings.dataSource.static.data) {
      const shifts = parseStaticData(nextProps);

      if (shifts) {
        store.setShifts(shifts);
      }
    }
  };

  return (
    <Layout>
      <DatePickerPanel>
        <DatePickerTitle>Select day</DatePickerTitle>
        <DateInput
          type="date"
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </DatePickerPanel>

      <GroupList>
        {groupedShifts.map((group: TShiftGroup) => (
          <GroupRow key={group.uuid}>
            <GroupLabel>{group.label}</GroupLabel>

            <GroupShifts>
              <Wrapper>
                <Container>
                  {group.shifts.map((shift) => (
                    <ShiftComponent key={shift.uuid} data={shift} groupUUID={group.uuid} />
                  ))}
                </Container>
              </Wrapper>
            </GroupShifts>
          </GroupRow>
        ))}
      </GroupList>
    </Layout>
  );
};

export const ShiftComponent: ComponentType<{ children?: React.ReactNode; data: TShift; groupUUID: string }> = ({
  data,
  groupUUID,
}) => {
  const store = useStore();

  const normalizeDateInput = (value?: string): string => {
    if (!value) {
      return formatToDate();
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return formatToDate();
    }

    return formatToDate(parsed);
  };

  const selectedShiftUUID = store.setToActive?.uuid || (locationService.getSearchObject()?.active_shift_uuid as string | undefined);
  const isSelected = selectedShiftUUID === data.uuid;
  const selectedProductionDate = normalizeDateInput(store.props?.ui.element.date.input.value);
  const isCurrentBrowserDay = selectedProductionDate === formatToDate(new Date());

  if (!data.start || !data.end) {
    return null;
  }

  return (
    <Shift>
      <ButtonWrapper>
        {isSelected && isCurrentBrowserDay ? <ShiftProgress shift={data} /> : null}
        <Button
          data-active={data.isActive}
          data-closest={data.isClosest}
          data-selected={isSelected}
          data-is-fixed={store.props?.ux.time.isFixed}
          data-manual-active={store.setToActive?.uuid === data.uuid}
          {...(store.props?.ux.time.isFixed && data.isActive ? { title: `Time is fixed to: ${stringifyTime(store.props.settings.time.current)}` } : {})}
          onClick={() => changeShift(groupUUID, data, store)}
        >
          <ButtonLabel>
            {store.props?.ux.time.isFixed && data.isActive ? <Lock /> : ''}
            <span>{data.label}</span>
          </ButtonLabel>
          {store.props?.ux.time.isFixed && data.isActive
            ? <ShiftTimeRange>{stringifyTime(store.props.settings.time.current)}</ShiftTimeRange>
            : <ShiftTimeRange>{[stringifyTime(data.start), stringifyTime(data.end)].join('-')}</ShiftTimeRange>
          }
        </Button>
      </ButtonWrapper>
    </Shift>
  );
};

export const ShiftProgress: ComponentType<{ children?: React.ReactNode; shift: TShift }> = ({ shift }) => {
  const store = useStore();
  const progress = calculateShiftProgress(shift, store.props);

  return (
    <ShiftButtonProgress>
      <Horizontal
        style={{
          width: `${progress}%`,
        }}
      />
      <Vertical
        style={{
          height: `${progress}%`,
        }}
      />
    </ShiftButtonProgress>
  );
};
