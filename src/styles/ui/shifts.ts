import { styled } from '@stitches/react';
import { config } from '@grafana/runtime';
import { containerMinHeight, containerMinWidth } from './container';

const { colors, spacing, shape } = config.theme2;

export const Wrapper = styled('div', {
  containerType: 'size',
  containerName: 'shifts',
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  gap: 0,
  minHeight: 0,
  height: '100%',
  alignItems: 'stretch',
});

export const Layout = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'minmax(220px, 260px) minmax(0, 1fr)',
  gap: spacing.x2,
  width: '100%',
  height: '100%',
  minHeight: 0,

  [`@container panel (width < ${containerMinWidth})`]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto minmax(0, 1fr)',
  },
});

export const DatePickerPanel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.x1,
});

export const DatePickerTitle = styled('div', {
  color: colors.text.secondary,
  fontWeight: 700,
  fontSize: '1.375rem',
  lineHeight: 1.2,

  [`@container panel (width < ${containerMinWidth})`]: {
    fontSize: '1.125rem',
  },
});

export const DateInput = styled('input', {
  width: '100%',
  minHeight: 40,
  padding: `0 ${spacing.x1_5}`,
  border: `1px solid ${colors.border.weak}`,
  borderRadius: shape.radius.default,
  background: colors.background.secondary,
  color: colors.text.primary,
  fontFamily: 'Kode Mono, monospace',
  fontSize: '1.125rem',
  lineHeight: 1,

  '&:focus': {
    outline: `2px solid ${colors.info.border}`,
    outlineOffset: 1,
  },

  [`@container panel (width < ${containerMinWidth})`]: {
    minHeight: 34,
    fontSize: '0.95rem',
  },
});

export const GroupList = styled('div', {
  display: 'grid',
  gridAutoRows: 'minmax(0, 1fr)',
  gap: spacing.x1,
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  flex: 1,

  '@container panel (height < 260px)': {
    display: 'flex',
    flexDirection: 'column',
  },
});

export const GroupRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'minmax(160px, 230px) minmax(0, 1fr)',
  gap: spacing.x1,
  border: `1px solid ${colors.border.weak}`,
  padding: spacing.x0_5,
  alignItems: 'stretch',
  minHeight: 0,

  [`@container panel (width < ${containerMinWidth})`]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto minmax(0, 1fr)',
    minHeight: 96,
  },

  '@container panel (height < 260px)': {
    minHeight: 72,
  },
});

export const GroupLabel = styled('div', {
  display: 'flex',
  alignItems: 'center',
  color: colors.text.secondary,
  fontWeight: 700,
  fontSize: '1.125rem',
  lineHeight: 1.1,
  whiteSpace: 'pre-wrap',

  [`@container panel (width < ${containerMinWidth})`]: {
    fontSize: '1rem',
    alignItems: 'flex-start',
  },
});

export const GroupShifts = styled('div', {
  minWidth: 0,
  display: 'flex',
  alignItems: 'stretch',
  height: '100%',
  minHeight: 0,
  flex: 1,
});

export const Container = styled('div', {
  containerType: 'size',
  containerName: 'shifts',
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  gap: spacing.x1,
  height: '100%',
  alignItems: 'stretch',
  flexWrap: 'wrap',

  '@container shifts (height < 40px)': {
    gap: spacing.x0_25,
  },

  [`@container panel (width < 60px)`]: {
    flexWrap: 'unset',
  },
});

export const Shift = styled('div', {
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: 0,
  height: '100%',

  '> div': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
  },

  '@container shifts (height < 40px)': {
    height: '24px !important',
    minHeight: '24px !important',

    button: {
      lineHeight: '24px',
      fontSize: 12,
      height: '24px !important',
    },
  },
});

export const ButtonWrapper = styled('div', {
  position: 'relative',
  width: '100%',
  lineHeight: 1,
  minHeight: 56,
  height: '100%',

  '@container shifts (height < 40px)': {
    minHeight: 24,
    height: 24,
  },
});

export const ButtonLabel = styled('span', {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.x1,
});

export const ShiftTimeRange = styled('span', {
  background: colors.action.disabledBackground,
  color: colors.text.maxContrast,
  fontSize: '0.8rem',
  borderRadius: shape.radius.default,
  lineHeight: 1.2,
  padding: `0 ${spacing.x0_5}`,
  fontWeight: 'normal',
});

export const Horizontal = styled('div', {
  height: '100%',
});
export const Vertical = styled('div', {
  width: '100%',
});

export const Button = styled('button', {
  fontFamily: 'Kode Mono, monospace',
  fontSize: '1rem',
  position: 'relative',
  border: 'none',
  color: colors.text.secondary,
  background: 'transparent',
  zIndex: 1,
  height: '100%',
  minHeight: 56,
  padding: `${spacing.x0_25} ${spacing.x1}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.x0_25,

  '&[disabled]': {
    cursor: 'not-allowed',
  },

  '&[data-selected="true"]': {
    color: colors.text.maxContrast,
    background: colors.action.selected,
    fontWeight: 'bold',

    '@container shifts (height < 40px)': {
      '&[data-is-fixed="true"]': {
        svg: {
          width: 16,
        }
      }
    },
  },
  '&[data-active="false"]': {},
  '&[data-closest="true"]': {
    boxShadow: 'none',
  },
  '&[data-manual-active="true"] ~ [data-active="true"]': {
    fontWeight: 'normal',
  },
  '&[data-manual-active="false"]': {},
  '&:hover': {
    background: colors.action.hover,
    color: colors.text.maxContrast,
  },

  [`@container shifts (width > 60px) and (width < ${containerMinWidth})`]: {
    height: '100% !important',
    fontSize: '0.85rem',
  },

  [`@container shifts (width < 60px)`]: {
    writingMode: 'vertical-rl',
    textOrientation: 'sideways',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.8rem',

    [`${ShiftTimeRange}`]: {
      padding: `${spacing.x1} 0`,
    },
  },

  [`@container shifts (width < 60px) and (height < ${containerMinHeight})`]: {
    [`${ButtonLabel}`]: {
      display: 'none',
    },
    [`${ShiftTimeRange}`]: {
      fontSize: 'unset',
      backgroundColor: 'transparent',
    },
  },

  [`@container shifts (width < 200px) and (height < 200px)`]: {
    gap: 0,

    [`${ShiftTimeRange}`]: {
      display: 'none',
    },
  },

});

export const ShiftButtonProgress = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: colors.border.medium,
  overflow: 'hidden',
  zIndex: 0,
  opacity: 0.125,

  '> div': {
    backgroundColor: colors.info.border,
    transition: 'width 0.3s ease, height 0.3s ease',
  },

  [`${Vertical}`]: {
    display: 'none',
  },

  [`@container shifts (width < 60px)`]: {
    [`${Horizontal}`]: {
      display: 'none',
    },
    [`${Vertical}`]: {
      display: 'block',
    },
  },
});

