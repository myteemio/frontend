'use client';

import {
  Box,
  Card,
  Grid,
  ThemeProvider,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import styles from './DatePicker.module.css';
import { teemioTheme } from '@/styling/theme';
import { DateStyledBox } from '../StyledComponents/DateBox';
import {
  calenderMonthMapper,
  calenderWeekDayMapper,
} from '@/app/utils/mappers';
import { findInsertIndex } from '@/app/utils/date';
import { StyledIconButton } from '../StyledComponents/IconButton';
import { StyledClearIcon } from '../StyledComponents/ClearIcon';

export interface HighlightedDay {
  formattedDate: string;
  day: string;
  dayNum: number;
  month: string;
}

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    border: `solid 1px ${theme.palette.primary.main}`,
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
  },
  '&.Mui-selected:focus': {
    backgroundColor: 'white',
  },
  '&.MuiPickersDay-root:focus': {
    backgroundColor: 'white',
  },
}));

//Higlight the dates in highlightedDays array
const ServerDay = (props: any) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.find(
      (date: HighlightedDay) => date.formattedDate === day.format('YYYY-MM-DD')
    );

  return (
    <HighlightedDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      selected={isSelected}
    />
  );
};

export function DatePicker() {
  const [highlightedDays, setHighlitedDays] = useState<HighlightedDay[]>([]);

  const theme = useTheme();

  function handleDateChange(date: Dayjs) {
    const formattedDate = date.format('YYYY-MM-DD');
    const day = date.format('ddd');
    const dayNum = date.date();
    const month = date.format('MMM');
    const newHighlightedDays = [...highlightedDays];
    const index = newHighlightedDays.findIndex(
      (existingDate) => existingDate.formattedDate === formattedDate
    );

    if (index !== -1) {
      newHighlightedDays.splice(index, 1);
      setHighlitedDays(newHighlightedDays);
    } else {
      const insertIndex = findInsertIndex(newHighlightedDays, date);
      newHighlightedDays.splice(insertIndex, 0, {
        formattedDate,
        day,
        dayNum,
        month,
      });
      setHighlitedDays(newHighlightedDays);
    }
  }

  return (
    <ThemeProvider theme={teemioTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateStyledBox>
          <Card className={styles.container}>
            <Box className={styles.titleContainer}>
              <Typography
                className={styles.title}
                color={'primary'}
                variant={'h5'}
                fontSize={{ xs: '16px', lg: '24px' }}
                fontWeight={600}
              >
                Vælg datoer
              </Typography>
              <Typography
                className={styles.subtitle}
                fontSize={{ xs: '12px', lg: '16px' }}
                color={teemioTheme.palette.grey[500]}
              >
                Vælg de mulige datoer / tidspunker for dit event
              </Typography>
            </Box>
            <Box display={'flex'} width={'100%'} height={'80%'}>
              <Box
                className={styles.calenderContainer}
                ml={{ xs: '4px' }}
                p={{ xs: '4px' }}
              >
                <DateCalendar
                  sx={{ width: '100%', height: '100%', overflow: 'auto' }}
                  disablePast
                  onChange={(date: Dayjs) => handleDateChange(date)}
                  slots={{
                    day: ServerDay,
                  }}
                  slotProps={{
                    day: {
                      disableHighlightToday: true,
                      highlightedDays,
                    } as any,
                  }}
                />
              </Box>
              <Grid
                container
                alignContent={'start'}
                overflow={'auto'}
                height={'100%'}
                p={{ xs: '12px' }}
                columnGap={2}
                rowGap={2}
              >
                {highlightedDays.map((date, i) => (
                  <Grid
                    key={i}
                    className={styles.dateContainer}
                    border={'solid'}
                    borderRadius={2}
                    maxHeight={'20%'}
                    borderColor={theme.palette.primary.main}
                    item
                    xs={5}
                    md={3}
                    xl={2.5}
                  >
                    <StyledIconButton color="primary" aria-label="delete">
                      <StyledClearIcon />
                    </StyledIconButton>
                    <Typography
                      color={theme.palette.grey[500]}
                      fontSize={{ xs: '8px', lg: '10px', xl: '16px' }}
                      fontWeight={500}
                    >
                      {calenderWeekDayMapper(date.day)}
                    </Typography>
                    <Typography
                      fontWeight={1000}
                      fontSize={{ xs: '10px', lg: '12px', xl: '14px' }}
                    >
                      {date.dayNum}
                    </Typography>
                    <Typography
                      color={theme.palette.grey[500]}
                      fontWeight={1000}
                      fontSize={{ xs: '8px', lg: '10px', xl: '14px' }}
                    >
                      {calenderMonthMapper(date.month)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>
        </DateStyledBox>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
