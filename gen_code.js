// 전체 코드 수집 스크립트 - 코드 수정 후 자동 실행용
// 실행: node gen_code.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const OUTPUT = path.join(ROOT, 'all_game_code_test.md');

// 수집 대상 확장자
const EXTS = ['.ts', '.tsx', '.css', '.json', '.mjs', '.prisma'];

// 제외할 폴더
const EXCLUDE_DIRS = ['node_modules', '.next', 'dist', '.git'];
// 제외할 파일
const EXCLUDE_FILES = [
    'all_game_code.md',
    'all_game_code_test.md',
    'package-lock.json',
    'gen_code.js'
];

const langMap = {
    ts: 'typescript', tsx: 'tsx', css: 'css',
    json: 'json', mjs: 'javascript', prisma: 'prisma'
};

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (!EXCLUDE_DIRS.includes(f)) results.push(...walk(full));
        } else {
            if (EXTS.includes(path.extname(f)) && !EXCLUDE_FILES.includes(f)) {
                results.push(full);
            }
        }
    }
    return results;
}

const files = walk(ROOT);
let md = '# 전체 게임 코드 (생략 없이 전부)\n\n';
md += '> 생성일시: ' + new Date().toLocaleString('ko-KR') + '\n\n';
md += '> 총 파일 수: ' + files.length + '개\n\n';
md += '---\n\n';

for (const f of files) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    const ext = path.extname(f).replace('.', '');
    const lang = langMap[ext] || ext;
    const content = fs.readFileSync(f, 'utf-8');

    md += '## ' + rel + '\n\n';
    md += '```' + lang + '\n';
    md += content;
    if (!content.endsWith('\n')) md += '\n';
    md += '```\n\n';
    md += '---\n\n';
}

fs.writeFileSync(OUTPUT, md, 'utf-8');
console.log('[gen_code] ✅ 완료! 총 ' + files.length + '개 파일 → all_game_code_test.md');
