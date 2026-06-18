import React, { ComponentType, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { locationService } from '@grafana/runtime';

import { useData } from './hooks/useData';
import { TPropOptions } from './types';
import { ThemeProvider } from './components/themeProvider';
import { Wrapper } from './components/ui/container';
import { Shifts } from './components/ui/shifts';
import { processProps } from './utils/props';

const ShiftSelector: React.FC<PanelProps<TPropOptions>> = (props) => {
  const store = useData(props);

  useEffect(() => {
    const normalizedOptions = processProps(props.options);
    const productionDate = locationService.getSearchObject()?.production_date as string | undefined;
    const nextOptions = productionDate
      ? {
        ...normalizedOptions,
        ui: {
          ...normalizedOptions.ui,
          element: {
            ...normalizedOptions.ui.element,
            date: {
              ...normalizedOptions.ui.element.date,
              input: {
                ...normalizedOptions.ui.element.date.input,
                isVisible: true,
                value: productionDate,
              },
            },
          },
        },
      }
      : normalizedOptions;

    store.setProps(nextOptions);
    store.getShifts({ ...props, options: nextOptions });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <Wrapper>
      <Shifts />
    </Wrapper>
  );
};

const App: ComponentType<PanelProps<TPropOptions>> | null = (props) => {
  return (
    <ThemeProvider>
      <ShiftSelector {...props} />
    </ThemeProvider>
  );
};

export default App;
