const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\MR.ROBOT\\OneDrive - Park University\\Desktop\\New folder (3)\\education\\education\\frontend\\src\\components\\simulations\\Topic11Professional.tsx';
const content = fs.readFileSync(filePath, 'utf16le'); // Try UTF-16 LE

const regex = /export\s+function\s+(Sim_\w+)/g;
let match;
const matches = [];

while ((match = regex.exec(content)) !== null) {
  matches.push(match[1]);
}

console.log("UTF-16 Matches count:", matches.length);
if (matches.length > 0) {
  console.log(JSON.stringify(matches, null, 2));
} else {
  // Try UTF-8 as fallback
  const contentUtf8 = fs.readFileSync(filePath, 'utf8');
  const matchesUtf8 = [];
  let matchUtf8;
  while ((matchUtf8 = regex.exec(contentUtf8)) !== null) {
    matchesUtf8.push(matchUtf8[1]);
  }
  console.log("UTF-8 Matches count:", matchesUtf8.length);
  console.log(JSON.stringify(matchesUtf8, null, 2));
}
