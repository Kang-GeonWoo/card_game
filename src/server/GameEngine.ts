import { GameState, PlayerState, Action, Card, VisualEffect } from '../types';
import { getStatusData, getSkillData, getCardById } from '../engine/dataLoader';
import { randomUUID } from 'crypto';

export class ServerGameEngine {
    private state: GameState;

    constructor() {
        this.state = this.getInitialState();
    }

    private getInitialState(): GameState {
        return {
            status: 'lobby',
            resolvingStep: 0,
            resolvingPhase: 1,
            players: {},
            turnCount: 0,
            logs: [],
            visualEffects: [],
            lastPlayedCard: { player1: null, player2: null },
            activeSkillCutin: null,
            isScreenShaking: false,
            peekingCards: null
        };
    }

    public getState(): GameState {
        return this.state;
    }

    public addPlayer(socketId: string, playerState: PlayerState) {
        this.state.players[socketId] = playerState;
    }

    public removePlayer(socketId: string) {
        delete this.state.players[socketId];
    }

    public getPlayerSockets(): string[] {
        return Object.keys(this.state.players);
    }

    public replacePlayerId(oldId: string, newId: string) {
        if (this.state.players[oldId]) {
            this.state.players[newId] = this.state.players[oldId];
            this.state.players[newId].id = newId;
            delete this.state.players[oldId];
        }
    }

    public initPlayer(socketId: string, charId: string, deckIds: string[], x: number, y: number) {
        // Build actual deck from IDs
        const { AllCards } = require('../engine/dataLoader');
        const deck: Card[] = deckIds.map((origId: string) => {
            const template = AllCards.find((c: Card) => c.id === origId);
            return template ? { ...template, id: randomUUID(), originalId: template.id } : null;
        }).filter(Boolean) as Card[];
        
        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [deck[i], deck[j]] = [deck[j], deck[i]]; 
        }

        const playerState: PlayerState = {
            id: socketId,
            characterId: charId,
            hp: 100, shield: 0, energy: 100,
            position: { x, y },
            drawPile: deck.slice(5),
            hand: deck.slice(0, 5),
            discardPile: [],
            statuses: [],
            skillLevel: 0,
            shuffleCount: 0,
            jumperDamageStack: 0,
            actionQueue: [{ type: 'none' as const }, { type: 'none' as const }, { type: 'none' as const }],
            isReady: false
        };

