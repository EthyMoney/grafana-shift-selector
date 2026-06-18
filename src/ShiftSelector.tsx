import React, { ComponentType, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { locationService } from '@grafana/runtime';

import { useData } from './hooks/useData';
import { TPropOptions } from './types';
import { ThemeProvider } from './components/themeProvider';
import { Wrapper } from './components/ui/container';
import { Shifts } from './components/ui/shifts';

const ShiftSelector: React.FC<PanelProps<TPropOptions>> = (props) => {
  const store = useData(props);

  useEffect(() => {
    const productionDate = locationService.getSearchObject()?.production_date as string | undefined;
    const nextOptions = productionDate
      ? {
        ...props.options,
        ui: {
          ...props.options.ui,
          element: {
            ...props.options.ui.element,
            date: {
              ...props.options.ui.element.date,
              input: {
                ...props.options.ui.element.date.input,
                isVisible: true,
                value: productionDate,
              },
            },
          },
        },
      }
      : props.options;

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
