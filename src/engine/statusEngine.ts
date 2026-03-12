import { PlayerState } from '../types';
import { getStatusData, ComplexStackRules } from './dataLoader';

export const StatusEngine = {
    // 상태이상 부여 유틸
    addStatus: (player: PlayerState, statusId: string, value: number, logs: string[]) => {
        if (!player.statuses) player.statuses = [];
        const exist = player.statuses.find(s => s.id === statusId);
        if (exist) {
            // isStackable 연산이 있다면 반영하겠으나 현재는 기본 중첩(Add)
            exist.value += value;
        } else {
            player.statuses.push({ id: statusId, value });
        }
        const data = getStatusData(statusId);
        logs.push(`   -> [상태이상] ${player.id}에게 [${data?.name || statusId}] 부여! (수치: ${value})`);

        // 부여 직후 폭발 콤보(Complex Rules) 체크
        StatusEngine.checkCombo(player, logs);
    },

    // 특정 데미지 계수 수정 훅 (화상: 0.5배 감소, 취약: 2배 증가, 강화: 2배 증가)
    getDamageMultiplier: (attacker: PlayerState, defender: PlayerState): number => {
        let multiplier = 1.0;

        // 공격자 디버프/버프
        if (attacker.statuses?.find(s => s.id === 'burn')) multiplier *= 0.5;
        if (attacker.statuses?.find(s => s.id === 'strengthen')) multiplier *= 2.0;

        // 방어자 디버프
        if (defender.statuses?.find(s => s.id === 'vulnerable')) multiplier *= 2.0;

        return multiplier;
    },

    // 트리거별 (on_turn_end, on_move 등) 효과 격발
    trigger: (player: PlayerState, triggerType: string, logs: string[]) => {
        if (!player.statuses || player.statuses.length === 0) return;

        player.statuses.forEach(st => {
            const data = getStatusData(st.id);
            if (!data) return;

            if (data.trigger === triggerType) {
                // 독 (poison)
                if (st.id === 'poison') {
                    // effect: base_damage: 5, incremental_damage: 5
                    const dmg = 5 + (st.value - 1) * 5; // 예: 1중첩 5, 2중첩 10
                    player.hp -= dmg;
                    logs.push(`[${data.name} 틱] ${player.id}가 ${dmg}의 독 피해를 입었습니다.`);
                }
                // 출혈 (bleed)
                else if (st.id === 'bleed') {
                    const dmg = 10 * st.value;
                    player.hp -= dmg;
                    logs.push(`[${data.name} 틱] ${player.id}가 ${dmg}의 출혈 피해를 입었습니다.`);
                }
                // 감전 (electrocute) - on_move 일 때만 호출됨
                else if (st.id === 'electrocute') {
                    const dmg = 10;
                    player.hp -= dmg;
                    logs.push(`[${data.name} 틱] ${player.id}가 이동 중 찌릿하여 ${dmg} 데미지를 입었습니다.`);
                }
            }
        });

        // 지속시간/스택 차감 처리 (on_turn_end 등 특정 시점에 만료되는 것들)
        if (triggerType === 'on_turn_end') {
            player.statuses.forEach(st => {
                const data = getStatusData(st.id);
                if (data?.duration_logic === 'stack_decreases_on_turn_end' || data?.duration_logic === 'stack_decreases_after_damage') {
                    st.value -= 1;
                }
            });
        } else if (triggerType === 'on_move') {
            player.statuses.forEach(st => {
                if (getStatusData(st.id)?.duration_logic === 'stack_decreases_per_move') {
                    st.value -= 1;
                }
            });
        }

        // 0 이하가 된 상태이상 삭제
        player.statuses = player.statuses.filter(st => st.value > 0);
    },

    // 상태이상 조합(Combo) 폭발 체크
    checkCombo: (player: PlayerState, logs: string[]) => {
        if (!player.statuses) return;

        const hasStatus = (id: string) => player.statuses.some(s => s.id === id && s.value > 0);
        const consume = (id: string, amount: number) => {
            const st = player.statuses.find(s => s.id === id);
            if (st) st.value -= amount;
        };

        // 1. Explosion (burn + poison)
        if (hasStatus('burn') && hasStatus('poison')) {
            player.hp -= 30; // fixed_damage 30
            consume('burn', 1);
            consume('poison', 1);
            logs.push(`💥 [콤보 폭발!] ${player.id}의 맹독이 열기에 반응하여 대폭발을 일으켜 30의 체력을 잃었습니다!`);
        }

        // 2. Stun (freeze + electrocute)
        if (hasStatus('freeze') && hasStatus('electrocute')) {
            consume('freeze', 1);
            consume('electrocute', 1);
            StatusEngine.addStatus(player, 'stun', 1, logs);
            logs.push(`⚡ [빙결-감전 콤보!] ${player.id}가 물기에 젖은 채 감전되어 기절(Stun)했습니다!`);
        }

        player.statuses = player.statuses.filter(st => st.value > 0);
    }
};