import React from 'react';
import { ThemeProvider } from '../../themeProvider';

// Persist editor drafts across component remounts triggered by Grafana option refreshes.
const staticDraftCache = new Map<string, string>();
const staticDirtyCache = new Set<string>();
const staticScrollCache = new Map<string, number>();

export const ShiftConfigurator = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const stateRef = React.useRef<HTMLTextAreaElement>(null);
  const [rawValue, setRawValue] = React.useState(() => {
    if (staticDirtyCache.has(id)) {
      return staticDraftCache.get(id) ?? value ?? '';
    }

    return value ?? '';
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isDirty, setIsDirty] = React.useState(staticDirtyCache.has(id));
  const isFocusedRef = React.useRef(false);

  React.useLayoutEffect(() => {
    const textarea = stateRef.current;
    const cachedScroll = staticScrollCache.get(id);

    if (!textarea || typeof cachedScroll !== 'number') {
      return;
    }

    textarea.scrollTop = cachedScroll;
  }, [id, rawValue]);

  React.useEffect(() => {
    if (isDirty || isFocusedRef.current) {
      return;
    }

    setRawValue(value ?? '');
  }, [value, isDirty]);

  const applyJson = (inputValue: string) => {
    try {
      const data = JSON.parse(inputValue);
      const formatted = JSON.stringify(data, null, 2);

      onChange(formatted);
      setRawValue(formatted);
      setError(null);
      setIsDirty(false);
      staticDraftCache.delete(id);
      staticDirtyCache.delete(id);
    } catch (_error) {
      setError('Invalid JSON. Fix the syntax before saving.');
      setIsDirty(true);
      staticDraftCache.set(id, inputValue);
      staticDirtyCache.add(id);
    }
  };

  return (
    <ThemeProvider>
      <div style={{ width: '100%' }}>
        <textarea
          ref={stateRef}
          id={id}
          value={rawValue}
          spellCheck={false}
          placeholder="Paste static shifts JSON here"
          style={{
            width: '100%',
            minHeight: '260px',
            resize: 'vertical',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: '12px',
            lineHeight: 1.45,
            padding: '10px 12px',
            borderRadius: '4px',
            border: error ? '1px solid #d44a3a' : '1px solid #6b7280',
            background: '#111827',
            color: '#e5e7eb',
            boxSizing: 'border-box',
          }}
          onChange={(e) => {
            setRawValue(e.target.value);
            setIsDirty(true);
            staticDraftCache.set(id, e.target.value);
            staticDirtyCache.add(id);
            staticScrollCache.set(id, e.target.scrollTop);
            if (error) {
              setError(null);
            }
          }}
          onFocus={() => {
            isFocusedRef.current = true;
          }}
          onScroll={(e) => {
            staticScrollCache.set(id, e.currentTarget.scrollTop);
          }}
          onBlur={(e) => {
            isFocusedRef.current = false;
            staticScrollCache.set(id, e.currentTarget.scrollTop);
            applyJson(e.target.value);
          }}
        />
        {error && (
          <div style={{ marginTop: '6px', color: '#d44a3a', fontSize: '12px' }} role="alert">
            {error}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};
