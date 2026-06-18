# Development

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm run dev
```

Useful commands:

```bash
corepack pnpm run typecheck
corepack pnpm run test:ci
corepack pnpm run build
```

## Build and package

Bump the version before building or grafana will use cached versions. Update `version` in `package.json`.

```bash
corepack pnpm run build
```

Optional zip package:

```powershell
Compress-Archive -Path dist\* -DestinationPath delta-shiftselector-panel-2.0.3.zip -Force
```

## Install on another Grafana instance (private not-signed use)

1. Copy built files from `dist` to your Grafana plugin directory under:
   `.../plugins/delta-shiftselector-panel/`
2. Ensure `plugin.json` is directly under that folder.
3. Allow unsigned plugin loading (if not signed):

```ini
[plugins]
allow_loading_unsigned_plugins = delta-shiftselector-panel
```

Or environment variable:

```bash
GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=delta-shiftselector-panel
```

1. Restart Grafana.
