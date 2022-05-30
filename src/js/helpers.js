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

//RETURN ID CREATED FROM CITY, REGION AND COUNTY NAMES
export function generateId(city, region, country) {
  return `${city}+${region}+${country}`;
}

// API ONLY RETURNS 12H FORMAT OF SUNSET & SUNRISE, SO WE HAVE TO CREATE OUR OWN VERSION OF 24H FORMAT
export function getSun24format(str) {
  // get AM/PM string
  const amPm = str.slice(-3).slice(1).toUpperCase();
  // get hours number out of string
  const hours = +str.slice(0, 2);
  // add 12 to hours if it's PM
  const formatedHours = amPm === 'PM' ? hours + 12 : hours;
  // delete AM/PM and hours from string
  const formatedStr = str.slice(0, -3).slice(2);
  // return final string
  return `${formatedHours < 10 ? '0' : ''}${formatedHours}${formatedStr}`;
}

//GET 12H FORMAT OF HOUR
export function hours12hFormat(hour) {
  // if hours is 12 or 0, return string
  if (+hour === 0) return 'MIDNIGHT';
  else if (+hour === 12) return 'NOON';
  //else return 12h format
  else return +hour % 12;
}

// GET AM/PM INDICATOR
export function setAmPm(hour) {
  const str = +hour < 12 ? ' AM' : ' PM';
  // if hour is 12 or 0, return empty string ('MIDNIGHT' OR 'NOON' will be used)
  if (+hour === 12 || +hour === 0) return '';
  // otherwise return string
  return str;
}
