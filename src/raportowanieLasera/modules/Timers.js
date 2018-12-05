import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

const numbers = interval(1000);
const takeFourNumbers = numbers.pipe(take(4));
//takeFourNumbers.subscribe(x => console.log('Next: ', x));

export const afterSecondsOf = (sec) => interval(sec * 1000)

const timeout = 30
interval(1000).pipe(take(timeout))
