import { isServiceTimePassed } from './date.util';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

console.log('--- Testing isServiceTimePassed ---');

console.log(`Yesterday (${yesterday}):`, isServiceTimePassed(yesterday, '09:00 AM')); // Should be true
console.log(`Tomorrow (${tomorrow}):`, isServiceTimePassed(tomorrow, '09:00 AM')); // Should be false

// Today testing depends on when this script runs.
// current time is 11:30 AM (approx as per previous metadata)
console.log(`Today (${today}) 09:00 AM:`, isServiceTimePassed(today, '09:00 AM')); 
console.log(`Today (${today}) 01:00 PM:`, isServiceTimePassed(today, '01:00 PM')); 

console.log('--- End of Tests ---');
