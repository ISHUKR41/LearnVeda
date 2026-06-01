const fs = require('fs');
const filePath = 'c:\\Users\\MR.ROBOT\\OneDrive - Park University\\Desktop\\New folder (3)\\education\\education\\frontend\\src\\components\\simulations\\Topic11Professional.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const regex = /\/\*\s*━+\s*\n\s*\*\s*(\d+\.\s*[^\n]+)\n[\s\S]*?\*\s*━+\s*\*\/[\s\S]*?export\s+function\s+(Sim_\w+)/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Component: ${match[2]} | Header: ${match[1].trim()}`);
}

console.log("\nAlternative simple header extraction:");
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export function Sim_')) {
    // Look up 10 lines for any header comment
    let heading = "";
    for (let j = Math.max(0, i - 15); j < i; j++) {
      if (lines[j].includes('/* ━━') || lines[j].includes('* 1.') || lines[j].includes('* 2.') || lines[j].includes('* 3.') || lines[j].includes('* 4.') || lines[j].includes('* 5.')) {
        heading += " | " + lines[j].trim();
      }
    }
    console.log(`Line ${i+1}: ${lines[i].trim()} ${heading}`);
  }
}
