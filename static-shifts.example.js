/**
 * @description: This is an example of a static shifts data with groups.
 * You can modify and use it by setting the "Data source type" in the "Data Source" panel to "Static",
 * and provide the data in the "Static Shifts Data" field.
 *
 * Notes:
 * - `uuid` and `group_uuid` are optional for static data; the plugin will generate fallback IDs.
 * - `order` is optional and only used as a tie-breaker when shifts share the same `startTime`.
 * */

const data = [
  {
    group: 'Group 1 eg. Summer',
    group_uuid: 'uuid_1',
    uuid: 'shift_uuid_1',
    label: 'Morning Custom',
    startTime: '06:00:00',
    endTime: '14:00:00',
    order: 1,
  },
  {
    group: 'Group 2 eg. Winter',
    group_uuid: 'uuid_2',
    uuid: 'shift_uuid_2',
    label: 'Afternoon Custom',
    startTime: '14:00:00',
    endTime: '22:00:00',
    order: 1,
  },
  {
    group: 'Group 2 eg. Winter',
    group_uuid: 'uuid_2',
    uuid: 'shift_uuid_3',
    label: 'Night Custom',
    startTime: '22:00:00',
    endTime: '06:00:00',
    order: 2,
  },
];
