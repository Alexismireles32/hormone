// Date utility functions
// Using date-fns for robust date handling

import {
  isToday,
  isYesterday,
  isThisWeek,
  format,
  formatDistanceToNow,
} from 'date-fns';

/**
 * Group tests by date categories
 */
export function groupTestsByDate<T extends { timestamp: Date }>(tests: T[]): {
  today: T[];
  yesterday: T[];
  thisWeek: T[];
  older: T[];
} {
  const groups = {
    today: [] as T[],
    yesterday: [] as T[],
    thisWeek: [] as T[],
    older: [] as T[],
  };

  tests.forEach((test) => {
    const date = new Date(test.timestamp);
    
    if (isToday(date)) {
      groups.today.push(test);
    } else if (isYesterday(date)) {
      groups.yesterday.push(test);
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      groups.thisWeek.push(test);
    } else {
      groups.older.push(test);
    }
  });

  return groups;
}

/**
 * Format date for display
 */
export function formatTestDate(date: Date): string {
  const testDate = new Date(date);
  
  if (isToday(testDate)) {
    return `Today at ${format(testDate, 'h:mm a')}`;
  }
  
  if (isYesterday(testDate)) {
    return `Yesterday at ${format(testDate, 'h:mm a')}`;
  }
  
  if (isThisWeek(testDate, { weekStartsOn: 1 })) {
    return format(testDate, 'EEEE \'at\' h:mm a');
  }
  
  return format(testDate, 'MMM d, yyyy \'at\' h:mm a');
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format date for chart labels
 */
export function formatChartDate(date: Date): string {
  const testDate = new Date(date);
  
  if (isToday(testDate)) {
    return format(testDate, 'h:mm a');
  }
  
  if (isThisWeek(testDate, { weekStartsOn: 1 })) {
    return format(testDate, 'EEE');
  }
  
  return format(testDate, 'MMM d');
}

