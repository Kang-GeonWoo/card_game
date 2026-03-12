---
description: 코드 수정 후 자동으로 all_game_code_test.md 업데이트
---

# 코드 수정 후 테스트 파일 자동 업데이트 워크플로우

## 언제 실행하나요?
- 안티그래비티가 하나 이상의 코드 파일을 수정/생성/삭제한 직후 **항상** 실행합니다.
- 단, 다음 파일만 변경한 경우는 제외합니다:
  - `all_game_code_test.md` 자체
  - `all_game_code.md`

## 실행 방법

// turbo
1. 프로젝트 루트에서 다음 명령어를 실행합니다:
```
node gen_code.js
```

실행 위치: `e:\kang.geonwoo\game\turn_card_battle_v2`

2. 실행 완료 후 **반드시** 대표님께 아래 형식으로 알립니다:
```
📄 all_game_code_test.md 업데이트 완료! (수정된 파일: X개)
```

## 확인 사항
- 실행 후 콘솔에 `✅ 완료! 총 N개 파일 → all_game_code_test.md` 메시지가 출력되면 성공입니다.
- 오류 발생 시 `gen_code.js` 파일이 루트 폴더에 있는지 확인하세요.