        this.addPlayer(socketId, playerState);
    }

    public startGame() {
        this.state.status = 'planning';
        this.state.turnCount = 1;
        this.state.logs.push('--- 게임 시작 ---');
        const sockets = this.getPlayerSockets();
        sockets.forEach(id => {
            this.triggerStatus(this.state.players[id], 'on_turn_start');
        });
    }

    public setAction(socketId: string, actionQueue: Action[]) {
        if (this.state.players[socketId]) {
            this.state.players[socketId].actionQueue = actionQueue;
            this.state.players[socketId].isReady = true;
        }
    }

    public isBothReady(): boolean {
        const playerKeys = Object.keys(this.state.players);
        if (playerKeys.length !== 2) return false;
        return playerKeys.every(id => this.state.players[id].isReady);
    }

    // ============================================
    // StatusEngine 로직 이식
    // ============================================
    private addStatus(player: PlayerState, statusId: string, value: number) {
        if (!player.statuses) player.statuses = [];

        // ❄️ Chill -> Freeze 변환 로직
        if (statusId === 'chill') {
            const chillExist = player.statuses.find(s => s.id === 'chill');
            if (chillExist && chillExist.value > 0) {
                player.statuses = player.statuses.filter(s => s.id !== 'chill');
                this.state.logs.push(`   -> ❄️ [추위] 누적으로 [얼음] 상태가 부여되었습니다!`);
                this.addStatus(player, 'freeze', 1);
                return;
            }
        }

        const exist = player.statuses.find(s => s.id === statusId);
        if (exist) {
            exist.value += value;
        } else {
            player.statuses.push({ id: statusId, value });
        }
        const data = getStatusData(statusId);
        this.state.logs.push(`   -> [상태이상] ${player.id}에게 [${data?.name || statusId}] 부여! (수치: ${value})`);
        this.checkCombo(player);
    }

    private getDamageMultiplier(attacker: PlayerState, defender: PlayerState): number {
        let multiplier = 1.0;
        if (attacker.statuses?.find(s => s.id === 'burn')) multiplier *= 0.5;
        if (attacker.statuses?.find(s => s.id === 'strengthen')) multiplier *= 2.0;
        if (defender.statuses?.find(s => s.id === 'vulnerable')) multiplier *= 2.0;
        return multiplier;
    }

    private triggerStatus(player: PlayerState, triggerType: string) {
        if (!player.statuses || player.statuses.length === 0) return;
        player.statuses.forEach(st => {
            const data = getStatusData(st.id);
            if (!data) return;
            if (data.trigger === triggerType) {
                if (st.id === 'poison') {
                    const dmg = 5 + (st.value - 1) * 5;
                    player.hp -= dmg;
                    this.state.logs.push(`[${data.name} 틱] ${player.id}가 ${dmg}의 독 피해를 입었습니다.`);
                }
                else if (st.id === 'bleed') {
                    const dmg = 10 * st.value;
                    player.hp -= dmg;
                    this.state.logs.push(`[${data.name} 틱] ${player.id}가 ${dmg}의 출혈 피해를 입었습니다.`);
                }
                else if (st.id === 'electrocute') {
                    const dmg = 10;
                    player.hp -= dmg;
                    this.state.logs.push(`[${data.name} 틱] ${player.id}가 이동 중 찌릿하여 ${dmg} 데미지를 입었습니다.`);
                }
            }
        });
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
        player.statuses = player.statuses.filter(st => st.value > 0);
    }

    private checkCombo(player: PlayerState) {
        if (!player.statuses) return;
        const hasStatus = (id: string) => player.statuses.some(s => s.id === id && s.value > 0);
        const consume = (id: string, amount: number) => {
            const st = player.statuses.find(s => s.id === id);
            if (st) st.value -= amount;
        };
        if (hasStatus('burn') && hasStatus('poison')) {
            player.hp -= 30;
            consume('burn', 1); consume('poison', 1);
            this.state.logs.push(`💥 [콤보 폭발!] ${player.id}의 맹독이 열기에 반응하여 대폭발을 일으켜 30의 체력을 잃었습니다!`);
        }
        if (hasStatus('freeze') && hasStatus('electrocute')) {
            consume('freeze', 1); consume('electrocute', 1);
            this.addStatus(player, 'stun', 1);
            this.state.logs.push(`⚡ [빙결-감전 콤보!] ${player.id}가 물기에 젖은 채 감전되어 기절(Stun)했습니다!`);
        }
        player.statuses = player.statuses.filter(st => st.value > 0);
    }

    // ============================================
    // SkillEngine 로직 이식
    // ============================================
    private onCollision(p1: PlayerState, p2: PlayerState) {
        [p1, p2].forEach(p => {
            if (p.characterId === 'warrior') {
                const skill = getSkillData('warrior');
                const target = p === p1 ? p2 : p1;
                if (p.position.x === target.position.x && p.position.y === target.position.y) {
                    const levelData = skill?.levels?.[p.skillLevel.toString()];
                    if (levelData && levelData.damage) {
                        target.hp -= levelData.damage;
                        this.state.logs.push(`>> [전사 특성 발동!] ${p.id}의 돌진이 적을 들이받아 ${levelData.damage} 피해!`);
                        this.state.activeSkillCutin = p.characterId;
                    }
                }
            }
        });
    }

    private overrideMove(p: PlayerState, action: Action): Action {
        if (p.characterId === 'jumper' && action.type === 'move' && p.skillLevel >= 1) {
            this.state.logs.push(`>> [점퍼 특성 발동!] ${p.id}가 텔레포트(Blink)로 공간을 도약합니다.`);
            this.state.activeSkillCutin = p.characterId;
        }
        return action;
    }

    private onTurnEndSkill(p: PlayerState) {
        if (p.characterId === 'jumper' && p.skillLevel >= 3) {
            const hasBlink = p.hand.some(c => (c.originalId || c.id) === 'blink');
            if (!hasBlink && p.hand.length < 10) {
                const blinkCard = getCardById('blink');
                if (blinkCard) {
                    p.hand.push({ ...blinkCard, id: randomUUID(), originalId: 'blink' });
                    this.state.logs.push(`>> [점퍼 LV3 패시브] 공간의 파편이 모여 [블링크] 카드가 손에 생성되었습니다.`);
                }
            }
        }
        if (p.characterId === 'prophet') {
            const lv = p.skillLevel;
            if (lv >= 1 && lv <= 3) {
                const targetCardId = `prediction_LV${lv}`;
                const hasCard = p.hand.some(c => (c.originalId || c.id) === targetCardId);
                if (!hasCard && p.hand.length < 10) {
                    const card = getCardById(targetCardId);
                    if (card) {
                        p.hand.push({ ...card, id: randomUUID(), originalId: card.id });
                        this.state.logs.push(`>> [예언가 특성] 덱 순환으로 [${card.name}] 카드를 손패에 얻었습니다.`);
                    }
                }
            }
        }
    }

    private onDrawCard(p: PlayerState, drawnCard: Card): Card {
        const levelData = getSkillData(p.characterId)?.levels?.[p.skillLevel.toString()];

        if (p.characterId === 'esper' && levelData && levelData.transform_rule) {
            if (drawnCard.type === 'attack') {
                let newId = levelData.transform_rule.new_card_id;
                if (newId === 'psychic_blast') newId = 'telekinesis_manipulation';

                const newCard = getCardById(newId);
                if (newCard) {
                    this.state.logs.push(`>> [에스퍼 특성 발동!] 드로우한 공격 카드가 [${newCard.name}](으)로 변환되었습니다!`);
                    this.state.activeSkillCutin = p.characterId;
                    return { ...newCard, id: randomUUID(), originalId: newId };
                }
            }
        }
        return drawnCard;
    }

    private getExtraAttacks(p: PlayerState): { count: number, multiplier: number } {
        if (p.characterId === 'archer') {
            const levelData = getSkillData('archer')?.levels?.[p.skillLevel.toString()];
            if (levelData && levelData.extra_attacks) {
                return { count: levelData.extra_attacks, multiplier: levelData.multiplier ?? 1.0 };
            }
        }
        return { count: 0, multiplier: 1.0 };
    }

    // ============================================
    // Damage 로직 이식
    // ============================================
    private applyDamage(dmg: number, targetP: PlayerState) {
        let actualDmg = dmg;
        if (targetP.shield > 0) {
            if (targetP.shield >= actualDmg) { 
                targetP.shield -= actualDmg; 
                this.state.logs.push(`   -> 🛡️ 방어도가 데미지 흡수!`); 
                actualDmg = 0; 
            }
            else { 
                actualDmg -= targetP.shield; 
                targetP.shield = 0; 
                this.state.logs.push(`   -> 🛡️ 방어도 파괴!`); 
            }
        }
        if (actualDmg > 0) {
            targetP.hp = Math.max(0, targetP.hp - actualDmg);
            this.state.logs.push(`   -> 체력 ${actualDmg} 감소 (남은 체력: ${targetP.hp})`);
        }
    }

    // ============================================
    // 서버용 resolveNextStep 동시성 처리 이식
    // ============================================
    public resolveTurnFull(): GameState[] {
        const snapshots: GameState[] = [];
        console.log(`[ServerGameEngine] 턴 ${this.state.turnCount} 연산 시작`);
        this.state.status = 'resolving';

        const sockets = this.getPlayerSockets();
        const p1Id = sockets[0];
        const p2Id = sockets[1];

        this.state.logs.push(`*** BATTLE PHASE (턴 ${this.state.turnCount}) ***`);
        // Save step 0 initial state (just battle phase log)
        snapshots.push(JSON.parse(JSON.stringify(this.state)));

        for (let actionIndex = 0; actionIndex < 3; actionIndex++) {
            this.state.resolvingStep = actionIndex * 2;
            this.state.visualEffects = [];
            this.state.peekingCards = null;
            this.state.activeSkillCutin = null;
            this.processAction(p1Id, p2Id, actionIndex);
            snapshots.push(JSON.parse(JSON.stringify(this.state)));

            this.state.resolvingStep = actionIndex * 2 + 1;
            this.state.visualEffects = [];
            this.state.peekingCards = null;
            this.state.activeSkillCutin = null;
            this.processAction(p2Id, p1Id, actionIndex);
            snapshots.push(JSON.parse(JSON.stringify(this.state)));
        }

        this.postTurnProcessing(p1Id, p2Id);
        snapshots.push(JSON.parse(JSON.stringify(this.state)));
        
        return snapshots;
    }

    private processAction(currentId: string, enemyId: string, actionIndex: number) {
        const currentPlayer = this.state.players[currentId];
        const enemyPlayer = this.state.players[enemyId];
        const action = currentPlayer.actionQueue[actionIndex];
        
        if (currentPlayer.hp <= 0 || enemyPlayer.hp <= 0) return;

        // Cutin triggers
        if (action && action.type !== 'none') {
            if (action.type === 'move' && currentPlayer.characterId === 'jumper' && currentPlayer.skillLevel >= 1) this.state.activeSkillCutin = currentPlayer.characterId;
            if (action.type === 'draw' && currentPlayer.characterId === 'esper' && currentPlayer.skillLevel >= 1) this.state.activeSkillCutin = currentPlayer.characterId;
            if (action.type === 'play_card' && action.cardInstanceId) {
                const c = currentPlayer.hand.find(card => card.id === action.cardInstanceId);
                if (c && c.type === 'attack' && currentPlayer.characterId === 'archer' && currentPlayer.skillLevel >= 1) this.state.activeSkillCutin = currentPlayer.characterId;
            }
        }

        if (action && action.type !== 'none') {
            let freezeIdx = currentPlayer.statuses?.findIndex((s: any) => s.id === 'freeze');
            if (freezeIdx !== undefined && freezeIdx !== -1 && currentPlayer.statuses[freezeIdx].value > 0) {
                this.state.logs.push(`[Step ${actionIndex + 1}] ❄️ ${currentPlayer.id}: 얼어붙어 행동할 수 없습니다!`);
                currentPlayer.statuses[freezeIdx].value -= 1;
                if (currentPlayer.statuses[freezeIdx].value <= 0) currentPlayer.statuses.splice(freezeIdx, 1);
                return;
            } else if (currentPlayer.statuses?.some((s: any) => s.id === 'stun')) {
                this.state.logs.push(`[Step ${actionIndex + 1}] ${currentPlayer.id}: 상태이상(기절)으로 행동 불가.`); 
                return;
            }

            {
                let actualAction = this.overrideMove(currentPlayer, action);
                if (actualAction.type === 'move') {
                    this.triggerStatus(currentPlayer, 'on_move');
                    const oldX = currentPlayer.position.x; const oldY = currentPlayer.position.y;
                    let newX = actualAction.targetX !== undefined ? actualAction.targetX : oldX + (actualAction.dx || 0);
                    let newY = actualAction.targetY !== undefined ? actualAction.targetY : oldY + (actualAction.dy || 0);
                    
                    if (newX >= 0 && newX <= 2 && newY >= 0 && newY <= 2) {
                        currentPlayer.position.x = newX; currentPlayer.position.y = newY;
                        this.state.logs.push(`[Step ${actionIndex + 1}] ${currentPlayer.id}: (${newX}, ${newY}) 이동`);

                        if (currentPlayer.characterId === 'jumper' && currentPlayer.skillLevel >= 2 && (oldX === newX || oldY === newY)) {
                            let pathHit = false;
                            for (let x = Math.min(oldX, newX); x <= Math.max(oldX, newX); x++) {
                                for (let y = Math.min(oldY, newY); y <= Math.max(oldY, newY); y++) {
                                    this.state.visualEffects.push({ id: randomUUID(), type: 'slash', x, y });
                                    if (x === enemyPlayer.position.x && y === enemyPlayer.position.y) pathHit = true;
                                }
                            }
                            if (pathHit) this.applyDamage(5, enemyPlayer);
                        }
                        this.onCollision(currentPlayer, enemyPlayer);
                    } else { 
                        this.state.logs.push(`[Step ${actionIndex + 1}] 이동 실패.`); 
                    }
                }
                else if (actualAction.type === 'rest') { 
                    currentPlayer.energy = Math.min(100, currentPlayer.energy + 10); 
                    this.state.logs.push(`[Step ${actionIndex + 1}] 기력 10 회복.`); 
                }
                else if (actualAction.type === 'draw') {
                    let drawCount = 1; 
                    const skillData = getSkillData(currentPlayer.characterId)?.levels?.[currentPlayer.skillLevel.toString()];
                    if (skillData && skillData.draw_count_override) {
                        drawCount = skillData.draw_count_override;
                    }
                    let actuallyDrawn = 0;
                    for (let i = 0; i < drawCount; i++) {
                        if (currentPlayer.drawPile.length === 0 && currentPlayer.discardPile.length > 0) {
                            currentPlayer.drawPile = [...currentPlayer.discardPile].map(c => ({ ...c, id: randomUUID(), originalId: c.originalId || c.id }));
                            currentPlayer.discardPile = []; currentPlayer.skillLevel = Math.min(3, currentPlayer.skillLevel + 1);
                            currentPlayer.drawPile.sort(() => Math.random() - 0.5);
                        }
                        if (currentPlayer.drawPile.length > 0) { currentPlayer.hand.push(this.onDrawCard(currentPlayer, currentPlayer.drawPile.shift()!)); actuallyDrawn++; }
                    }
                    this.state.logs.push(`[Step ${actionIndex + 1}] ${currentPlayer.id}: 카드 ${actuallyDrawn}장 드로우.`);
                }
                else if (actualAction.type === 'play_card' && actualAction.cardInstanceId) {
                    this.triggerStatus(currentPlayer, 'on_card_use');
                    const cardIndex = currentPlayer.hand.findIndex(c => c.id === actualAction.cardInstanceId);
                    const isSilenced = (c: Card) => currentPlayer.statuses?.some(s => s.id === 'silence') && (c.type === 'magic' || c.type === 'support');

                    if (cardIndex !== -1) {
                        const card = currentPlayer.hand[cardIndex];
                        const cost = card.cost === 'all_energy' || card.cost === 'all' ? currentPlayer.energy : (typeof card.cost === 'number' ? card.cost : 0);
                        
                        if (currentPlayer.energy < cost) { this.state.logs.push(`[Step ${actionIndex + 1}] 기력 부족.`); }
                        else if (isSilenced(card)) { this.state.logs.push(`[Step ${actionIndex + 1}] 침묵 상태.`); }
                        else {
                            currentPlayer.energy -= cost; currentPlayer.hand.splice(cardIndex, 1);
                            
                            const isDestroyed = card.ability === '파괴' || card.effect?.includes('[파괴]');
                            if (card.priority !== 'passive' && !isDestroyed) {
                                currentPlayer.discardPile.unshift(card);
                            } else if (isDestroyed) {
                                this.state.logs.push(`   -> 💥 [${card.name}] 카드는 1회용으로 파괴되어 소멸했습니다.`);
                            }

                            // Keep track of last played for UI mapping
                            const pid = Object.keys(this.state.players).indexOf(currentId) === 0 ? 'player1' : 'player2';
                            if (pid === 'player1') { this.state.lastPlayedCard.player1 = card; } else { this.state.lastPlayedCard.player2 = card; }
                            
                            this.state.logs.push(`[Step ${actionIndex + 1}] ${currentPlayer.id}: [${card.name}] 사용!!`);

                            const baseCardId = card.originalId || card.id;
                            let damageOverride: number | null = null;

                            if (baseCardId === 'draw' || baseCardId === 'prophecy_orb') {
                                // V3 Data-Driven 전환: processAction의 hardcoded draw 블록은 효과 엔진 루프로 이관되었습니다.
                            }

                            if (baseCardId === 'copy' || baseCardId === 'prediction_LV1' || baseCardId === 'prediction_LV2') {
                                const eHand = [...enemyPlayer.hand];
                                if (eHand.length > 0) {
                                    let tIndex = actualAction.targetCardIndex !== undefined ? actualAction.targetCardIndex : Math.floor(Math.random() * eHand.length);
                                    if (tIndex >= eHand.length) tIndex = 0;
                                    
                                    if (baseCardId === 'copy') {
                                        const originalEffect = eHand[tIndex].effect || '';
                                        const newEffect = originalEffect.startsWith('[파괴]') ? originalEffect : `[파괴][0코스트] ${originalEffect}`;
                                        const copiedCard = { ...eHand[tIndex], id: randomUUID(), ability: '파괴', cost: 0, effect: newEffect };
                                        currentPlayer.hand.push(copiedCard);
                                        this.state.logs.push(`   -> 적의 패에서 [${copiedCard.name}] 카드를 복제해왔습니다! (사용 후 파괴)`);
                                    } 
                                    else if (baseCardId === 'prediction_LV1') {
                                        this.state.peekingCards = [eHand[tIndex]];
                                        this.state.logs.push(`   -> 예언 LV1: 상대의 패 1장을 스캔합니다!`);
                                    }
                                    else if (baseCardId === 'prediction_LV2') {
                                        if (eHand.length === 1) {
                                            this.state.peekingCards = [eHand[0]];
                                            this.state.logs.push(`   -> 상대의 패가 1장뿐이라 1장만 스캔합니다!`);
                                        } else {
                                            const peek1 = eHand[tIndex];
                                            let peek2 = eHand[Math.floor(Math.random() * eHand.length)];
                                            while(peek1.id === peek2.id) { peek2 = eHand[Math.floor(Math.random() * eHand.length)]; }
                                            this.state.peekingCards = [peek1, peek2];
                                            this.state.logs.push(`   -> 예언 LV2: 상대의 패 2장을 스캔합니다!`);
                                        }
                                    }
                                } else this.state.logs.push(`   -> 상대의 패가 비어있습니다.`);
                            } else if (baseCardId === 'prediction_LV3') {
                                this.applyDamage(999, enemyPlayer);
                                this.state.logs.push(`   -> 💀 예언 LV3 발동: 죽음의 예언이 시작되었습니다!`);
                            }

                            if (['poison_arrow', 'fire_arrow', 'ice_arrow'].includes(baseCardId)) {
                                currentPlayer.statuses = currentPlayer.statuses.filter(s => !['weapon_poison', 'weapon_fire', 'weapon_ice', 'weapon_bonus'].includes(s.id));
                                if (baseCardId === 'poison_arrow') this.addStatus(currentPlayer, 'weapon_poison', 1);
                                else if (baseCardId === 'fire_arrow') this.addStatus(currentPlayer, 'weapon_fire', 1);
                                else if (baseCardId === 'ice_arrow') this.addStatus(currentPlayer, 'weapon_ice', 1);
                                this.addStatus(currentPlayer, 'weapon_bonus', 1);
                                this.state.visualEffects.push({ id: randomUUID(), type: 'buff', x: currentPlayer.position.x, y: currentPlayer.position.y });
                            }

                            if (baseCardId === 'mana_burst') { damageOverride = Math.trunc(cost / 2); currentPlayer.energy = 0; }
                            
                            // V3 Data-Driven 전환: 공용 보조/마법 카드(heal, purify, shield, 독침, 불장난 등)의 하드코딩된 로직은 
                            // 모두 effects 배열 처리기로 이전되었습니다.

                            let tx = actualAction.targetX ?? enemyPlayer.position.x; let ty = actualAction.targetY ?? enemyPlayer.position.y;
                            
                            if (baseCardId === 'charge') {
                                const px = currentPlayer.position.x; const py = currentPlayer.position.y;
                                let nx = px; let ny = py;
                                if (Math.abs(tx - px) > Math.abs(ty - py)) nx = tx > px ? 2 : 0; else ny = ty > py ? 2 : 0;
                                let chargeHit = false;
                                for (let x = Math.min(px, nx); x <= Math.max(px, nx); x++) {
                                    for (let y = Math.min(py, ny); y <= Math.max(py, ny); y++) {
                                        this.state.visualEffects.push({ id: randomUUID(), type: 'slash', x, y });
                                        if (x === enemyPlayer.position.x && y === enemyPlayer.position.y) chargeHit = true;
                                    }
                                }
                                if (chargeHit) this.applyDamage(20, enemyPlayer);
                                currentPlayer.position.x = nx; currentPlayer.position.y = ny; tx = nx; ty = ny;
                            }

                            // V2 原본 호환: card.effects 배열 기반 연동
                            const skillMultiplier = 1 + (currentPlayer.skillLevel * 0.1);

                            // 방어카드나 힐 카드는 타겟팅 검사가 필요 없음
                            let isValidHit = true;
                            const hasDamage = (card.effects && card.effects.some(eff => eff.type === 'damage')) || card.damage !== undefined || damageOverride !== null;

                            if (hasDamage) {
                                const isGlobalOrArea = (card.targeting && (card.targeting.aoe >= 99 || card.targeting.type === 'global')) || baseCardId === 'telekinesis_manipulation';
                                if (!isGlobalOrArea && actualAction.targetX !== undefined && actualAction.targetY !== undefined) {
                                    if (enemyPlayer.position.x !== actualAction.targetX || enemyPlayer.position.y !== actualAction.targetY) {
                                        this.state.logs.push(`   -> 상대방이 해당 자리를 벗어나 빗나갔습니다! (Miss)`);
                                        isValidHit = false;
                                    }
                                }
                            }

                            if (baseCardId === 'telekinesis_manipulation' || (card.targeting && card.targeting.aoe >= 99)) {
                                isValidHit = true;
                            }
                            if (baseCardId === 'telekinesis_manipulation') {
                                damageOverride = 10;
                            }

                            if (isValidHit) {
                                let processedDamage = false;

                                // 1. effects 배열 우선 처리
                                if (card.effects) {
                                card.effects.forEach(eff => {
                                    if (eff.type === 'damage') {
                                        // V3 확장에 맞춤형 데미지 연산 체인 포함 (기본 데미지 + 스킬 랭크 적용)
                                        const extra = card.type === 'attack' ? this.getExtraAttacks(currentPlayer) : { count: 0, multiplier: 1.0 };
                                        const totalHits = 1 + extra.count;
                                        const statusMult = this.getDamageMultiplier(currentPlayer, enemyPlayer);

                                        for (let hit = 0; hit < totalHits; hit++) {
                                            const hitMult = statusMult * (hit > 0 ? extra.multiplier : 1.0);
                                            let baseDmg = Math.floor((eff.value || 0) * skillMultiplier);
                                            
                                            if (baseCardId === 'shockwave' || baseCardId === 'stone_throw') {
                                                const dist = Math.abs(currentPlayer.position.x - enemyPlayer.position.x) + Math.abs(currentPlayer.position.y - enemyPlayer.position.y);
                                                baseDmg = dist === 0 ? 20 : (dist === 1 ? 10 : 5);
                                            }
                                            if (baseCardId === 'weakness_strike' || baseCardId === 'wide_strike') {
                                                baseDmg = Math.pow(2, currentPlayer.jumperDamageStack); currentPlayer.jumperDamageStack++;
                                            }
                                            if (damageOverride !== null) baseDmg = damageOverride;

                                            let finalDmg = Math.trunc(baseDmg * hitMult);

                                            // 적 패에 블링크 존재 시 회피 로직
                                            const blinkIdx = enemyPlayer.hand.findIndex((c: any) => (c.originalId || c.id) === 'blink');
                                            if (blinkIdx !== -1) { 
                                                enemyPlayer.hand.splice(blinkIdx, 1); finalDmg = 0; this.state.logs.push(`   -> 적의 [블링크] 회피!`); 
                                                this.state.visualEffects.push({ id: randomUUID(), type: 'shield', x: enemyPlayer.position.x, y: enemyPlayer.position.y }); 
                                                continue; 
                                            }

                                            if (totalHits > 1) { this.state.logs.push(`   -> [${hit + 1}타]`); }
                                            
                                            // 데미지 적용
                                            this.applyDamage(finalDmg, enemyPlayer);
                                            
                                            // 무기 속성 (독화살 등 버프)
                                            if (['arrow', 'arrow_rain'].includes(baseCardId)) {
                                                const bonusIdx = currentPlayer.statuses.findIndex(s => s.id === 'weapon_bonus');
                                                if (bonusIdx !== -1 && hit === 0) { this.applyDamage(10, enemyPlayer); currentPlayer.statuses.splice(bonusIdx, 1); this.state.logs.push(`   -> [속성 강화 첫타 보너스 +10]`); }
                                                if (currentPlayer.statuses.some(s => s.id === 'weapon_poison')) this.addStatus(enemyPlayer, 'poison', 1);
                                                if (currentPlayer.statuses.some(s => s.id === 'weapon_fire')) this.addStatus(enemyPlayer, 'burn', 1);
                                                if (currentPlayer.statuses.some(s => s.id === 'weapon_ice')) this.addStatus(enemyPlayer, 'chill', 1);
                                            }

                                            this.triggerStatus(currentPlayer, 'on_deal_damage'); this.triggerStatus(enemyPlayer, 'on_take_damage');

                                            // 이펙트 렌더링
                                            if (baseCardId === 'arrow_rain' || baseCardId === 'shockwave' || baseCardId === 'magnetic_control' || baseCardId === 'wide_strike' || baseCardId === 'mana_burst') { 
                                                this.state.isScreenShaking = true; 
                                                this.state.visualEffects.push({ id: randomUUID(), type: 'explosion', x: enemyPlayer.position.x, y: enemyPlayer.position.y }); 
                                            } else { 
                                                this.state.visualEffects.push({ id: randomUUID(), type: 'projectile', x: enemyPlayer.position.x, y: enemyPlayer.position.y, sourceX: currentPlayer.position.x, sourceY: currentPlayer.position.y } as any); 
                                                this.state.visualEffects.push({ id: randomUUID(), type: card.type === 'attack' ? 'slash' : 'magic', x: enemyPlayer.position.x, y: enemyPlayer.position.y }); 
                                            }
                                        }

                                    } else if (eff.type === 'heal') {
                                        const healAmount = Math.floor((eff.value || 0) * skillMultiplier);
                                        currentPlayer.hp = Math.min(100, currentPlayer.hp + healAmount);
                                        this.state.logs.push(`   -> 체력 ${healAmount} 회복!`);
                                        this.state.visualEffects.push({ id: randomUUID(), type: 'buff', x: currentPlayer.position.x, y: currentPlayer.position.y });
                                    } else if (eff.type === 'add_status' && eff.statusId) {
                                        const originP = eff.target === 'self' ? currentPlayer : enemyPlayer;
                                        this.addStatus(originP, eff.statusId, eff.value || 1);
                                        // 비례식 상태이상(마법 등) 이펙트가 데미지가 없는 경우에도 추가
                                        if (!card.effects?.some(e => e.type === 'damage')) {
                                            this.state.visualEffects.push({ id: randomUUID(), type: 'magic', x: enemyPlayer.position.x, y: enemyPlayer.position.y });
                                        }
                                    } else if (eff.type === 'restore_energy') {
                                        currentPlayer.energy = Math.min(100, currentPlayer.energy + (eff.value || 0));
                                        this.state.logs.push(`   -> 기력 ${eff.value || 0} 회복!`);
                                        this.state.visualEffects.push({ id: randomUUID(), type: 'buff', x: currentPlayer.position.x, y: currentPlayer.position.y });
                                    } else if (eff.type === 'purify') {
                                        currentPlayer.statuses = [];
                                        this.state.logs.push(`   -> 모든 상태이상을 정화했습니다.`);
                                        this.state.visualEffects.push({ id: randomUUID(), type: 'buff', x: currentPlayer.position.x, y: currentPlayer.position.y });
                                    } else if (eff.type === 'add_shield') {
                                        currentPlayer.shield += (eff.value || 0);
                                        if ((eff.value || 0) > 100) this.state.logs.push(`   -> 이번 턴 모든 데미지를 방어합니다! (방어도 지속)`);
                                        else this.state.logs.push(`   -> 방패 발동! 방어도가 ${eff.value || 0} 증가합니다.`);
                                        this.state.visualEffects.push({ id: randomUUID(), type: 'buff', x: currentPlayer.position.x, y: currentPlayer.position.y });
                                    } else if (eff.type === 'draw') {
                                        let actuallyDrawn = 0;
                                        for (let i = 0; i < (eff.value || 1); i++) { 
                                            if (currentPlayer.drawPile.length === 0 && currentPlayer.discardPile.length > 0) {
                                                currentPlayer.drawPile = [...currentPlayer.discardPile].map((c: any) => ({ ...c, id: randomUUID(), originalId: c.originalId || c.id }));
                                                currentPlayer.discardPile = []; currentPlayer.skillLevel = Math.min(3, currentPlayer.skillLevel + 1);
                                                currentPlayer.drawPile.sort(() => Math.random() - 0.5);
                                                this.state.logs.push(`   -> 덱이 부족하여 버린 카드를 셔플합니다!`);
                                            }
                                            if (currentPlayer.drawPile.length > 0) {
                                                currentPlayer.hand.push(currentPlayer.drawPile.shift()!);
                                                actuallyDrawn++;
                                            }
                                        } 
                                        this.state.logs.push(`   -> 덱에서 카드 ${actuallyDrawn}장을 뽑았습니다.`);
                                    }
                                });
                                }

                                // 2. effects 배열에 damage 블록이 없거나 effects 배열 자체가 없지만 card.damage가 있는 기본 공격 카드 로직 복구
                                if (!processedDamage && (card.damage !== undefined || damageOverride !== null)) {
                                    const extra = card.type === 'attack' ? this.getExtraAttacks(currentPlayer) : { count: 0, multiplier: 1.0 };
                                    const totalHits = 1 + extra.count;
                                    const statusMult = this.getDamageMultiplier(currentPlayer, enemyPlayer);

                                    for (let hit = 0; hit < totalHits; hit++) {
                                        const hitMult = statusMult * (hit > 0 ? extra.multiplier : 1.0);
                                        let baseDmg = Math.floor((Number(card.damage) || 0) * skillMultiplier);
                                        
                                        if (baseCardId === 'shockwave' || baseCardId === 'stone_throw') {
                                            const dist = Math.abs(currentPlayer.position.x - enemyPlayer.position.x) + Math.abs(currentPlayer.position.y - enemyPlayer.position.y);
                                            baseDmg = dist === 0 ? 20 : (dist === 1 ? 10 : 5);
                                        }
                                        if (baseCardId === 'weakness_strike' || baseCardId === 'wide_strike') {
                                            baseDmg = Math.pow(2, currentPlayer.jumperDamageStack); currentPlayer.jumperDamageStack++;
                                        }
                                        if (damageOverride !== null) baseDmg = damageOverride;

                                        let finalDmg = Math.trunc(baseDmg * hitMult);

                                        // 적 패에 블링크 존재 시 회피 로직
                                        const blinkIdx = enemyPlayer.hand.findIndex((c: any) => (c.originalId || c.id) === 'blink');
                                        if (blinkIdx !== -1) { 
                                            enemyPlayer.hand.splice(blinkIdx, 1); finalDmg = 0; this.state.logs.push(`   -> 적의 [블링크] 회피!`); 
                                            this.state.visualEffects.push({ id: randomUUID(), type: 'shield', x: enemyPlayer.position.x, y: enemyPlayer.position.y }); 
                                            continue; 
                                        }

                                        if (totalHits > 1) { this.state.logs.push(`   -> [${hit + 1}타]`); }
                                        
                                        // 데미지 적용
                                        this.applyDamage(finalDmg, enemyPlayer);
                                        
                                        // 무기 속성 (독화살 등 버프)
                                        if (['arrow', 'arrow_rain'].includes(baseCardId)) {
                                            const bonusIdx = currentPlayer.statuses.findIndex(s => s.id === 'weapon_bonus');
                                            if (bonusIdx !== -1 && hit === 0) { this.applyDamage(10, enemyPlayer); currentPlayer.statuses.splice(bonusIdx, 1); this.state.logs.push(`   -> [속성 강화 첫타 보너스 +10]`); }
                                            if (currentPlayer.statuses.some(s => s.id === 'weapon_poison')) this.addStatus(enemyPlayer, 'poison', 1);
                                            if (currentPlayer.statuses.some(s => s.id === 'weapon_fire')) this.addStatus(enemyPlayer, 'burn', 1);
                                            if (currentPlayer.statuses.some(s => s.id === 'weapon_ice')) this.addStatus(enemyPlayer, 'chill', 1);
                                        }

                                        this.triggerStatus(currentPlayer, 'on_deal_damage'); this.triggerStatus(enemyPlayer, 'on_take_damage');

                                        // 이펙트 렌더링
                                        if (baseCardId === 'arrow_rain' || baseCardId === 'shockwave' || baseCardId === 'magnetic_control' || baseCardId === 'wide_strike' || baseCardId === 'mana_burst') { 
                                            this.state.isScreenShaking = true; 
                                            this.state.visualEffects.push({ id: randomUUID(), type: 'explosion', x: enemyPlayer.position.x, y: enemyPlayer.position.y }); 
                                        } else { 
                                            this.state.visualEffects.push({ id: randomUUID(), type: 'projectile', x: enemyPlayer.position.x, y: enemyPlayer.position.y, sourceX: currentPlayer.position.x, sourceY: currentPlayer.position.y } as any); 
                                            this.state.visualEffects.push({ id: randomUUID(), type: card.type === 'attack' ? 'slash' : 'magic', x: enemyPlayer.position.x, y: enemyPlayer.position.y }); 
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else this.state.logs.push(`[Step ${actionIndex + 1}] 행동 없음.`);
    }

    private postTurnProcessing(p1Id: string, p2Id: string) {
        this.state.visualEffects = [];
        this.state.activeSkillCutin = null;
        this.state.isScreenShaking = false;

        const p1 = this.state.players[p1Id];
        const p2 = this.state.players[p2Id];

        if (p1.hp <= 0 || p2.hp <= 0) {
            this.state.status = 'game_over';
            return;
        }

        p1.actionQueue = [{ type: 'none' }, { type: 'none' }, { type: 'none' }]; 
        p2.actionQueue = [{ type: 'none' }, { type: 'none' }, { type: 'none' }];
        p1.isReady = false; p2.isReady = false;
        
        this.triggerStatus(p1, 'on_turn_end'); this.triggerStatus(p2, 'on_turn_end');
        this.onTurnEndSkill(p1); this.onTurnEndSkill(p2);
        
        let p1Status = p1.hand.length > 10 ? 'discarding' : 'planning';
        let p2Status = p2.hand.length > 10 ? 'discarding' : 'planning';

        if (p1Status === 'discarding' || p2Status === 'discarding') {
            this.state.status = 'discarding';
        } else {
            this.state.status = 'planning';
            this.state.turnCount++;
            this.state.logs.push(``, `--- 턴 ${this.state.turnCount} ---`);
        }
    }

    public discardCard(socketId: string, cardInstanceId: string): boolean {
        if (this.state.status !== 'discarding') return false;
        const player = this.state.players[socketId];
        if (!player) return false;

        const idx = player.hand.findIndex(c => c.id === cardInstanceId);
        if (idx !== -1) {
            const removed = player.hand.splice(idx, 1)[0];
            player.discardPile.push(removed);
            this.state.logs.push(`[시스템] ${player.characterId || '플레이어'}가 카드를 1장 버렸습니다.`);
        }

        // Check if all players have <= 10 cards to end discarding phase
        const allReady = Object.values(this.state.players).every(p => p.hand.length <= 10);
        if (allReady) {
            this.state.status = 'planning';
            this.state.turnCount++;
            this.state.logs.push(``, `--- 턴 ${this.state.turnCount} ---`);
        }
        return true;
    }
}
