"use client";

import { Howl } from 'howler';

// 사운드 파일명 매핑 (public/sounds 폴더 내 파일 기준)
const SOUND_FILES = {
    // UI & System
    ui_card_hover: '/sounds/ui_card_hover.mp3',
    ui_card_select: '/sounds/ui_card_select.mp3',
    ui_error: '/sounds/ui_error.mp3',
    ui_button_click: '/sounds/ui_button_click.mp3',
    ui_turn_ready: '/sounds/ui_turn_ready.mp3',
    
    // Phase
    phase_planning: '/sounds/phase_planning.mp3',
    phase_battle: '/sounds/phase_battle.mp3',
    phase_discard: '/sounds/phase_discard.mp3',

    // Action
    action_move: '/sounds/action_move.mp3',
    action_draw: '/sounds/action_draw.mp3',
    action_discard: '/sounds/action_discard.mp3',
    action_rest: '/sounds/action_rest.mp3',

    // Combat
    combat_slash: '/sounds/combat_slash.mp3',
    combat_magic: '/sounds/combat_magic.mp3',
    combat_arrow: '/sounds/combat_arrow.mp3',
    combat_hit: '/sounds/combat_hit.mp3',
    combat_shield_block: '/sounds/combat_shield_block.mp3',
    combat_shield_break: '/sounds/combat_shield_break.mp3',

    // Skill & Element
    skill_fire: '/sounds/skill_fire.mp3',
    skill_ice: '/sounds/skill_ice.mp3',
    skill_poison: '/sounds/skill_poison.mp3',
    skill_heal: '/sounds/skill_heal.mp3',
    skill_buff: '/sounds/skill_buff.mp3',
    skill_debuff: '/sounds/skill_debuff.mp3',
    skill_explosion: '/sounds/skill_explosion.mp3',
    skill_shockwave: '/sounds/skill_shockwave.mp3',

    // Character Specific
    char_skill_cutin: '/sounds/char_skill_cutin.mp3',
    char_warrior_charge: '/sounds/char_warrior_charge.mp3',
    char_jumper_blink: '/sounds/char_jumper_blink.mp3',
    char_prophet_peek: '/sounds/char_prophet_peek.mp3',
    char_prophet_doom: '/sounds/char_prophet_doom.mp3',
    char_esper_psychic: '/sounds/char_esper_psychic.mp3',

    // BGM & Result (💡 로비, 전투 BGM 추가)
    bgm_lobby: '/sounds/bgm_lobby.mp3',
    bgm_battle: '/sounds/bgm_battle.mp3',
    bgm_victory: '/sounds/bgm_victory.mp3',
    bgm_defeat: '/sounds/bgm_defeat.mp3'
};

export type SoundKey = keyof typeof SOUND_FILES;

class SoundManager {
    private sounds: Partial<Record<SoundKey, Howl>> = {};
    private isMuted: boolean = false;
    
    // 💡 BGM 관리를 위한 변수
    private currentBgmKey: SoundKey | null = null;
    private bgmInstance: Howl | null = null;

    public preload() {
        if (typeof window === 'undefined') return;
        Object.entries(SOUND_FILES).forEach(([key, path]) => {
            this.sounds[key as SoundKey] = new Howl({
                src: [path],
                preload: true,
                volume: 0.5
            });
        });
    }

    public play(key: SoundKey, options?: { volume?: number; rate?: number }) {
        if (typeof window === 'undefined' || this.isMuted) return;
        let sound = this.sounds[key];
        if (!sound) {
            sound = new Howl({ src: [SOUND_FILES[key]], volume: 0.5 });
            this.sounds[key] = sound;
        }
        if (options?.volume !== undefined) sound.volume(options.volume);
        if (options?.rate !== undefined) sound.rate(options.rate);
        sound.play();
    }

    // 💡 BGM 전용 재생 함수 (루프 처리 및 기존 BGM 정지)
    public playBGM(key: SoundKey) {
        if (typeof window === 'undefined' || this.isMuted) return;
        
        // 이미 같은 BGM이 재생 중이면 무시
        if (this.currentBgmKey === key && this.bgmInstance?.playing()) return;

        if (this.bgmInstance) {
            this.bgmInstance.stop();
        }

        let sound = this.sounds[key];
        if (!sound) {
            sound = new Howl({ src: [SOUND_FILES[key]], loop: true, volume: 0.3 });
            this.sounds[key] = sound;
        } else {
            sound.loop(true);
            sound.volume(0.3); // BGM은 효과음보다 볼륨을 약간 작게
        }

        this.currentBgmKey = key;
        this.bgmInstance = sound;
        this.bgmInstance.play();
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (typeof window !== 'undefined') {
            const { Howler } = require('howler');
            Howler.mute(this.isMuted);
        }
    }
}

export const SoundEngine = new SoundManager();
