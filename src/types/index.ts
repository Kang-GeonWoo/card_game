// =========== 데이터 구조 (Data Layer) ===========

export type CardType = 'attack' | 'support' | 'defense' | 'magic';
export type CardPriority = 'highest' | 'normal' | 'lowest' | 'passive';

export interface CardUI {
  frame: string;
  illustration: string;
  cost_icon: string;
}

export type TargetType = 'enemy' | 'self' | 'all_enemies' | 'all_allies';
export type EffectTrigger = 'turn_start' | 'turn_end' | 'on_attack' | 'on_hit' | 'immediate';

export interface CardEffect {
  type: 'damage' | 'heal' | 'add_status' | 'draw' | 'restore_energy' | 'purify' | 'add_shield';
  value?: number;
  target?: TargetType;
  statusId?: string;
  trigger?: EffectTrigger;
}

export type TargetingType = 'none' | 'global' | 'tile' | 'line' | 'area_4' | 'hand' | 'anywhere';

export interface Targeting {
  type: TargetingType;
  cast_range: number;
  aoe: number;
}

export interface Card {
  id: string;              
  originalId?: string;    
  name: string;
  type: CardType;
  scope: string;          
  ability?: string;       // 💡 [파괴] 등의 특수 능력을 담을 속성 추가
  cost: number | "all" | "all_energy" | null;  
  targeting: Targeting;   
  damage: number | string | null;       
  effect: string | null;                
  effects?: CardEffect[];              
  logic_detail?: string;  
  priority?: CardPriority;
  max_count?: number;      
  deck_allowed?: boolean; 
  shared_power_group?: string; 
  description?: string;
  ui: CardUI;
}

export interface CharacterSkillLevel {
  damage?: number;
  multiplier?: number;
  extra_attacks?: number;
  trigger?: string;
  limit?: string;
  note?: string;
  draw_count_override?: number;
  replace_action?: string;
  move_type?: string;
  range?: string;
  path_damage?: number;
  gain_card_per_turn?: string;
  effect?: string;
  count?: number;
  transform_rule?: {
    target_type: string;
    new_card_id: string;
  };
  new_card_effect?: {
    range: string;
    damage: number;
  };
}

export interface CharacterSkill {
  class_name: string;
  skill_id: string;
  skill_name: string;
  levels: Record<string, CharacterSkillLevel>;
}

export interface StatusData {
  name: string;
  trigger: string;
  effect: string;
  duration_logic: string;
  reset_logic?: string;
}

// =========== 게임 상태 (Game State) ===========

export interface Position {
  x: number; 
  y: number; 
}

export interface PlayerStatus {
  id: string; 
  value: number;
}

export type ActionType = 'move' | 'play_card' | 'draw' | 'rest' | 'none';

export interface Action {
  type: ActionType;
  cardInstanceId?: string; 
  targetId?: string;        
  dx?: number;              
  dy?: number;              
  targetX?: number;        
  targetY?: number; 
  targetCardIndex?: number;
}

export interface PlayerState {
  id: string; 
  characterId: string;
  hp: number;
  shield: number;  
  energy: number;
  position: Position;
  drawPile: Card[];
  hand: Card[];
  discardPile: Card[];
  statuses: PlayerStatus[];
  skillLevel: number; 
  shuffleCount: number; 
  jumperDamageStack: number;

  actionQueue: Action[]; 
  isReady: boolean;      
}

export interface GameState {
  status: 'lobby' | 'planning' | 'resolving' | 'discarding' | 'game_over';
  resolvingStep: number; 
  resolvingPhase: number; 
  players: { [id: string]: PlayerState };
  turnCount: number;
  logs: string[];
  visualEffects: VisualEffect[];
  lastPlayedCard: { player1: Card | null; player2: Card | null };
  activeSkillCutin: string | null;
  isScreenShaking: boolean; 
  peekingCards: Card[] | null; 
}

export interface VisualEffect {
  id: string; 
  type: 'slash' | 'explosion' | 'heal' | 'crack' | 'impact_ring' | 'magic' | 'buff' | 'shield' | 'hit' | 'projectile'; 
  x: number;
  y: number;
  sourceX?: number;
  sourceY?: number;
}