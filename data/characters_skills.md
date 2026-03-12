[Character Skill Implementation Strategy]

Level-Up Manager: 게임 내에 deck_shuffle_event가 발생할 때마다 해당 플레이어의 skill_level 변수를 1씩 증가시키세요 (최대 3).

Action Override (중요): >     * **점퍼(Jumper)**의 경우, 기본 Move 로직을 Blink 로직으로 덮어쓰기(Override) 해야 합니다.

**궁수(Archer)**의 경우, 데미지 연산 후 extra_attacks 횟수만큼 동일한 이펙트와 로직을 반복 실행하는 루프를 설계하세요.

Collision Check: **전사(Warrior)**의 능력은 '이동 중' 또는 '이동 완료 시' 타일 좌표가 겹치는지 체크하는 실시간 감지 로직이 필요합니다.

UI Feedback: 특수능력이 레벨업될 때 화면에 "Level Up!" 연출과 함께 변경된 스킬 아이콘이나 설명을 띄울 수 있도록 UI 상태를 설계하세요.