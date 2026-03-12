import type { Card, CharacterSkill, StatusData } from '../types';

/**
 * JSON 파일을 static import로 로드합니다.
 * cards.json이 UTF-8로 저장되어 있어 webpack이 정상 파싱 가능합니다.
 */
import cardsJson from '../../data/cards.json';
import statusJson from '../../data/status.json';
import charSkillsJson from '../../data/characters_skills.json';

// ── 1) Cards ──────────────────────────────────────────────

/** 전체 카드 목록 (cards.json 기준) */
export const AllCards: Card[] = (cardsJson.cards ?? []) as unknown as Card[];

export const getCardById = (id: string): Card | undefined =>
    AllCards.find(c => c.id === id);

export const buildDeckForCharacter = (characterClass: string): Card[] => {
    // deck_allowed: false 인 전용 카드(ex: blink 패시브)는 덱 조합에서 제외
    const pool = AllCards.filter(
        c => (c.scope === 'common' || c.scope === characterClass) && c.deck_allowed !== false
    );
    const deck: Card[] = [];

    pool.forEach(card => {
        // max_count 만큼 복사본을 생성하여 덱에 추가
        const count = card.max_count ?? 3;
        for (let i = 0; i < count; i++) {
            deck.push({
                ...card,
                id: crypto.randomUUID(),   // 게임 내 고유 인스턴스 ID
                originalId: card.id        // 원본 카드 ID 보존
            });
        }
    });

    // Fisher-Yates 셔플
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
};

// ── 2) Status ─────────────────────────────────────────────

export const StatusRegistry: Record<string, StatusData> = {};

if (statusJson.status_effects) {
    Object.entries(statusJson.status_effects).forEach(([key, val]: [string, unknown]) => {
        const v = val as Record<string, unknown>;
        StatusRegistry[key] = {
            name: v.name as string,
            trigger: v.trigger as string,
            effect: v.effect as string,
            duration_logic: v.duration_logic as string,
            reset_logic: v.reset_logic as string,
        };
    });
}

export const ComplexStackRules = statusJson.complex_stack_rules;

export const getStatusData = (id: string): StatusData | undefined =>
    StatusRegistry[id];

// ── 3) Character Skills ───────────────────────────────────

export const CharacterSkills: Record<string, CharacterSkill> = {};

if (charSkillsJson.character_skills) {
    Object.entries(charSkillsJson.character_skills).forEach(([key, val]) => {
        CharacterSkills[key] = val as unknown as CharacterSkill;
    });
}

export const getSkillData = (characterClass: string) =>
    CharacterSkills[characterClass];