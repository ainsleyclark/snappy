import * as fs from 'fs';


fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
});

console.log(Buffer.from("Hello World").toString('base64'));
console.log(Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'));