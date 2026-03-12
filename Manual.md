# 🎮 [Project Manual] AI Developer's Guide for Turn-based Card Battle (v2.0)

이 문서는 Gemini, Claude, GPT와 같은 차세대 AI 개발자들이 본 프로젝트의 **기획 의도, 시스템 아키텍처, 코드별 설계 의도**를 완벽하게 파악하고 유지보수할 수 있도록 작성된 특급 메뉴얼입니다.

---

## 1. 프로젝트 정체성 (Project Identity)
이 게임은 **"심리전과 전술적 위치 선정"**이 결합된 하이엔드 턴제 카드 배틀 게임입니다. 일반적인 TCG와 달리 3x3 그리드 위에서 캐릭터가 직접 움직이며, 상대의 다음 수를 예측하여 스킬을 적중시키는 것이 핵심 재미 요소입니다.

---

## 2. 핵심 게임 루프 (Game Flow)
1. **로비 (Lobby)**: 캐릭터 선택 및 20장의 카드 덱 빌딩. (BGM: `bgm_lobby`)
2. **플래닝 페이즈 (Planning Phase)**: 플레이어와 AI가 동시에 3개의 행동을 예약.
3. **배틀 페이즈 (Battle Phase)**: 예약된 행동이 1번 슬롯부터 순차적으로 교차 실행. (BGM: `bgm_battle`)
   - 실행 순서: P1-Action1 -> P2-Action1 -> P1-Action2 -> ...
4. **결과 처리 & 성장**: 턴 종료 시 상태 이상 처리 및 덱 셔플 시 캐릭터 레벨업(능력 강화).

---

## 3. 코드별 설계 의도 및 역할 (Code Architecture)

### 🧠 [Core Logic]
- **`src/engine/store.ts` (Zustand State)**
  - **역할**: 게임의 '심장'. 모든 상태 변화와 전투 연산이 일어나는 곳.
  - **설계 의도**: 단일 상태 트리를 유지하여 `Undo/Redo` 가능성을 열어두고, `resolveNextStep` 함수를 통해 복잡한 동시 턴 로직을 절차적으로 해결함.
- **`src/engine/skillEngine.ts`**
  - **역할**: 캐릭터별 특수 능력 및 이동 물리 보정.
  - **설계 의도**: 캐릭터의 전용 스킬(예: 전사의 돌진, 점퍼의 블링크)이 일반적인 이동/공격 로직을 오버라이드할 수 있게 하여 확장성을 확보함.
- **`src/engine/statusEngine.ts`**
  - **역할**: 독, 화상, 빙결, 침묵 등 상태 이상 시스템.
  - **설계 의도**: 데미지 계산식에 개입하거나 특정 페이즈에 트리거되어 '전략적 변수'를 창출함.

### 🎭 [UI & Interaction]
- **`src/app/game/page.tsx`**
  - **역할**: 메인 게임 뷰 및 사용자 입력 처리.
  - **설계 의도**: `Framer Motion`과 `AnimatePresence`를 활용하여 턴제 게임의 딱딱함을 없애고 부드러운 전환 효과를 제공함.
- **`src/components/game/ui/HandSystem.tsx`**
  - **역할**: 플레이어의 카드 렌더링 및 선택.
  - **설계 의도**: 부채꼴 모양의 카드 배치를 통해 실제 카드 게임의 손맛을 구현하고, 기력(Energy) 예측 시스템을 통해 사용자의 실수를 방지함.
- **`src/engine/soundEngine.ts`**
  - **역할**: `Howler.js` 기반 사운드 관리.
  - **설계 의도**: 모든 리소스를 사전 로드(Preload)하여 레이턴시를 없애고, 상황별 BGM 전환 및 SFX 중첩 재생을 지원함.

---

## 4. 특수 시스템 가이드

### 💥 [파괴] 시스템 (Destroy Mechanism)
- **정의**: 특정 강력한 카드는 사용 즉시 게임에서 영구 제외됨.
- **구현**: `Card` 인터페이스의 `ability: "파괴"` 속성을 체크하여 `discardPile`로 이동하지 않고 소멸하도록 설계됨.

### 🧙‍♂️ 예언가(Prophet) 특화 로직
- **Peek & Copy**: 상대의 패를 확인하고 0코스트로 복제하는 시스템.
- **의도**: 정보의 불균형을 이용한 고난도 전략 캐릭터로, `peekingCards` 상태를 통해 전용 UI 팝업을 트리거함.

---

## 5. AI 개발자를 위한 유지보수 수칙 (Crucial Rules)

1. **파일 구조 엄수**: 
   - `all_game_code_test.md`: 모든 신규 기능 적용 및 테스트용.
   - `all_game_code.md`: 대표님 승인 하에 최종 동기화되는 배포용 원본.
2. **사운드 경로 주의**: 반드시 `public/sounds/` (복수형) 폴더를 사용하며, 파일명 매핑은 `soundEngine.ts`의 `SOUND_FILES` 객체를 따를 것.
3. **로직 생략 금지**: 어떤 경우에도 코드를 요약(`// ...`)하지 말고 전체 코드를 덮어쓰기 방식으로 작업할 것.
4. **시각적 품질**: `triggerScreenShake`나 `VFXManager`를 활용하여 타격감과 몰입감을 항상 최우선으로 고려할 것.

---

**Created by Antigravity (Assistant) / Project Directed by Geonwoo Kang**
