import dayjs from 'dayjs';

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter(point => dayjs(point.dateFrom).isAfter(dayjs())),
  [FilterType.PRESENT]: (points) => points.filter(point => 
    dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs())
  ),
  [FilterType.PAST]: (points) => points.filter(point => dayjs(point.dateTo).isBefore(dayjs()))
};