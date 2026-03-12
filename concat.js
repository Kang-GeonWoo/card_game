const fs = require('fs');
const path = require('path');
function getFiles(dir, exts, files = []) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) getFiles(p, exts, files);
        else if (exts.some(e => p.endsWith(e))) files.push(p);
    });
    return files;
}
let code = '# Game Code Export\n\n';
let allFiles = getFiles('src', ['.ts', '.tsx', '.css']).concat(getFiles('data', ['.json']));
allFiles.forEach(f => {
    let cleanPath = f.replace(/\\/g, '/');
    let ext = path.extname(f).slice(1);
    code += `\n### File: ${cleanPath}\n\`\`\`${ext}\n${fs.readFileSync(f, 'utf8')}\n\`\`\`\n\n`;
});
fs.writeFileSync('all_game_code.md', code, 'utf8');
console.log('Done');
