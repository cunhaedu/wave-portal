import { format } from 'date-fns';

export function formatDate(rawDate?: string): string {
  if (!rawDate) {
    return '';
  }

  const date = new Date(parseInt(rawDate, 10) * 1000);

  return format(date, 'dd/MM/yyyy hh:mm');
}
