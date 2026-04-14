const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = {
  'selection:bg-white': 'selection:bg-[#ffffff]',
  'selection:text-black': 'selection:text-[#000000]'
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

fs.writeFileSync('src/App.tsx', content);
console.log("Done");
