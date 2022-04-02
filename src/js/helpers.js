'use strict';

// CONVERT NUMBER TO DAY OF WEEK STRING
export function daysOfWeek(num, full = undefined) {
  if (num === 0) return full ? 'Sunday' : 'Sun';
  if (num === 1) return full ? 'Monday' : 'Mon';
  if (num === 2) return full ? 'Tuesday' : 'Tue';
  if (num === 3) return full ? 'Wednesday' : 'Wed';
  if (num === 4) return full ? 'Thursday' : 'Thu';
  if (num === 5) return full ? 'Friday' : 'Fri';
  if (num === 6) return full ? 'Saturday' : 'Sat';
}

// ADD ENDING TO DATE STRING
export function dateEnding(num) {
  const date = num + '';
  const lastChar = date.charAt(date.length - 1);
  if (lastChar === '1') return `${num}st`;
  if (lastChar === '2') return `${num}nd`;
  if (lastChar === '3') return `${num}rd`;
  else return `${num}th`;
}

//ADD ZERO BEFORE HOURS AND MINUTES
export function addZero(number) {
  return number < 10 ? `0${number}` : `${number}`;
}
