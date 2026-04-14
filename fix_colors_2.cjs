const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = {
  'bg-white ': 'bg-[#ffffff] ',
  'bg-white"': 'bg-[#ffffff]"',
  'text-white ': 'text-[#ffffff] ',
  'text-white"': 'text-[#ffffff]"',
  'border-white ': 'border-[#ffffff] ',
  'border-white"': 'border-[#ffffff]"',
  'bg-black ': 'bg-[#000000] ',
  'bg-black"': 'bg-[#000000]"',
  'text-black ': 'text-[#000000] ',
  'text-black"': 'text-[#000000]"',
  'border-transparent': 'border-[#00000000]',
  'bg-transparent': 'bg-[#00000000]'
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

fs.writeFileSync('src/App.tsx', content);
console.log("Done");
