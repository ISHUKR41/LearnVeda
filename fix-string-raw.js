const fs = require('fs');
const path = require('path');
const dir = 'frontend/src/lib/content/class9/science/force-and-laws-of-motion';
const files = fs.readdirSync(dir).filter(f => f.startsWith('topic-') && f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/content: `([\s\S]*?)`,\n\s*questions:/g, 'content: String.raw`$1`,\n  questions:');
  fs.writeFileSync(filePath, content);
  console.log('Fixed ' + file);
});
