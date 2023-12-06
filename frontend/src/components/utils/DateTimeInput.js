import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';

export default function DateTimeInput({
    label="date",
    disableFuture=true,
    disablePast=false,
    disabled=false,
    format='D/M/YYYY  HH:mm',
    maxDate,
    minDate=dayjs('2023-3-1T0:0'),
    callback
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label={label}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          ampm={false}
          closeOnSelect={true}
          disableFuture={disableFuture}
          disablePast={disablePast}
          disabled={disabled}
          format={format}
          maxDate={maxDate}
          minDate={minDate}
          onAccept={(event)=>callback(event.$d.valueOf())}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}