const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = {
  'bg-white/5': 'bg-[#ffffff0d]',
  'bg-white/10': 'bg-[#ffffff1a]',
  'bg-white/20': 'bg-[#ffffff33]',
  'bg-white/\\[0\\.02\\]': 'bg-[#ffffff05]',
  'border-white/5': 'border-[#ffffff0d]',
  'border-white/10': 'border-[#ffffff1a]',
  'border-white/20': 'border-[#ffffff33]',
  'text-white/50': 'text-[#ffffff80]',
  'hover:bg-white/5': 'hover:bg-[#ffffff0d]',
  'hover:bg-white/10': 'hover:bg-[#ffffff1a]',
  'hover:bg-white/90': 'hover:bg-[#ffffffE6]',
  'text-red-500': 'text-[#ef4444]',
  'text-green-500': 'text-[#22c55e]',
  'bg-background/80': 'bg-[#0a0a0aCC]'
};

for (const [key, value] of Object.entries(replacements)) {
  const regex = new RegExp(key, 'g');
  content = content.replace(regex, value);
}

fs.writeFileSync('src/App.tsx', content);
console.log("Done");
