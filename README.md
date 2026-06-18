# Shift Selector Plugin

Shift Selector is a Grafana panel plugin that applies dashboard time ranges based on production shifts.

Current plugin id: `delta-shiftselector-panel`

## What changed in 2.x

- Modernized runtime/tooling for Node 24 and Grafana 11.
- Day-first UI: select production day, then choose a shift from grouped rows.
- Passive by default: dashboard follows Grafana time picker unless user manually selects a shift.
- Real-time auto-select remains available, but opt-in.
- Static configuration is simpler: `uuid` and `group_uuid` are optional.
- Legacy option surfaces were removed from panel options (fixed-time UI, legacy filter option group, legacy shift/date label option groups).

## Requirements

- Grafana `>= 11.0.0`
- Node.js `>= 24` for development
- pnpm (via Corepack recommended)

## Panel configuration

### Data Source

- `Data source type`
  - `Static`: Use JSON in panel options.
  - `Database`: Parse data from query result frames using mapping options.

### Behaviour

- `Real-time shift auto-select`
  - When enabled, plugin auto-tracks active shift and updates URL time range.
- `Change the end of time-range to now`
  - Uses `now` as end for active shift context.
- `Enable custom refresh interval`
  - Enables a custom polling/check interval.
- `Show refresh progress`
  - Displays shift progress UI.

## Time behavior summary

- Manual shift click always sets dashboard `from` / `to` using the selected production day.
- Manual selection stores `group_uuid` and `active_shift_uuid` in the URL.
- Production day is persisted in URL as `production_date`.
- In auto-select mode, plugin writes shift tracking (`shift_uuid`) and updates dashboard time automatically.
- URL time values are written as epoch milliseconds.

## Static JSON format

Supported payload shapes:

```json
[
  {
    "group": "Weekdays",
    "label": "Morning",
    "startTime": "06:00:00",
    "endTime": "14:00:00"
  }
]
```

or

```json
{
  "static": {
    "shifts": [
      {
        "group": "Weekdays",
        "label": "Morning",
        "startTime": "06:00:00",
        "endTime": "14:00:00"
      }
    ]
  }
}
```

Optional fields:

- `uuid`: optional, generated if missing.
- `group_uuid`: optional, generated from `group` if missing.
- `order`: optional tie-breaker when shifts share the same `startTime`.

## Database mode expectations

In `Database` mode, map your query result columns to these logical fields in panel options:

- Shift group: `uuid`, `name`, `site_uuid`
- Shift: `uuid`, `name`, `start_time`, `end_time`, `order`, `group_uuid`

The query result should provide rows that can be mapped to:

- `group`
- `group_uuid`
- `uuid`
- `label`
- `startTime`
- `endTime`
- `order`

## Notes

- Static parser no longer applies legacy panel filter options.
- The plugin uses local browser date handling for production-day calculations.
- Fixed-time mode is deprecated and forcibly disabled at runtime.
