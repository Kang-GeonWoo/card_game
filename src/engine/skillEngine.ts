import { PlayerState, Action, Card } from '../types';
import { getSkillData, getCardById } from './dataLoader';
import { useGameStore } from './store';

export const SkillEngine = {
    onCollision: (p1: PlayerState, p2: PlayerState, logs: string[]) => {
        [p1, p2].forEach(p => {
            if (p.characterId === 'warrior') {
                const skill = getSkillData('warrior');
                const target = p === p1 ? p2 : p1;
                if (p.position.x === target.position.x && p.position.y === target.position.y) {
                    const levelData = skill?.levels?.[p.skillLevel.toString()];
                    if (levelData && levelData.damage) {
                        target.hp -= levelData.damage;
                        logs.push(`>> [전사 특성 발동!] ${p.id}의 돌진이 적을 들이받아 ${levelData.damage} 피해!`);
                        useGameStore.getState().showSkillCutin(p.characterId);
                    }
                }
            }
        });
    },

    overrideMove: (p: PlayerState, action: Action, logs: string[]): Action => {
        if (p.characterId === 'jumper' && action.type === 'move' && p.skillLevel >= 1) {
            logs.push(`>> [점퍼 특성 발동!] ${p.id}가 텔레포트(Blink)로 공간을 도약합니다.`);
            useGameStore.getState().showSkillCutin(p.characterId);
        }
        return action;
    },

    onTurnEnd: (p: PlayerState, logs: string[]) => {
        if (p.characterId === 'jumper' && p.skillLevel >= 3) {
            const hasBlink = p.hand.some(c => (c.originalId || c.id) === 'blink');
            if (!hasBlink && p.hand.length < 10) {
                const blinkCard = getCardById('blink');
                if (blinkCard) {
                    p.hand.push({ ...blinkCard, id: crypto.randomUUID(), originalId: 'blink' });
                    logs.push(`>> [점퍼 LV3 패시브] 공간의 파편이 모여 [블링크] 카드가 손에 생성되었습니다.`);
                }
            }
        }

        // 💡 예언가 레벨에 맞게 prediction 카드를 자동 획득하는 로직
        if (p.characterId === 'prophet') {
            const lv = p.skillLevel;
            if (lv >= 1 && lv <= 3) {
                const targetCardId = `prediction_LV${lv}`;
                const hasCard = p.hand.some(c => (c.originalId || c.id) === targetCardId);
                if (!hasCard && p.hand.length < 10) {
                    const card = getCardById(targetCardId);
                    if (card) {
                        p.hand.push({ ...card, id: crypto.randomUUID(), originalId: card.id });
                        logs.push(`>> [예언가 특성] 덱 순환으로 [${card.name}] 카드를 손패에 얻었습니다.`);
                    }
                }
            }
        }
    },

    onDrawCard: (p: PlayerState, drawnCard: Card, logs: string[]): Card => {
        if (p.characterId === 'esper') {
            if (p.skillLevel >= 3 && drawnCard.type === 'attack') {
                const newCard = getCardById('telekinesis_manipulation');
                if (newCard) {
                    logs.push(`>> [에스퍼 각성!] 공격 카드가 [염력조작]으로 변환되었습니다!`);
                    useGameStore.getState().showSkillCutin(p.characterId);
                    return { ...newCard, id: crypto.randomUUID(), originalId: 'telekinesis_manipulation' };
                }
            }
            const levelData = getSkillData('esper')?.levels?.[p.skillLevel.toString()];
            if (levelData && levelData.transform_rule && drawnCard.type === 'attack') {
                const newCard = getCardById('mana_burst');
                if (newCard) {
                    logs.push(`>> [에스퍼 특성 발동!] 드로우한 공격 카드가 [마나 폭발]로 변환되었습니다!`);
                    useGameStore.getState().showSkillCutin(p.characterId);
                    return { ...newCard, id: crypto.randomUUID(), originalId: 'mana_burst' };
                }
            }
        }
        return drawnCard;
    },

    getExtraAttacks: (p: PlayerState): { count: number, multiplier: number } => {
        if (p.characterId === 'archer') {
            const levelData = getSkillData('archer')?.levels?.[p.skillLevel.toString()];
            if (levelData && levelData.extra_attacks) {
                return { count: levelData.extra_attacks, multiplier: levelData.multiplier ?? 1.0 };
            }
        }
        return { count: 0, multiplier: 1.0 };
    }
};