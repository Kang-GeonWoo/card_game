# 전체 게임 코드 (생략 없이 전부)

> 생성일시: 2026. 3. 12. 오전 11:09:52

> 총 파일 수: 49개

---

## .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

---

## data/cards.json

```json
{
  "cards": [
    {
      "id": "defense",
      "name": "방어",
      "type": "support",
      "scope": "common",
      "cost": 0,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 이번 턴 동안 받는 모든 피해를 무효화합니다.",
      "logic_detail": "시스템 최우선 순위로 발동. 해당 턴 내 모든 피격 데미지 0 처리.",
      "priority": 2,
      "max_count": 3,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "defense.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "add_shield",
          "value": 999
        }
      ]
    },
    {
      "id": "purify",
      "name": "정화",
      "type": "support",
      "scope": "common",
      "cost": 50,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 시전자에게 걸린 모든 상태이상을 해제합니다.",
      "logic_detail": "시스템 최하위 순위로 발동. 시전자의 모든 디버프 배열 초기화.",
      "priority": -2,
      "max_count": 2,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "purify.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "purify"
        }
      ]
    },
    {
      "id": "heal",
      "name": "치료",
      "type": "support",
      "scope": "common",
      "cost": 10,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 시전자의 체력을 10 회복합니다.",
      "logic_detail": "시전자 현재 HP에 +10 처리.",
      "priority": 0,
      "max_count": 1,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "heal.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "heal",
          "value": 20
        }
      ]
    },
    {
      "id": "shield",
      "name": "방패",
      "type": "support",
      "scope": "common",
      "cost": 20,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 방어도를 5 얻습니다. 방어도는 체력보다 먼저 깎입니다.",
      "logic_detail": "방어도 5 추가. 데미지 계산 시 HP보다 우선 소모.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "shield.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "add_shield",
          "value": 5
        }
      ]
    },
    {
      "id": "meditation",
      "name": "명상",
      "type": "support",
      "scope": "common",
      "cost": 0,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 기력을 30 회복합니다.",
      "logic_detail": "시전자 현재 기력에 +30 추가.",
      "priority": 0,
      "max_count": 2,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "meditation.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "restore_energy",
          "value": 30
        }
      ]
    },
    {
      "id": "draw",
      "name": "드로우",
      "type": "support",
      "scope": "common",
      "cost": 20,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 카드 2장을 덱에서 뽑습니다.",
      "logic_detail": "덱에서 상위 2장의 카드를 핸드로 이동.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "draw.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "draw",
          "value": 2
        }
      ]
    },
    {
      "id": "poison_cloud",
      "name": "독구름",
      "type": "magic",
      "scope": "common",
      "cost": 30,
      "damage": null,
      "targeting": {
        "type": "global",
        "cast_range": 99,
        "aoe": 99
      },
      "effect": "[전체 공격]\n효과: 적 전체에게 독 중첩을 1스택 쌓습니다.",
      "logic_detail": "모든 상대 타겟의 상태이상 리스트에 '독' 추가.",
      "priority": 0,
      "max_count": 2,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "poison_cloud.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "add_status",
          "statusId": "poison",
          "value": 1
        }
      ]
    },
    {
      "id": "fire_play",
      "name": "불장난",
      "type": "magic",
      "scope": "common",
      "cost": 30,
      "damage": null,
      "targeting": {
        "type": "global",
        "cast_range": 99,
        "aoe": 99
      },
      "effect": "[전체 공격]\n효과: 적 전체에게 화상 중첩을 1스택 쌓습니다.",
      "logic_detail": "모든 상대 타겟의 상태이상 리스트에 '화상' 추가.",
      "priority": 0,
      "max_count": 2,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "fire_play.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "add_status",
          "statusId": "burn",
          "value": 1
        }
      ]
    },
    {
      "id": "ice_fog",
      "name": "얼음안개",
      "type": "magic",
      "scope": "common",
      "cost": 30,
      "damage": null,
      "targeting": {
        "type": "global",
        "cast_range": 99,
        "aoe": 99
      },
      "effect": "[전체 공격]\n효과: 적 전체에게 빙결(얼음) 중첩을 1스택 쌓습니다.",
      "logic_detail": "모든 상대 타겟의 상태이상 리스트에 '얼음' 추가.",
      "priority": 0,
      "max_count": 2,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "ice_fog.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "add_status",
          "statusId": "chill",
          "value": 1
        }
      ]
    },
    {
      "id": "poison_needle",
      "name": "독침",
      "type": "magic",
      "scope": "common",
      "cost": 10,
      "damage": 5,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 5\n효과: 명중 시 상대에게 독 중첩을 1스택 부여합니다.",
      "logic_detail": "지정한 타일에 5 데미지 및 '독' 1중첩 부여.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "poison_needle.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "damage",
          "value": 5
        },
        {
          "type": "add_status",
          "statusId": "poison",
          "value": 1
        }
      ]
    },
    {
      "id": "fire_needle",
      "name": "불침",
      "type": "magic",
      "scope": "common",
      "cost": 10,
      "damage": 5,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 5\n효과: 명중 시 상대에게 화상 중첩을 1스택 부여합니다.",
      "logic_detail": "지정한 타일에 5 데미지 및 '화상' 1중첩 부여.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "fire_needle.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "damage",
          "value": 5
        },
        {
          "type": "add_status",
          "statusId": "burn",
          "value": 1
        }
      ]
    },
    {
      "id": "ice_needle",
      "name": "얼음침",
      "type": "magic",
      "scope": "common",
      "cost": 10,
      "damage": 5,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 5\n효과: 명중 시 상대에게 빙결(얼음) 중첩을 1스택 부여합니다.",
      "logic_detail": "지정한 타일에 5 데미지 및 '얼음' 1중첩 부여.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "ice_needle.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "damage",
          "value": 5
        },
        {
          "type": "add_status",
          "statusId": "chill",
          "value": 1
        }
      ]
    },
    {
      "id": "stone_throw",
      "name": "짱돌던지기",
      "type": "attack",
      "scope": "warrior",
      "cost": 20,
      "damage": 20,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 최대 20\n효과: 상대방과의 거리에 따라 데미지가 50%씩 감소합니다.",
      "logic_detail": "지정한 1칸 범위에 물리 데미지 적용 (거리비례).",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "attack_frame.jpg",
        "illustration": "stone_throw.jpg",
        "cost_icon": "attack_frame_cost_circle.jpg"
      }
    },
    {
      "id": "shockwave",
      "name": "충격파",
      "type": "attack",
      "scope": "warrior",
      "cost": 40,
      "damage": 20,
      "targeting": {
        "type": "global",
        "cast_range": 99,
        "aoe": 99
      },
      "effect": "[전체 공격] 최대 데미지: 20\n효과: 상대방과의 거리에 따라 데미지가 50%씩 감소합니다. (같은 타일 20, 1칸 거리 10, 그 이상 5 데미지)",
      "logic_detail": "전체 맵 공격. 거리에 따라 데미지 감소.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "attack_frame.jpg",
        "illustration": "shockwave.jpg",
        "cost_icon": "attack_frame_cost_circle.jpg"
      }
    },
    {
      "id": "strong_punch",
      "name": "강펀치",
      "type": "attack",
      "scope": "warrior",
      "cost": 0,
      "damage": 30,
      "targeting": {
        "type": "tile",
        "cast_range": 1,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 30\n효과: 가한 피해량만큼 즉시 기력을 회복합니다. (사거리 1칸)",
      "logic_detail": "주변 1칸 내 공격. 적중 시 가한 피해만큼 기력 회복.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "attack_frame.jpg",
        "illustration": "strong_punch.jpg",
        "cost_icon": "attack_frame_cost_circle.jpg"
      }
    },
    {
      "id": "charge",
      "name": "돌진",
      "type": "support",
      "scope": "warrior",
      "cost": 20,
      "damage": 20,
      "targeting": {
        "type": "line",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 20\n효과: 타겟팅한 일직선 타일 끝까지 강제로 내달리며, 궤적 상의 적에게 피해를 입힙니다.",
      "logic_detail": "직선 끝까지 이동하며 경로상 적에게 20 데미지.",
      "priority": 0,
      "max_count": 1,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "charge.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      }
    },
    {
      "id": "telekinesis",
      "name": "염동력",
      "type": "attack",
      "scope": "esper",
      "cost": 10,
      "damage": 10,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 10\n효과: 지정한 1칸 범위에 마법 피해를 줍니다.",
      "logic_detail": "지정한 1칸에 10의 마법 데미지.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "telekinesis.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      }
    },
    {
      "id": "psyonic_force",
      "name": "초염력",
      "type": "attack",
      "scope": "esper",
      "cost": 30,
      "damage": 10,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 1
      },
      "effect": "[범위 공격] 데미지: 10\n효과: 지정한 타일 및 맞닿은 주변 십자 범위에 마법 데미지를 줍니다.",
      "logic_detail": "선택 타일 및 주변 십자 범위에 10 데미지.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "psyonic_force.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      }
    },
    {
      "id": "magnetic_control",
      "name": "자기장조작",
      "type": "attack",
      "scope": "esper",
      "cost": 10,
      "damage": 10,
      "targeting": {
        "type": "global",
        "cast_range": 99,
        "aoe": 99
      },
      "effect": "[전체 공격] 데미지: 10\n효과: 적군 전원 및 자기 자신에게도 피해를 줍니다.",
      "logic_detail": "전체 적과 시전자 본인에게 10 데미지.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "magnetic_control.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      }
    },
    {
      "id": "mana_burst",
      "name": "마나 폭발",
      "type": "magic",
      "scope": "esper",
      "cost": "all_energy",
      "damage": null,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 보유 기력의 50%\n효과: 모든 기력을 소모하여 단일 타겟에게 폭발적인 마법 데미지를 입힙니다.",
      "logic_detail": "기력을 0으로 초기화하고 소모량의 절반만큼 전체 피해.",
      "priority": 0,
      "max_count": 1,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "mana_burst.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      }
    },
    {
      "id": "telekinesis_manipulation",
      "name": "염력조작",
      "type": "attack",
      "scope": "esper",
      "cost": 0,
      "damage": 10,
      "targeting": {
        "type": "global",
        "cast_range": 99,
        "aoe": 99
      },
      "effect": "[전체 공격] 데미지: 10\n효과: 게임 맵 전체 범위에 강력한 염력을 방출해 데미지를 줍니다.",
      "logic_detail": "게임판 전체에 10의 데미지",
      "priority": 0,
      "max_count": 0,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "esper_skill.png",
        "cost_icon": "magic_frame_cost_circle.jpg"
      }
    },
    {
      "id": "arrow",
      "name": "화살",
      "type": "attack",
      "scope": "archer",
      "cost": 0,
      "damage": 10,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 10\n효과: 현재 자신의 무기 속성에 따라 공격 부가효과가 달라집니다. (속성이 전환된 직후 첫 공격은 10 추가 뎀)",
      "logic_detail": "기본 10 데미지. 무기 속성에 따른 추가 효과 적용.",
      "priority": 0,
      "max_count": 5,
      "ui": {
        "frame": "attack_frame.jpg",
        "illustration": "arrow.jpg",
        "cost_icon": "attack_frame_cost_circle.jpg"
      }
    },
    {
      "id": "poison_arrow",
      "name": "독화살",
      "type": "support",
      "scope": "archer",
      "cost": 20,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 자신의 활(무기)에 독 속성을 영구 부여합니다. 이 속성은 다른 속성으로 덮어쓸 수 있습니다.",
      "logic_detail": "시전자에게 '독 속성 무기' 버프 추가.",
      "priority": 0,
      "max_count": 2,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "poison_arrow.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      }
    },
    {
      "id": "fire_arrow",
      "name": "불화살",
      "type": "support",
      "scope": "archer",
      "cost": 20,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 자신의 활(무기)에 불꽃 속성을 영구 부여합니다. 이 속성은 다른 속성으로 덮어쓸 수 있습니다.",
      "logic_detail": "시전자에게 '불 속성 무기' 버프 추가.",
      "priority": 0,
      "max_count": 2,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "fire_arrow.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      }
    },
    {
      "id": "ice_arrow",
      "name": "얼음화살",
      "type": "support",
      "scope": "archer",
      "cost": 20,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 자신의 활(무기)에 얼음 빙결 속성을 영구 부여합니다. 이 속성은 다른 속성으로 덮어쓸 수 있습니다.",
      "logic_detail": "시전자에게 '얼음 속성 무기' 버프 추가.",
      "priority": 0,
      "max_count": 2,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "ice_arrow.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      }
    },
    {
      "id": "arrow_rain",
      "name": "화살비",
      "type": "attack",
      "scope": "archer",
      "cost": 50,
      "damage": 10,
      "targeting": {
        "type": "global",
        "cast_range": 99,
        "aoe": 99
      },
      "effect": "[전체 공격] 데미지: 10\n효과: 맵 전체 공격. 현재 무기 속성이 묻어나가며, 속성 첫 발동 시 10의 추가 피해를 입힙니다.",
      "logic_detail": "전체 타겟 10 데미지. 무기 버프 연산.",
      "priority": 0,
      "max_count": 1,
      "ui": {
        "frame": "attack_frame.jpg",
        "illustration": "arrow_rain.jpg",
        "cost_icon": "attack_frame_cost_circle.jpg"
      }
    },
    {
      "id": "weakness_strike",
      "name": "약점타격",
      "type": "attack",
      "scope": "jumper",
      "cost": 10,
      "damage": 1,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 1*\n효과: 적중 시 이 전투 동안 이 카드의 데미지가 2배씩 계속 증가합니다(1, 2, 4, 8...). 이 스택 위력은 광범위 타격과 공유됩니다.",
      "logic_detail": "스택 기반 데미지 계산 (1 * 2^스택). 명중 시 스택 +1.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "attack_frame.jpg",
        "illustration": "weakness_strike.jpg",
        "cost_icon": "attack_frame_cost_circle.jpg"
      }
    },
    {
      "id": "wide_strike",
      "name": "광범위타격",
      "type": "attack",
      "scope": "jumper",
      "cost": 40,
      "damage": 1,
      "targeting": {
        "type": "global",
        "cast_range": 99,
        "aoe": 99
      },
      "effect": "[전체 공격] 데미지: 1*\n효과: 맵 전체를 타격하며 적중 시 이 전투 동안 데미지가 2배씩 증폭됩니다. 스택은 약점 타격 카드와 공유됩니다.",
      "logic_detail": "스택 기반 데미지 계산 (1 * 2^스택). 명중 시 스택 +1.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "attack_frame.jpg",
        "illustration": "wide_strike.jpg",
        "cost_icon": "attack_frame_cost_circle.jpg"
      }
    },
    {
      "id": "blink",
      "name": "블링크",
      "type": "support",
      "scope": "jumper",
      "ability": "파괴",
      "cost": null,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[파괴][패시브]\n(직접 사용 불가) 이 카드가 패에 들려있을 때, 받는 공격 1회를 무효화해주고 손에서 영구 삭제됩니다.",
      "logic_detail": "패시브 카드. 핸드 소지 시 피격 1회 무효화 후 영구 삭제.",
      "priority": 0,
      "max_count": 0,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "blink.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      }
    },
    {
      "id": "throw_book",
      "name": "책던지기",
      "type": "attack",
      "scope": "prophet",
      "cost": 10,
      "damage": 5,
      "targeting": {
        "type": "tile",
        "cast_range": 99,
        "aoe": 0
      },
      "effect": "[단일 공격] 데미지: 5\n효과: 지정한 1칸 범위에 두꺼운 책을 던져 데미지를 줍니다.",
      "logic_detail": "지정한 1칸에 5 데미지.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "attack_frame.jpg",
        "illustration": "throw_book.jpg",
        "cost_icon": "attack_frame_cost_circle.jpg"
      }
    },
    {
      "id": "copy",
      "name": "복제",
      "type": "support",
      "scope": "prophet",
      "cost": 10,
      "damage": null,
      "targeting": {
        "type": "hand",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 상대방의 패를 선택하여 1장 스캔하고, 내 핸드에 그 카드를 복제하여 가져옵니다.\n복제된 카드는 [파괴] 속성이 부여되어 1회 사용 후 소멸합니다.",
      "logic_detail": "상대의 핸드 카드 중 하나로 변환. 변환된 카드에 파괴 속성 부여.",
      "priority": 0,
      "max_count": 3,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "copy.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      }
    },
    {
      "id": "prophecy_orb",
      "name": "예언구슬",
      "type": "support",
      "scope": "prophet",
      "cost": 30,
      "damage": null,
      "targeting": {
        "type": "none",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[보조]\n효과: 예지력을 통해 덱에서 카드 3장을 즉시 뽑아옵니다.",
      "logic_detail": "덱에서 상위 3장의 카드를 핸드로 이동.",
      "priority": 0,
      "max_count": 1,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "prophecy_orb.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      },
      "effects": [
        {
          "type": "draw",
          "value": 3
        }
      ]
    },
    {
      "id": "prediction_LV1",
      "name": "예언LV1",
      "type": "support",
      "scope": "prophet",
      "ability": "파괴",
      "cost": 0,
      "damage": null,
      "targeting": {
        "type": "hand",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[파괴][보조]\n효과: 상대방의 패를 선택하여 1장 스캔하여 확인합니다.",
      "logic_detail": "상대의 핸드 카드 중 하나를 확인",
      "priority": 0,
      "max_count": 0,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "prophet_skill.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      }
    },
    {
      "id": "prediction_LV2",
      "name": "예언LV2",
      "type": "support",
      "scope": "prophet",
      "ability": "파괴",
      "cost": 0,
      "damage": null,
      "targeting": {
        "type": "hand",
        "cast_range": 0,
        "aoe": 0
      },
      "effect": "[파괴][보조]\n효과: 상대방의 패를 선택하여 최대 2장 스캔하여 확인합니다.",
      "logic_detail": "상대의 핸드 카드 중 두개를 확인",
      "priority": 0,
      "max_count": 0,
      "ui": {
        "frame": "support_frame.jpg",
        "illustration": "prophet_skill.jpg",
        "cost_icon": "support_frame_cost_circle.jpg"
      }
    },
    {
      "id": "prediction_LV3",
      "name": "예언LV3",
      "type": "magic",
      "scope": "prophet",
      "ability": "파괴",
      "cost": 0,
      "damage": 999,
      "targeting": {
        "type": "global",
        "cast_range": 0,
        "aoe": 99
      },
      "effect": "[파괴][전체 공격]\n상대를 즉사 시킵니다.",
      "logic_detail": "상대를 즉사시킵니다",
      "priority": 3,
      "max_count": 0,
      "ui": {
        "frame": "magic_frame.jpg",
        "illustration": "prophet_skill.jpg",
        "cost_icon": "magic_frame_cost_circle.jpg"
      }
    }
  ]
}
```

---

## data/characters_skills.json

```json
{
  "character_skills": {
    "warrior": {
      "class_name": "전사",
      "skill_id": "strong_impact",
      "skill_name": "강타",
      "levels": {
        "1": { "damage": 30, "trigger": "on_collision", "limit": "once_per_turn", "note": "이동 중 상대와 위치 겹칠 시 즉시 발동" },
        "2": { "damage": 40, "trigger": "on_collision", "limit": "once_per_turn" },
        "3": { "damage": 50, "trigger": "on_collision", "limit": "once_per_turn" }
      }
    },
    "esper": {
      "class_name": "에스퍼",
      "skill_id": "psychic_control",
      "skill_name": "염력조작",
      "levels": {
        "1": { "draw_count_override": 2, "trigger": "on_draw_action", "note": "기본 드로우 1장을 2장으로 대체" },
        "2": { "draw_count_override": 5, "trigger": "on_draw_action" },
        "3": { 
          "draw_count_override": 5, 
          "transform_rule": { "target_type": "attack_card", "new_card_id": "psychic_blast" },
          "new_card_effect": { "range": "global", "damage": 10 },
          "note": "드로우되는 모든 공격카드를 '염력조작' 카드로 변환"
        }
      }
    },
    "archer": {
      "class_name": "궁수",
      "skill_id": "rapid_fire",
      "skill_name": "연속사격",
      "levels": {
        "1": { "extra_attacks": 1, "multiplier": 0.5, "trigger": "on_hit", "note": "명중 시 0.5배 데미지로 1회 추가 공격 (효과 중첩 가능)" },
        "2": { "extra_attacks": 2, "multiplier": 0.5, "trigger": "on_hit" },
        "3": { "extra_attacks": 3, "multiplier": 0.5, "trigger": "on_hit" }
      }
    },
    "jumper": {
      "class_name": "점퍼",
      "skill_id": "blink_mastery",
      "skill_name": "블링크",
      "levels": {
        "1": { "replace_action": "move", "move_type": "teleport", "range": "anywhere", "note": "기본 이동을 전 맵 텔레포트로 대체" },
        "2": { 
          "replace_action": "move", "move_type": "teleport", "range": "anywhere",
          "path_damage": 5, "note": "텔레포트 경로상의 적에게 데미지 5 부여"
        },
        "3": { 
          "replace_action": "move", "move_type": "teleport", "range": "anywhere",
          "path_damage": 10, "gain_card_per_turn": "blink_card", "note": "경로 데미지 10 및 매턴 블링크 카드 획득"
        }
      }
    },
    "prophet": {
      "class_name": "예언가",
      "skill_id": "prophecy",
      "skill_name": "예언",
      "levels": {
        "1": { "gain_card_per_turn": "prophecy_lv1", "effect": "peek_opponent_hand", "count": 1, "note": "상대 카드 1장 확인 카드 획득" },
        "2": { "gain_card_per_turn": "prophecy_lv2", "effect": "peek_opponent_hand", "count": 2 },
        "3": { "gain_card_per_turn": "prophecy_lv3", "effect": "instant_kill", "note": "상대를 즉사시키는 카드 획득" }
      }
    }
  },
  "upgrade_condition": {
    "trigger_event": "deck_shuffle_event",
    "max_level": 3
  }
}
```

---

## data/status.json

```json
{
  "status_effects": {
    "poison": {
      "name": "독",
      "trigger": "on_turn_end",
      "effect": "base_damage: 5, incremental_damage: 5",
      "duration_logic": "stack_decreases_after_damage",
      "reset_logic": "on_stack_zero"
    },
    "burn": {
      "name": "화상",
      "trigger": "on_deal_damage",
      "effect": "damage_multiplier: 0.5",
      "duration_logic": "stack_decreases_on_turn_end"
    },
    "chill": {
      "name": "추위",
      "trigger": "none",
      "effect": "none",
      "duration_logic": "permanent"
    },
    "freeze": {
      "name": "얼음",
      "trigger": "on_action_phase_start",
      "effect": "skip_action: 1",
      "duration_logic": "stack_decreases_on_turn_end"
    },
    "bleed": {
      "name": "출혈",
      "trigger": "on_turn_end",
      "effect": "fixed_damage: 10",
      "duration_logic": "stack_decreases_on_turn_end"
    },
    "electrocute": {
      "name": "감전",
      "trigger": "on_move",
      "effect": "damage: 10",
      "duration_logic": "stack_decreases_per_move"
    },
    "silence": {
      "name": "침묵",
      "trigger": "on_card_use",
      "effect": "disable_categories: ['support', 'magic']",
      "duration_logic": "stack_decreases_on_turn_end"
    },
    "root": {
      "name": "속박",
      "trigger": "on_move_attempt",
      "effect": "disable_move: true",
      "duration_logic": "stack_decreases_on_turn_end"
    },
    "vulnerable": {
      "name": "취약",
      "trigger": "on_take_damage",
      "effect": "damage_received_multiplier: 2.0",
      "duration_logic": "stack_decreases_on_turn_end"
    },
    "strengthen": {
      "name": "강화",
      "trigger": "on_deal_damage",
      "effect": "damage_dealt_multiplier: 2.0",
      "duration_logic": "stack_decreases_on_turn_end"
    },
    "weapon_poison": {
      "name": "독 무기",
      "trigger": "none",
      "effect": "adds_poison_on_hit",
      "duration_logic": "permanent"
    },
    "weapon_fire": {
      "name": "불 무기",
      "trigger": "none",
      "effect": "adds_burn_on_hit",
      "duration_logic": "permanent"
    },
    "weapon_ice": {
      "name": "얼음 무기",
      "trigger": "none",
      "effect": "adds_chill_on_hit",
      "duration_logic": "permanent"
    },
    "weapon_bonus": {
      "name": "속성 변경 보너스",
      "trigger": "none",
      "effect": "next_attack_bonus_10",
      "duration_logic": "permanent"
    }
  },
  "complex_stack_rules": {
    "mixed_stacks": {
      "condition": "3_different_stacks_active (exclude_strengthen)",
      "trigger": "on_turn_end",
      "effect": "discard_random_card_without_using"
    },
    "explosion": {
      "condition": "burn && poison",
      "trigger": "instant",
      "effect": "fixed_damage: 30, consume_stacks: {burn: 1, poison: 1}"
    },
    "stun": {
      "condition": "freeze && electrocute",
      "trigger": "instant",
      "effect": "next_turn_skip, consume_stacks: {freeze: 1, electrocute: 1}"
    }
  }
}
```

---

## next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

---

## next.config.mjs

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

---

## package.json

```json
{
  "name": "turn_card_battle_v2",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma db push --accept-data-loss && prisma generate && next build && tsc --project tsconfig.server.json",
    "start": "node dist/server/server.js",
    "lint": "next lint",
    "server": "tsx src/server/server.ts"
  },
  "dependencies": {
    "@mantine/core": "^7.0.0",
    "@mantine/hooks": "^7.0.0",
    "@prisma/adapter-pg": "^6.4.1",
    "@prisma/client": "^6.4.1",
    "bcryptjs": "^3.0.2",
    "dotenv": "^17.3.1",
    "express": "^4.21.2",
    "framer-motion": "^12.4.7",
    "howler": "^2.2.4",
    "lucide-react": "^0.475.0",
    "next": "15.1.7",
    "next-auth": "^4.24.11",
    "pg": "^8.13.3",
    "postcss-preset-mantine": "^1.18.0",
    "postcss-simple-vars": "^7.0.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/express": "^5.0.0",
    "@types/howler": "^2.2.12",
    "@types/node": "^20.17.19",
    "@types/pg": "^8.11.11",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "postcss": "^8.5.3",
    "prisma": "^6.4.1",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

---

## postcss.config.mjs

```javascript
export default {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

---

## prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  rankScore Int      @default(1000) // 💡 랭크 점수 (기본 1000점 = 브론즈 시작)
  createdAt DateTime @default(now())
  decks     Deck[]
}

model Deck {
  id        String   @id @default(uuid())
  name      String   
  character String   @default("warrior") 
  cards     String[] 
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

---

## public/chracter_images/archer.json

```json
{
  "idle": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 0, "w": 200, "h": 182 },
      { "x": 200, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "walk": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 0, "w": 200, "h": 182 },
      { "x": 600, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "attack_prepare": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 0, "w": 200, "h": 182 },
      { "x": 0, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_swing": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "hit": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 182, "w": 200, "h": 182 },
      { "x": 800, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_start": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_loop": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_fall": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_down": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 364, "w": 200, "h": 182 }
    ]
  }
}
```

---

## public/chracter_images/esper.json

```json
{
  "idle": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 0, "w": 200, "h": 182 },
      { "x": 200, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "walk": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 0, "w": 200, "h": 182 },
      { "x": 600, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "attack_prepare": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 0, "w": 200, "h": 182 },
      { "x": 0, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_swing": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "hit": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 182, "w": 200, "h": 182 },
      { "x": 800, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_start": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_loop": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_fall": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_down": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 364, "w": 200, "h": 182 }
    ]
  }
}
```

---

## public/chracter_images/jumper.json

```json
{
  "idle": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 0, "w": 200, "h": 182 },
      { "x": 200, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "walk": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 0, "w": 200, "h": 182 },
      { "x": 600, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "attack_prepare": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 0, "w": 200, "h": 182 },
      { "x": 0, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_swing": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "hit": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 182, "w": 200, "h": 182 },
      { "x": 800, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_start": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_loop": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_fall": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_down": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 364, "w": 200, "h": 182 }
    ]
  }
}
```

---

## public/chracter_images/prophet.json

```json
{
  "idle": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 0, "w": 200, "h": 182 },
      { "x": 200, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "walk": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 0, "w": 200, "h": 182 },
      { "x": 600, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "attack_prepare": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 0, "w": 200, "h": 182 },
      { "x": 0, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_swing": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "hit": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 182, "w": 200, "h": 182 },
      { "x": 800, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_start": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_loop": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_fall": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_down": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 364, "w": 200, "h": 182 }
    ]
  }
}
```

---

## public/chracter_images/warrior.json

```json
{
  "idle": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 0, "w": 200, "h": 182 },
      { "x": 200, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "walk": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 0, "w": 200, "h": 182 },
      { "x": 600, "y": 0, "w": 200, "h": 182 }
    ]
  },
  "attack_prepare": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 0, "w": 200, "h": 182 },
      { "x": 0, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_swing": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "attack_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "hit": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 182, "w": 200, "h": 182 },
      { "x": 800, "y": 182, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_start": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 0, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_loop": {
    "loop": true,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 200, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "skill_cast_end": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 400, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_fall": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 600, "y": 364, "w": 200, "h": 182 }
    ]
  },
  "death_down": {
    "loop": false,
    "anchor": { "x": 0.5, "y": 0.8 },
    "frames": [
      { "x": 800, "y": 364, "w": 200, "h": 182 }
    ]
  }
}
```

---

## src/app/api/auth/register/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
// ✅ 정식 import 방식을 사용합니다.
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
    try {
        console.log("가입 요청 받음!"); // 테스트용 로그

        const body = await req.json();
        const { email, password, name } = body;

        console.log("받은 데이터:", { email, name }); // 비밀번호는 로그에 찍지 않음

        if (!email || !password || !name) {
            return NextResponse.json({ message: '이메일, 비밀번호, 닉네임을 모두 입력해 주세요.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' }, { status: 400 });
        }

        console.log("DB에서 유저 확인 중...");
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ message: '이미 사용 중인 이메일 주소입니다.' }, { status: 409 });
        }

        console.log("비밀번호 암호화 시작...");
        // 여기서 뻗는지 확인
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log("비밀번호 암호화 완료!");

        console.log("새 유저 DB에 저장 중...");
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        console.log("DB 저장 완료!");

        const { password: _pw, ...safeUser } = newUser;

        return NextResponse.json({ message: '회원가입이 완료되었습니다!', user: safeUser }, { status: 201 });

    } catch (error: any) {
        // 🔥 에러가 나면 터미널에 아주 자세히 출력하도록 변경
        console.error('[🚨 REGISTER API ERROR 상세 내역]:', error.message || error);
        return NextResponse.json({ message: '서버 오류가 발생했습니다.', error: error.message }, { status: 500 });
    }
}
```

---

## src/app/api/auth/[...nextauth]/route.ts

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

---

## src/app/api/deck/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import prisma from '../../../lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { decks: { orderBy: { createdAt: 'desc' } } }
        });

        if (!user) {
            return NextResponse.json({ decks: [] }, { status: 200 });
        }

        return NextResponse.json({ decks: user.decks }, { status: 200 });
    } catch (error: any) {
        console.error('[GET /api/deck] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, character, cards } = body;

        if (!name || !character || !cards || !Array.isArray(cards)) {
            return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const newDeck = await prisma.deck.create({
            data: {
                name,
                character,
                cards,
                userId: user.id
            }
        });

        return NextResponse.json({ message: 'Deck saved successfully', deck: newDeck }, { status: 201 });
    } catch (error: any) {
        console.error('[POST /api/deck] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
```

---

## src/app/api/deck/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import prisma from '../../../../lib/prisma';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Next.js 15부터 params가 Promise로 변경되어 await이 필수
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, character, cards } = body;

        if (!name || !character || !cards || !Array.isArray(cards)) {
            return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
        }

        // 덱 소유자 확인
        const existingDeck = await prisma.deck.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!existingDeck) {
            return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
        }

        if (existingDeck.user.email !== session.user.email) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const updatedDeck = await prisma.deck.update({
            where: { id },
            data: { name, character, cards }
        });

        return NextResponse.json({ message: 'Deck updated successfully', deck: updatedDeck }, { status: 200 });
    } catch (error: any) {
        console.error('[PUT /api/deck/[id]] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Next.js 15부터 params가 Promise로 변경되어 await이 필수
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const existingDeck = await prisma.deck.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!existingDeck) {
            return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
        }

        if (existingDeck.user.email !== session.user.email) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await prisma.deck.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Deck deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('[DELETE /api/deck/[id]] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
```

---

## src/app/api/user/me/route.ts

```typescript
// src/app/api/user/me/route.ts
// 로비에서 내 랭크 점수를 조회하는 API 엔드포인트
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import prisma from '../../../../lib/prisma';

export async function GET() {
    // 세션 확인 - 미인증 시 401 반환
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // DB에서 rankScore만 선택적으로 조회 (최소한의 데이터만 가져옴)
    // 💡 prisma db push 후 타입 재생성 전까지 any 단언으로 안전하게 처리
    const user = await (prisma.user.findUnique as any)({
        where: { email: session.user.email },
        select: { rankScore: true }
    });

    return NextResponse.json(user);
}
```

---

## src/app/game/page.tsx

```tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Group, ActionIcon, ScrollArea, Text, Center, Loader } from '@mantine/core';
import { X, Sword, MousePointer2, BookOpen, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../engine/store';
import { SoundEngine } from '../../engine/soundEngine'; // 💡 사운드 엔진 임포트
import { useSocket } from '../../components/SocketProvider';
import type { Action, Card } from '../../types';

import { PlayerStatus } from '../../components/game/ui/PlayerStatus';
import { FieldBoard } from '../../components/game/ui/FieldBoard';
import { HandSystem } from '../../components/game/ui/HandSystem';
import { TurnIndicator } from '../../components/game/ui/TurnIndicator';
import { GameCard3D } from '../../components/game/ui/Card';
import { ActionPanel, type ActionCommandType } from '../../components/game/ui/ActionPanel';
import { ActionDPad } from '../../components/game/ui/ActionDPad';
import { VFXManager } from '../../components/game/ui/VFXManager';

export default function GameBoard() {
    const store = useGameStore();
    const router = useRouter();
    const socket = useSocket();
    const myId = store.myId || socket?.id;
    const p1 = myId ? store.players[myId] : null;
    const opponentId = Object.keys(store.players).find(id => id !== myId);
    const p2 = opponentId ? store.players[opponentId] : null;

    const [targetingCardId, setTargetingCardId] = useState<string | null>(null);
    const [prevP1Hp, setPrevP1Hp] = useState(p1?.hp || 100);
    const [prevP2Hp, setPrevP2Hp] = useState(p2?.hp || 100);
    const [hoveredMapCell, setHoveredMapCell] = useState<{ x: number; y: number } | null>(null);

    const [currentCommand, setCurrentCommand] = useState<ActionCommandType | null>(null);
    const [turnLabel, setTurnLabel] = useState<string | null>(null);
    const [audioUnlocked, setAudioUnlocked] = useState(false);

    const logEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [store.logs]);

    useEffect(() => {
        if (store.status === 'lobby') router.push('/');
    }, [store.status, router]);

    // 서버 결괏값 리스너 (리플레이 재생)
    useEffect(() => {
        if (!socket) return;
        const onTurnResult = (data: any) => {
            console.log('[Socket] TURN_RESULT 수신 완료! 데이터:', data);
            if (data && data.snapshots && Array.isArray(data.snapshots)) {
                useGameStore.getState().playReplays(data.snapshots);
            } else {
                console.warn('[Socket] TURN_RESULT에 snapshots가 누락되었습니다.', data);
            }
        };
        socket.on('TURN_RESULT', onTurnResult);
        console.log('[Socket] TURN_RESULT listener registered 🎯');

        const onStateSync = (data: any) => {
            console.log('[Socket] STATE_SYNC 수신 완료', data);
            if (data && data.state) {
                useGameStore.getState().syncState(data.state);
            }
        }
        socket.on('STATE_SYNC', onStateSync);
        console.log('[Socket] STATE_SYNC listener registered 🎯');

        return () => { 
            socket.off('TURN_RESULT', onTurnResult); 
            socket.off('STATE_SYNC', onStateSync);
            console.log('[Socket] Listeners unregistered'); 
        };
    }, [socket]);

    // 강제 동기화 (재접속 대비 안전장치)
    useEffect(() => {
        if (socket && store.myId && socket.id && store.myId !== socket.id) {
            console.log(`[Sync] 소켓 ID 불일치 감지. (Store: ${store.myId}, Socket: ${socket.id}). 상태 동기화 요청.`);
            socket.emit('REQUEST_STATE_SYNC', { oldSocketId: store.myId });
        }
    }, [socket?.id, store.myId]);

    useEffect(() => {
        if (store.status === 'planning') setTurnLabel(!p1?.isReady ? "YOUR TURN" : "ENEMY TURN");
        else if (store.status === 'resolving') setTurnLabel("BATTLE PHASE");
        else if (store.status === 'discarding') setTurnLabel("DISCARD CARD");
    }, [store.status, store.turnCount, store.resolvingStep, p1?.isReady]);

    // 💡 패배/승리 사운드 재생
    useEffect(() => {
        if (store.status === 'game_over') {
            if (p1 && p1.hp > 0 && p2 && p2.hp <= 0) {
                SoundEngine.playBGM('bgm_victory');
            } else if (p1 && p1.hp <= 0 && p2 && p2.hp > 0) {
                SoundEngine.playBGM('bgm_defeat');
            } else {
                // 무승부 사운드가 명시되지 않았으므로 bgm_defeat 재생 혹은 중지 방어코드
                SoundEngine.playBGM('bgm_defeat');
            }
        }
    }, [store.status, p1?.hp, p2?.hp]);

    // BGM Audio Unlock Overlay
    if (!audioUnlocked && store.status !== 'lobby') {
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexDirection: 'column', gap: '20px' }}
                 onClick={() => { setAudioUnlocked(true); SoundEngine.playBGM('bgm_battle'); }}>
                <Sword size={64} color="#E6C36A" />
                <Text size="xl" fw={900} c="white" style={{ letterSpacing: '2px', textShadow: '0 0 10px #E6C36A' }}>화면을 클릭하여 전투에 진입하세요! (사운드 활성화)</Text>
            </div>
        );
    }

    if (store.status === 'lobby') return null;

    if (!p1 || !p2 || !myId) {
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Center style={{ flexDirection: 'column', gap: '20px' }}>
                    <Loader size="xl" color="violet" />
                    <Text c="white" size="lg" fw={700}>전장 데이터를 동기화 중...</Text>
                </Center>
            </div>
        );
    }

    const serverP1Id = Object.keys(store.players)[0];
    const amIServerP1 = myId === serverP1Id;
    const myResolvingSteps = amIServerP1 ? [0, 2, 4] : [1, 3, 5];
    const enemyResolvingSteps = amIServerP1 ? [1, 3, 5] : [0, 2, 4];

    const selectedCard = targetingCardId ? p1.hand.find(c => c.id === targetingCardId) : null;
    const targetingDef = selectedCard?.targeting ?? null;

    const getValidTargets = (targeting: typeof targetingDef, px: number, py: number): Set<string> => {
        const result = new Set<string>();
        if (!targetingCardId || !targeting) return result;
        const { type, cast_range } = targeting;
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const dx = Math.abs(x - px);
                const dy = Math.abs(y - py);
                if (type === 'global' || cast_range === 99) result.add(`${x},${y}`);
                else if (type === 'line') { if ((dx === 0 || dy === 0) && (dx + dy <= cast_range)) result.add(`${x},${y}`); }
                else if (dx + dy <= cast_range) result.add(`${x},${y}`);
            }
        }
        return result;
    };

    const getVirtualPosition = (player: typeof p1) => {
        let { x, y } = player.position;
        player.actionQueue.forEach(a => {
            if (a && a.type === 'move') {
                if (a.targetX !== undefined && a.targetY !== undefined) { x = a.targetX; y = a.targetY; }
                else if (a.dx !== undefined && a.dy !== undefined) { x += a.dx; y += a.dy; }
            }
        });
        return { x: Math.max(0, Math.min(2, x)), y: Math.max(0, Math.min(2, y)) };
    };

    const virtualPos = getVirtualPosition(p1);
    const validTargets = getValidTargets(targetingDef, virtualPos.x, virtualPos.y);

    const getPreviewTiles = (targeting: typeof targetingDef, mx: number, my: number): Set<string> => {
        const result = new Set<string>();
        if (!targetingCardId || !targeting || !validTargets.has(`${mx},${my}`)) return result;
        const { aoe, type } = targeting;
        if (aoe === 0) result.add(`${mx},${my}`);
        else if (aoe === 1) {
            const adj = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: 0 }];
            adj.forEach(({ dx, dy }) => {
                const nx = mx + dx, ny = my + dy;
                if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) result.add(`${nx},${ny}`);
            });
        } else if (aoe >= 99) {
            for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) result.add(`${x},${y}`);
        }
        return result;
    };

    const previewTiles = hoveredMapCell ? getPreviewTiles(targetingDef, hoveredMapCell.x, hoveredMapCell.y) : new Set<string>();
    const isInRange = (x: number, y: number): boolean => validTargets.has(`${x},${y}`);

    const getPredictedEnergy = () => {
        let energy = p1.energy;
        p1.actionQueue.forEach(a => {
            if (a.type === 'rest') {
                energy = Math.min(100, energy + 10);
            } else if (a.type === 'play_card' && a.cardInstanceId) {
                const c = p1.hand.find(hc => hc.id === a.cardInstanceId);
                if (c) {
                    const baseId = c.originalId || c.id;
                    if (baseId === 'meditation') energy = Math.min(100, energy + 30);
                    else {
                        const cost = c.cost === 'all_energy' || c.cost === 'all' ? energy : (typeof c.cost === 'number' ? c.cost : 0);
                        energy -= cost;
                    }
                }
            }
        });
        return Math.max(0, energy);
    };

    const handleTileClick = (x: number, y: number) => {
        if (!currentCommand || store.status !== 'planning' || p1.isReady) return;
        if (currentCommand === 'move') {
            const dx = x - virtualPos.x;
            const dy = y - virtualPos.y;
            if ((p1.characterId === 'jumper' && p1.skillLevel >= 1) || Math.abs(dx) + Math.abs(dy) === 1) {
                store.appendAction(myId!, { type: 'move', dx, dy, targetX: x, targetY: y });
            }
        } else if (currentCommand === 'play_card' && targetingCardId && targetingDef?.type !== 'hand') {
            if (!isInRange(x, y)) return;
            store.appendAction(myId!, { type: 'play_card', cardInstanceId: targetingCardId, targetX: x, targetY: y });
            setTargetingCardId(null); setHoveredMapCell(null); setCurrentCommand(null);
        }
    };

    const handleEnemyHandClick = (index: number) => {
        if (store.status !== 'planning' || p1.isReady || currentCommand !== 'play_card' || !targetingCardId) return;
        if (targetingDef?.type === 'hand') {
            store.appendAction(myId!, { type: 'play_card', cardInstanceId: targetingCardId, targetCardIndex: index });
            setTargetingCardId(null); setCurrentCommand(null);
        }
    };

    const handleCommandSelect = (cmd: ActionCommandType) => {
        if (store.status !== 'planning' || p1.isReady) return;
        setCurrentCommand(cmd);
        if (cmd === 'draw' || cmd === 'rest') {
            store.appendAction(myId!, { type: cmd });
            setCurrentCommand(null);
        }
    };

    const handleDPadMove = (dx: number, dy: number) => {
        if (store.status !== 'planning' || p1.isReady) return;
        store.appendAction(myId!, { type: 'move', dx, dy });
    };

    const isPlanning = store.status === 'planning';
    const isResolving = store.status === 'resolving';
    const isDiscarding = store.status === 'discarding' && p1.hand.length > 10;
    const isP1Turn = isPlanning && !p1.isReady && !isResolving;

    const renderActionIcon = (action: Action) => {
        if (!action) return null;
        switch (action.type) {
            case 'move': return <MousePointer2 size={24} color="#E6C36A" />;
            case 'play_card': return <Sword size={24} color="#ff4c4c" />;
            case 'draw': return <BookOpen size={24} color="#4c9aff" />;
            case 'rest': return <Activity size={24} color="#4cff4c" />;
            default: return null;
        }
    };

    const resolvingItems = store.status === 'resolving' ? [0, 1, 2, 3, 4, 5].map(step => {
        const isMe = myResolvingSteps.includes(step);
        const actionIdx = Math.floor(step / 2);
        return {
            owner: isMe ? 'P1' : 'P2',
            action: isMe ? p1.actionQueue[actionIdx] : p2.actionQueue[actionIdx],
            isTarget: store.resolvingStep === step
        };
    }) : [];

    const renderLogLine = (log: string, index: number) => {
        if (!log || !log.trim()) return null;
        if (log.startsWith('---') || log.startsWith('***') || log.includes('무승부') || log.includes('승리')) {
            return (
                <div key={index} style={{ textAlign: 'center', margin: '16px 0 8px 0', padding: '6px', background: 'linear-gradient(90deg, transparent, rgba(230, 195, 106, 0.15), transparent)', color: '#E6C36A', fontWeight: 900, fontSize: '13px', letterSpacing: '2px', textShadow: '0 0 5px rgba(230,195,106,0.5)' }}>
                    {log}
                </div>
            );
        }
        const isP1 = log.includes('player1') || log.includes('P1');
        const isP2 = log.includes('player2') || log.includes('P2');
        const isSubAction = log.trim().startsWith('->') || log.trim().startsWith('>>');
        let borderColor = '#555'; let bgColor = 'rgba(255,255,255,0.02)'; let textColor = '#ddd';

        if (isP1) { borderColor = '#4c9aff'; bgColor = 'rgba(76, 154, 255, 0.08)'; }
        else if (isP2) { borderColor = '#ff4c4c'; bgColor = 'rgba(255, 76, 76, 0.08)'; }

        if (log.includes('피해') || log.includes('데미지') || log.includes('감소') || log.includes('폭발') || log.includes('즉사')) textColor = '#ff8888';
        if (log.includes('회복') || log.includes('치료')) textColor = '#88ff88';
        if (log.includes('상태이상') || log.includes('부여') || log.includes('무기') || log.includes('방어도') || log.includes('스캔') || log.includes('복제')) textColor = '#dca3ff';

        return (
            <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                style={{
                    marginLeft: isSubAction ? '20px' : '0', borderLeft: `4px solid ${borderColor}`, background: bgColor,
                    padding: '8px 12px', marginBottom: '6px', borderRadius: '0 6px 6px 0',
                    fontSize: isSubAction ? '12px' : '13px', fontWeight: isSubAction ? 'normal' : 'bold',
                    color: textColor, lineHeight: '1.4', textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                {log}
            </motion.div>
        );
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* 💡 화면비 고정 및 해상도 대응용 래퍼 */}
            <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundImage: 'url("/map_images/background.png")', backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)' }}>
                
                <VFXManager />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '30%', height: '40%', background: 'radial-gradient(circle, rgba(255,100,0,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 1 }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30%', height: '40%', background: 'radial-gradient(circle, rgba(255,100,0,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 1 }} />

                <AnimatePresence>
                    {store.peekingCards && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.8 }} 
                            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', cursor: 'pointer' }}
                            onClick={() => store.closePeekingCards()}
                        >
                            <Text size="2xl" fw={900} c="blue.4" mb="xl" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 0 15px blue', fontSize: '30px', marginBottom: '80px' }}>상대방의 손패를 확인했습니다!</Text>
                            <div style={{ display: 'flex', gap: '80px' }}>
                                {store.peekingCards.map((c, i) => (
                                    <div key={i} style={{ transform: 'scale(2.5)', margin: '40px' }}>
                                        <GameCard3D card={c} disabled={false} selected={false} />
                                    </div>
                                ))}
                            </div>
                            <Text size="sm" c="gray.5" mt="xl" style={{ marginTop: '120px' }}>(화면을 클릭하면 닫힙니다)</Text>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isDiscarding && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 25, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <Text size="xl" fw={800} c="red.4" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 0 10px red' }}>손패가 가득 찼습니다. 버릴 카드를 먼저 선택하세요!</Text>
                    </div>
                )}

                {store.status === 'planning' && p1.isReady && !p2.isReady && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 25, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <Text size="2xl" fw={800} c="gray.3" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 0 10px rgba(255,255,255,0.5)', letterSpacing: '2px', fontSize: '32px' }}>
                            상대방이 전략을 구상 중입니다...
                        </Text>
                    </div>
                )}

                {store.status === 'discarding' && p1.hand.length <= 10 && p2.hand.length > 10 && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 25, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <Text size="2xl" fw={800} c="gray.3" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 0 10px rgba(255,255,255,0.5)', letterSpacing: '2px', fontSize: '32px' }}>
                            상대방이 카드를 정리 중입니다...
                        </Text>
                    </div>
                )}

                {/* 💡 게임 오버 결과창 및 로비 귀환 */}
                <AnimatePresence>
                    {store.status === 'game_over' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ position: 'absolute', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', cursor: 'pointer' }}
                            onClick={() => {
                                // 사운드 중단 (lobby 브금으로 변경하거나 다른 화면에서 처리)
                                SoundEngine.playBGM('bgm_lobby');
                                
                                // 서버에 방 퇴장 명시적 알림
                                socket?.emit('LEAVE_ROOM');
                                
                                store.reset();
                                router.push('/');
                            }}
                        >
                            {p1.hp > 0 && p2.hp <= 0 && (
                                <Text fw={900} style={{ fontFamily: 'var(--font-fantasy)', fontSize: '100px', color: '#E6C36A', textShadow: '0 0 40px #E6C36A, 0 10px 20px #000', letterSpacing: '10px' }}>
                                    VICTORY
                                </Text>
                            )}
                            {p1.hp <= 0 && p2.hp > 0 && (
                                <Text fw={900} style={{ fontFamily: 'var(--font-fantasy)', fontSize: '100px', color: '#ff4c4c', textShadow: '0 0 40px #ff4c4c, 0 10px 20px #000', letterSpacing: '10px' }}>
                                    DEFEAT
                                </Text>
                            )}
                            {p1.hp <= 0 && p2.hp <= 0 && (
                                <Text fw={900} style={{ fontFamily: 'var(--font-fantasy)', fontSize: '100px', color: '#aaaaaa', textShadow: '0 0 40px #aaaaaa, 0 10px 20px #000', letterSpacing: '10px' }}>
                                    DRAW
                                </Text>
                            )}
                            <Text size="xl" c="gray.5" mt="xl" style={{ marginTop: '50px' }}>
                                (화면을 클릭하면 로비로 돌아갑니다)
                            </Text>
                        </motion.div>
                    )}
                </AnimatePresence>

                <TurnIndicator turnLabel={turnLabel} />

                {store.status === 'resolving' && (
                    <div style={{ position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 50, background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '12px', border: '2px solid #5a4231', boxShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
                        {resolvingItems.map((item, idx) => (
                            <div key={idx} style={{ width: '44px', height: '44px', borderRadius: '8px', background: item.owner === 'P1' ? 'rgba(76, 154, 255, 0.2)' : 'rgba(255, 76, 76, 0.2)', border: `2px solid ${item.isTarget ? '#E6C36A' : item.owner === 'P1' ? '#4c9aff' : '#ff4c4c'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: item.isTarget ? 1 : 0.4, transform: item.isTarget ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.3s' }}>
                                <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>{item.owner}</span>
                                <div style={{ transform: 'scale(0.8)' }}>{renderActionIcon(item.action)}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ position: 'absolute', top: '2%', left: '8%', right: '8%', zIndex: 100, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '600px', marginBottom: '20px' }}>
                        <PlayerStatus player={p2} isTurn={store.status === 'planning' && !p2.isReady} reverse prevHp={prevP2Hp} />
                    </div>
                    
                    <div style={{ position: 'relative', width: '100%', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', perspective: '1000px',transform: 'translate(0px, 0px)' }}>
                        <AnimatePresence>
                            {p2.hand.map((card, i) => {
                                const total = p2.hand.length;
                                const centerIdx = (total - 1) / 2;
                                const offset = i - centerIdx;
                                const rotateZ = offset * -6; 
                                const translateX = offset * 50;
                                const translateY = Math.abs(offset) * 8; 
                                const isTargetingHand = targetingDef?.type === 'hand';

                                return (
                                    <motion.div 
                                        key={card.id} 
                                        initial={{ opacity: 0, y: -50 }} 
                                        animate={{ opacity: 1, x: translateX, y: translateY, rotateZ: rotateZ }} 
                                        exit={{ opacity: 0, scale: 0.5, y: -50 }}
                                        onClick={() => handleEnemyHandClick(i)}
                                        style={{ 
                                            position: 'absolute',
                                            width: '90px', height: '130px', 
                                            backgroundImage: 'url("/images/card_back.jpg")', 
                                            backgroundSize: '100% 100%', backgroundPosition: 'center',
                                            borderRadius: '8px', border: '2px solid #4a3b2c',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
                                            cursor: isTargetingHand ? 'crosshair' : 'default',
                                            filter: isTargetingHand ? 'drop-shadow(0 0 15px rgba(255, 50, 50, 1)) brightness(1.3)' : 'none',
                                            transformOrigin: 'top center',
                                            zIndex: 50 + i
                                        }}
                                        whileHover={isTargetingHand ? { scale: 1.15, y: translateY + 15, zIndex: 100 } : {}}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                <div style={{ position: 'absolute', top: '35%', left: '8%', zIndex: 39, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', transform: 'translate(-10px, 10px)' }}>
                    <Text fw={700} size="sm" c="gray.4" mb={4} style={{ textShadow: '0 2px 4px #000' }}>버린 패: {p1.discardPile.length}</Text>
                    <img src="/map_images/deck_icon.png" alt="Discard Pile" style={{ width: '110px', height: '154px', borderRadius: '8px', border: '1px solid #666', opacity: 0.8, filter: 'grayscale(50%)' }} />
                </div>
                <div style={{ position: 'absolute', top: '35%', right: '8%', zIndex: 39, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', transform: 'translate(10px, 10px)' }}>
                    <Text fw={700} size="sm" c="gray.4" mb={4} style={{ textShadow: '0 2px 4px #000' }}>버린 패: {p2.discardPile.length}</Text>
                    <img src="/map_images/deck_icon.png" alt="Discard Pile" style={{ width: '110px', height: '154px', borderRadius: '8px', border: '1px solid #666', opacity: 0.8, filter: 'grayscale(50%)' }} />
                </div>

                {store.lastPlayedCard?.player1 && (
                    <div style={{ position: 'absolute', top: '35%', left: '8%', zIndex: 40, transform: 'scale(0.85)', animation: 'fade-in 0.5s', pointerEvents: 'none' }}>
                        <Text fw={900} size="xl" c="blue.4" mb="sm" ta="center" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 2px 4px #000' }}>P1 발동!</Text>
                        <GameCard3D card={store.lastPlayedCard.player1} disabled={false} selected={false} />
                    </div>
                )}
                {store.lastPlayedCard?.player2 && (
                    <div style={{ position: 'absolute', top: '35%', right: '8%', zIndex: 40, transform: 'scale(0.85)', animation: 'fade-in 0.5s', pointerEvents: 'none' }}>
                        <Text fw={900} size="xl" c="red.4" mb="sm" ta="center" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 2px 4px #000' }}>P2 발동!</Text>
                        <GameCard3D card={store.lastPlayedCard.player2} disabled={false} selected={false} />
                    </div>
                )}

                <div style={{ position: 'absolute', top: '2%', left: '2%', width: '420px', height: '320px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, rgba(20, 15, 10, 0.95) 0%, rgba(10, 10, 15, 0.85) 100%)', border: '2px solid #5a4231', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)', zIndex: 20, overflow: 'hidden' }}>
                    <div style={{ background: 'linear-gradient(90deg, #3a2a1c, #5a4231, #3a2a1c)', padding: '10px', textAlign: 'center', borderBottom: '2px solid #2a1a0c', boxShadow: '0 4px 6px rgba(0,0,0,0.5)', zIndex: 2 }}>
                        <Text fw={900} size="md" c="#E6C36A" style={{ fontFamily: 'var(--font-fantasy)', letterSpacing: '2px', textShadow: '0 2px 4px #000' }}>⚔️ BATTLE CHRONICLE ⚔️</Text>
                    </div>
                    <ScrollArea style={{ flex: 1 }} p="sm" scrollbarSize={6} offsetScrollbars>
                        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
                            {store.logs.map((log, i) => renderLogLine(log, i))}
                            <div ref={logEndRef} />
                        </div>
                    </ScrollArea>
                </div>

                <div style={{ position: 'absolute', bottom: '6%', left: '2%', zIndex: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                    <Text fw={700} size="sm" c="white" mb={4} style={{ textShadow: '0 2px 4px #000' }}>덱: {p1.drawPile.length}</Text>
                    <motion.img src="/map_images/deck_icon.png" animate={{ rotateY: p1.shuffleCount * 360 }} transition={{ duration: 0.5 }} style={{ width: '110px', height: '154px', borderRadius: '8px', border: '3px solid #E6C36A', boxShadow: '0 8px 16px rgba(0,0,0,0.9)' }} />
                </div>
                <div style={{ position: 'absolute', top: '10%', right: '28%',left: '90%', zIndex: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                    <Text fw={700} size="sm" c="white" mb={4} style={{ textShadow: '0 2px 4px #000' }}>덱: {p2.drawPile.length}</Text>
                    <motion.img src="/map_images/deck_icon.png" animate={{ rotateY: p2.shuffleCount * 360 }} transition={{ duration: 0.5 }} style={{ width: '110px', height: '154px', borderRadius: '8px', border: '3px solid #E6C36A', boxShadow: '0 8px 16px rgba(0,0,0,0.9)' }} />
                </div>

                <div style={{ position: 'absolute', top: '28%', height: '50%', left: '8%', right: '8%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
                    <motion.div style={{ pointerEvents: 'auto' }} animate={store.isScreenShaking ? { x: [-10, 10, -10, 10, -5, 5, 0], y: [-5, 5, -5, 5, 0] } : { x: 0, y: 0 }} transition={{ duration: 0.4 }}>
                        <FieldBoard p1Pos={p1.position} p2Pos={p2.position} virtualP1Pos={virtualPos} previewTiles={previewTiles} validTargets={validTargets} targetTiles={new Set(currentCommand === 'play_card' ? [targetingCardId || ''] : [])} onTileClick={handleTileClick} onTileHover={(x, y) => setHoveredMapCell({ x, y })} onTileLeave={() => setHoveredMapCell(null)} isTargeting={currentCommand === 'play_card' && !!targetingCardId && targetingDef?.type !== 'hand'} visualEffects={store.visualEffects} isP1Turn={store.status === 'resolving' && myResolvingSteps.includes(store.resolvingStep)} isP2Turn={store.status === 'resolving' && enemyResolvingSteps.includes(store.resolvingStep)} p1ResolvingSteps={myResolvingSteps} p2ResolvingSteps={enemyResolvingSteps} p1Statuses={p1.statuses} p2Statuses={p2.statuses} removeVisualEffect={store.removeVisualEffect} p1CharId={p1.characterId} p2CharId={p2.characterId} p1Hp={p1.hp} p2Hp={p2.hp} resolvingStep={store.resolvingStep} p1Action={p1.actionQueue} p2Action={p2.actionQueue} status={store.status} turnCount={store.turnCount} />
                    </motion.div>
                </div>

                <div style={{ position: 'absolute', top: '65%', height: '35%', left: '8%', right: '8%', zIndex: 30, display: 'flex', pointerEvents: 'none' }}>
                    <div style={{ width: '350px', height: '100%', position: 'relative', zIndex: 35, pointerEvents: 'auto' }}>
                        <div style={{ position: 'absolute', top: '20%', width: '100%' }}>
                            <PlayerStatus player={p1} isTurn={isP1Turn} prevHp={prevP1Hp} />
                        </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '8%', left: '0', right: '0', height: 'auto', zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'none' }}>
                        <div style={{ flex: 1, position: 'relative', height: '100%', minHeight: '280px', marginLeft: '450px' }}>
                            <div style={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'absolute', bottom: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.8) 0%, rgba(10,10,15,0) 100%)' }}>
                                <HandSystem 
                                    hand={p1.hand} 
                                    selectedCardId={targetingCardId} 
                                    currentEnergy={getPredictedEnergy()} 
                                    usedEnergy={0} 
                                    disabled={!isP1Turn && !isDiscarding} 
                                    isDiscarding={isDiscarding}
                                    jumperDamageStack={p1.jumperDamageStack} 
                                    queuedCardIds={p1.actionQueue.map(a => a?.cardInstanceId).filter(Boolean) as string[]} 
                                    onSelectCard={(cardId) => {
                                        if (p1.actionQueue.some(a => a?.cardInstanceId === cardId)) return;
                                        if (isDiscarding) { 
                                            socket?.emit('CARD_DISCARD', { cardInstanceId: cardId });
                                            store.discardHandCard(myId!, cardId); 
                                            return; 
                                        }
                                        const card = p1.hand.find(c => c.id === cardId);
                                        
                                        if (card && (card.originalId === 'blink' || card.id === 'blink')) return;

                                        if (card && (card.targeting.type === 'none')) {
                                            if (store.status === 'planning' && !p1.isReady) store.appendAction(myId!, { type: 'play_card', cardInstanceId: cardId });
                                            return;
                                        }

                                        if (currentCommand !== 'play_card') setCurrentCommand('play_card');
                                        if (targetingCardId === cardId) { setTargetingCardId(null); setHoveredMapCell(null); }
                                        else { setTargetingCardId(cardId); setHoveredMapCell(null); }
                                    }} 
                                />
                            </div>
                        </div>

                        <div style={{ width: '320px', height: 'auto', zIndex: 40, pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'url("https://www.transparenttextures.com/patterns/black-scales.png"), #2a2015', backgroundBlendMode: 'multiply', border: '4px solid #5a4231', borderRadius: '12px', marginRight: '2%', boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.9)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', zIndex: 10 }}>
                                {p1.actionQueue.map((action, idx) => {
                                    const isTargetStep = store.status === 'resolving' && store.resolvingStep === idx * 2;
                                    return (
                                        <div key={idx} onClick={() => { if (isP1Turn && action.type !== 'none') store.unstageAction(myId!, idx); }} style={{ flex: 1, aspectRatio: '1', maxHeight: '64px', background: 'rgba(20, 15, 10, 0.8)', border: `2px solid ${isTargetStep ? '#E6C36A' : action.type !== 'none' ? '#5a4231' : '#33241a'}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isP1Turn && action.type !== 'none') ? 'pointer' : 'default', boxShadow: isTargetStep ? '0 0 15px rgba(230, 195, 106, 0.5)' : 'none', transition: 'all 0.2s', position: 'relative' }}>
                                            {renderActionIcon(action)}
                                            {action.type === 'none' && <Text size="xs" c="gray.6" mt={4}>Empty</Text>}
                                            {isP1Turn && action.type !== 'none' && (
                                                <div style={{ position: 'absolute', top: -5, right: -5, background: '#ff4c4c', borderRadius: '50%', padding: '2px' }}><X size={10} color="#fff" /></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <Group align="center" justify="center" gap="xs" mt="auto" style={{ background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '8px', border: '1px solid #4a3b2c', overflow: 'visible' }}>
                                <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
                                    {p1.characterId === 'jumper' && p1.skillLevel >= 1 ? (
                                        <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(155, 89, 182, 0.2)', border: '1px solid #9b59b6', borderRadius: '8px' }}>
                                            <Text size="sm" fw={800} c="violet.3">🔮 블링크 대기 중</Text>
                                            <Text size="xs" c="gray.5">맵 아무 곳이나 클릭하세요</Text>
                                        </div>
                                    ) : targetingDef?.type === 'hand' ? (
                                        <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(200, 50, 50, 0.2)', border: '1px solid #ff4c4c', borderRadius: '8px' }}>
                                            <Text size="sm" fw={800} c="red.4">상대의 손패를 클릭하세요!</Text>
                                        </div>
                                    ) : (
                                        <ActionDPad onMove={handleDPadMove} disabled={!isP1Turn} />
                                    )}
                                </div>
                                <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
                                    <ActionPanel currentCommand={currentCommand} onCommandSelect={handleCommandSelect} disabled={!isP1Turn} />
                                </div>
                            </Group>

                            <div style={{ marginTop: 'auto', width: '100%', height: '50px', position: 'relative', flexShrink: 0 }}>
                                {isP1Turn && p1.actionQueue.every(a => a && a.type !== 'none') ? (
                                    <button onClick={() => { store.setReady(myId!); socket?.emit('ACTION_SUBMIT', p1.actionQueue); }} style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, backgroundImage: 'url("/map_images/btn_turn_idle.png")', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transition: 'background-image 0.2s ease, transform 0.1s ease' }} onMouseEnter={(e) => { if (store.status === 'planning' || store.status === 'resolving') return; e.currentTarget.style.backgroundImage = 'url("/map_images/btn_turn_hover.png")'; }} onMouseLeave={(e) => { if (store.status === 'planning' || store.status === 'resolving') return; e.currentTarget.style.backgroundImage = 'url("/map_images/btn_turn_idle.png")'; }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                                ) : (
                                    <button disabled style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', padding: 0, backgroundImage: 'url("/map_images/btn_turn_idle.png")', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.5, filter: 'grayscale(100%)', cursor: 'not-allowed' }} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
```

---

## src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Dark Fantasy Color Palette - AAA guidelines (From Reference Image) */
  --bg-dark: #1A1A1A;
  --bg-board: #2b2b36;
  --bg-panel: rgba(20, 20, 30, 0.85);

  /* Parchment & Leather Theme */
  --bg-parchment: #cbbca0;
  --bg-leather: #2a2118;

  --accent-blue: #3A8EE6;
  --accent-blue-glow: #4FC3FF;
  --accent-red: #D33F3F;
  --accent-red-glow: #FF3B3B;
  --accent-green: #4CAF50;
  --accent-purple: #9b59b6;
  --accent-gold: #C0A062;

  --text-main: #332211;
  /* 양피지 위 진한 갈색 텍스트 */
  --text-muted: #554433;
  --border-subtle: rgba(255, 255, 255, 0.15);
  --metal-frame: linear-gradient(180deg, #5a5a5a 0%, #2a2a2a 100%);
  --metal-border: #1a1a1a;

  --hud-frame: linear-gradient(180deg, #3d3024 0%, #241b12 100%);
}

body {
  color: var(--text-main);
  background: var(--bg-dark);
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  /* overflow: hidden; (로비 스크롤 문제로 제거, 게임화면에 개별 적용) */
}

/* 폰트 유틸리티 클래스 (Serif 제목용) */
.font-fantasy {
  font-family: 'Georgia', serif;
  /* 향후 웹폰트로 교체 가능 */
}

/* 스크롤바 숨김 처리 */
::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes pulse-red {
  0% { filter: drop-shadow(0 0 2px rgba(255,0,0,0.5)); transform: scale(1); }
  50% { filter: drop-shadow(0 0 15px rgba(255,0,0,0.9)); transform: scale(1.03); }
  100% { filter: drop-shadow(0 0 2px rgba(255,0,0,0.5)); transform: scale(1); }
}

@keyframes vignette-fade {
  0% { opacity: 0.15; }
  50% { opacity: 0.25; }
  100% { opacity: 0.15; }
}

/* 💡 내 캐릭터 황금 테두리 펄스 애니메이션 */
@keyframes pulse-gold {
  0%   { box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);  opacity: 0.8; }
  50%  { box-shadow: 0 0 18px rgba(255, 215, 0, 0.95); opacity: 1.0; }
  100% { box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);  opacity: 0.8; }
}
```

---

## src/app/layout.tsx

```tsx
import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { Providers } from '../components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Turn Card Battle V2',
  description: 'Simultaneous Turn-based Card Game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
      </head>
      <body>
        {/* Providers로 감싸야 useSession()을 앱 어디서든 사용 가능 */}
        <Providers>
          <MantineProvider defaultColorScheme="dark">
            {children}
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
```

---

## src/app/login/page.tsx

```tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
    Container,
    Paper,
    Title,
    Text,
    TextInput,
    PasswordInput,
    Button,
    Anchor,
    Stack,
    Alert,
    Center,
    Box,
} from '@mantine/core';

export default function LoginPage() {
    const router = useRouter();

    // 폼 입력 상태
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI 피드백 상태
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // NextAuth의 signIn 함수를 통해 Credentials 방식으로 로그인 시도
            // redirect: false -> 로그인 결과를 직접 받아서 수동으로 처리
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                // 서버(authorize 함수)에서 던진 에러 메시지를 표시
                setError(result.error);
            } else if (result?.ok) {
                // 로그인 성공 시 로비(/)로 이동
                router.push('/');
                router.refresh(); // Next.js 캐시 갱신으로 세션 상태가 즉시 반영되도록 함
            }
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container size={460} w="100%">
                <Center mb={40}>
                    <Stack align="center" gap={4}>
                        <Text
                            size="42px"
                            fw={900}
                            style={{
                                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '3px',
                                fontFamily: 'Georgia, serif',
                            }}
                        >
                            ⚔️ TCB
                        </Text>
                        <Text c="dimmed" size="sm" ta="center">
                            Turn-based Card Battle
                        </Text>
                    </Stack>
                </Center>

                <Paper
                    radius="md"
                    p="xl"
                    withBorder
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <Title order={2} ta="center" mb={4} c="white">
                        전장에 귀환하라
                    </Title>
                    <Text c="dimmed" size="sm" ta="center" mb="xl">
                        당신의 계정으로 로그인하세요
                    </Text>

                    {error && (
                        <Alert color="red" mb="md" radius="md" variant="filled">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="이메일"
                                placeholder="your@email.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                required
                                styles={{
                                    label: { color: '#c1c2c5' },
                                    input: {
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(124, 58, 237, 0.3)',
                                        color: 'white',
                                    },
                                }}
                            />

                            <PasswordInput
                                label="비밀번호"
                                placeholder="비밀번호를 입력해 주세요"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                required
                                styles={{
                                    label: { color: '#c1c2c5' },
                                    input: {
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(124, 58, 237, 0.3)',
                                    },
                                    innerInput: { color: 'white' },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="md"
                                mt="sm"
                                loading={isLoading}
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                    border: 'none',
                                    fontWeight: 700,
                                    letterSpacing: '1px',
                                }}
                            >
                                전장 입장
                            </Button>
                        </Stack>
                    </form>

                    <Text ta="center" mt="xl" size="sm" c="dimmed">
                        아직 계정이 없으신가요?{' '}
                        <Anchor href="/register" c="violet.4" fw={700}>
                            회원가입하기
                        </Anchor>
                    </Text>
                </Paper>
            </Container>
        </Box>
    );
}
```

---

## src/app/page.tsx

```tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Container, Title, Tabs, Grid, Card as MantineCard, Badge, Button, ScrollArea, Group, Text, Progress, Stack, Flex, Center, Loader, Modal, TextInput, ActionIcon, Divider } from '@mantine/core';
import { Trash2, Edit2, Play, LogOut } from 'lucide-react';
import { useGameStore } from '../engine/store';
import { SoundEngine } from '../engine/soundEngine';
import { useSocket } from '../components/SocketProvider';
import cardsData from '../../data/cards.json';
import type { Card } from '../types';
import { GameCard3D } from '../components/game/ui/Card';

const CHARACTERS = [
  { id: 'warrior', name: '전사' },
  { id: 'esper', name: '에스퍼' },
  { id: 'archer', name: '궁수' },
  { id: 'jumper', name: '점퍼' },
  { id: 'prophet', name: '예언가' },
];

interface DeckData {
    id: string;
    name: string;
    character: string;
    cards: string[];
    createdAt: string;
}

export default function LobbyScreen() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const initGame = useGameStore((s) => s.initGame);

  const [selectedChar, setSelectedChar] = useState<string>('warrior');
  const [deck, setDeck] = useState<string[]>([]);

  // 다중 덱 관리 상태
  const [decks, setDecks] = useState<DeckData[]>([]);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
  
  // 모달 제어 상태
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 소켓 및 매칭 상태
  const socket = useSocket();
  const [isMatching, setIsMatching] = useState(false);
  // 💡 친선전 방 코드 상태
  const [roomCode, setRoomCode] = useState('');
  // 💡 랭크 점수 상태 (기본값 1000)
  const [rankScore, setRankScore] = useState<number>(1000);

  // 미인증 라우팅
  useEffect(() => {
      if (status === 'unauthenticated') {
          router.push('/login');
      }
  }, [status, router]);

  // 접속 시 덱 리스트 로드
  const fetchDecks = async () => {
      try {
          const res = await fetch('/api/deck');
          if (res.ok) {
              const data = await res.json();
              setDecks(data.decks || []);
          }
      } catch (e) {
          console.error('Failed to load decks', e);
      }
  };

  useEffect(() => {
      if (status === 'authenticated') {
          fetchDecks();
          // 💡 로그인 완료 시 랭크 점수 조회
          fetch('/api/user/me')
              .then(res => res.json())
              .then(data => setRankScore(data?.rankScore ?? 1000))
              .catch(() => {}); // 조회 실패해도 기본값 유지
      }
  }, [status]);

  // 소켓 매칭 완료 리스너
  useEffect(() => {
      if (!socket) return;
      
      const onMatchFound = (data: any) => {
          console.log('[Lobby] MATCH_FOUND!', data);
          setIsMatching(false);
          // 서버 초기 상태 덮어쓰기
          useGameStore.getState().syncState(data.state, data.myId);
          router.push('/game');
      };

      socket.on('MATCH_FOUND', onMatchFound);
      return () => { socket.off('MATCH_FOUND', onMatchFound); };
  }, [socket, router]);

  // 로비 BGM
  useEffect(() => {
    SoundEngine.preload();
    const playLobbyBgm = () => {
        SoundEngine.playBGM('bgm_lobby');
        window.removeEventListener('click', playLobbyBgm);
    };
    window.addEventListener('click', playLobbyBgm);
    return () => window.removeEventListener('click', playLobbyBgm);
  }, []);

  const allCards = cardsData.cards as unknown as Card[];
  const availableCards = allCards.filter(c => (c.scope === 'common' || c.scope === selectedChar) && (c.max_count !== undefined && c.max_count > 0));

  const handleCharChange = (val: string | null) => {
    if (!val) return;
    SoundEngine.play('ui_button_click');
    setSelectedChar(val);
    const validDeck = deck.filter(id => {
      const card = allCards.find(c => c.id === id);
      return card && (card.scope === 'common' || card.scope === val);
    });
    setDeck(validDeck);
    setEditingDeckId(null); // 캐릭터 변경 시 새 덱 작성 취급
  };

  const handleAddCard = (cardId: string) => {
    if (deck.length >= 20) { SoundEngine.play('ui_error'); return; }
    const cardInfo = allCards.find(c => c.id === cardId);
    if (!cardInfo) return;
    const currentCount = deck.filter(id => id === cardId).length;
    if (currentCount >= (cardInfo.max_count || 3)) { SoundEngine.play('ui_error'); return; }

    SoundEngine.play('ui_card_select');
    setDeck([...deck, cardId]);
  };

  const handleRemoveCard = (index: number) => {
    SoundEngine.play('action_discard');
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
  };

  const handleStartGame = () => {
    if (deck.length !== 20 || !socket) {
        console.error('[Lobby] 매칭 시작 실패: 덱이 20장이 아니거나 소켓이 연결되지 않음', { deckLen: deck.length, socketConnected: !!socket });
        return;
    }
    console.log('[Lobby] 매칭 요청 발송! MATCH_FIND:', { charId: selectedChar, deckLen: deck.length, socketId: socket.id });
    SoundEngine.play('ui_turn_ready');
    setIsMatching(true);
    socket.emit('MATCH_FIND', { charId: selectedChar, deck });
  };

  // 💡 매칭 취소 - 대기 중 버튼 클릭 시 서버 큐에서 제거
  const handleCancelMatch = () => {
    socket?.emit('CANCEL_MATCH');
    setIsMatching(false);
    SoundEngine.play('action_discard');
    console.log('[Lobby] 매칭 취소 요청 발송');
  };

  // 덱 저장 (POST or PUT)
  const executeSaveDeck = async () => {
      if (deck.length !== 20 || !newDeckName.trim()) return;
      setIsSaving(true);
      
      try {
          const method = editingDeckId ? 'PUT' : 'POST';
          const url = editingDeckId ? `/api/deck/${editingDeckId}` : '/api/deck';
          
          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newDeckName, character: selectedChar, cards: deck })
          });
          
          if (res.ok) {
              await fetchDecks();
              setIsSaveModalOpen(false);
              setNewDeckName('');
              // 저장 후 편집 모드 유지 (응답에서 새 ID를 받는다면 갱신 가능하나 편의상 fetchDecks 의존)
          } else {
              alert('덱 저장에 실패했습니다.');
          }
      } catch (err) {
          console.error(err);
          alert('네트워크 오류가 발생했습니다.');
      } finally {
          setIsSaving(false);
      }
  };

  // 모달 열기 핸들러
  const openSaveModal = () => {
      if (editingDeckId) {
          const currentEditingDeck = decks.find(d => d.id === editingDeckId);
          setNewDeckName(currentEditingDeck?.name || '내 덱');
      } else {
          setNewDeckName(`${CHARACTERS.find(c => c.id === selectedChar)?.name} 덱 1`);
      }
      setIsSaveModalOpen(true);
  };

  // 특정 덱으로 편집 (LOAD)
  const handleEditDeck = (d: DeckData) => {
      setSelectedChar(d.character);
      setDeck(d.cards);
      setEditingDeckId(d.id);
      setIsListModalOpen(false);
  };

  // 특정 덱 삭제
  const handleDeleteDeck = async (id: string) => {
      if (!confirm('이 덱을 영구히 삭제하시겠습니까?')) return;
      try {
          const res = await fetch(`/api/deck/${id}`, { method: 'DELETE' });
          if (res.ok) {
              await fetchDecks();
              if (editingDeckId === id) setEditingDeckId(null);
          } else {
              alert('덱 삭제 실패');
          }
      } catch (e) {
          console.error(e);
      }
  };

  const handleStartWithSpecificDeck = (d: DeckData) => {
      if (!socket) {
          console.error('[Lobby] 특정 덱 매칭 시작 실패: 소켓이 연결되지 않음');
          return;
      }
      console.log(`[Lobby] 특정 덱 매칭 발송! MATCH_FIND:`, { charId: d.character, deckLen: d.cards.length, socketId: socket.id });
      SoundEngine.play('ui_turn_ready');
      setIsMatching(true);
      socket.emit('MATCH_FIND', { charId: d.character, deck: d.cards });
      setIsListModalOpen(false);
  };

  if (status === 'loading' || status === 'unauthenticated') {
      return (
          <Center style={{ width: '100vw', height: '100vh', flexDirection: 'column', gap: '20px' }}>
              <Loader color="violet" size="xl" type="bars" />
              <Title order={3} c="dimmed">인증 상태를 확인하고 있습니다...</Title>
          </Center>
      );
  }

  return (
    <Container size="xl" py="xl">
      <Flex direction="column" gap="xl">
        {/* 상단 헤더: 타이틀 + 랭크 점수 + 로그아웃 버튼 */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={1} c="blue.4" style={{ letterSpacing: '4px' }}>DECK BUILDER LOBBY</Title>
            {/* 💡 랭크 점수 배지 */}
            <Badge size="xl" color="yellow" variant="dot" mt={4}>내 랭크 점수: {rankScore} PT</Badge>
          </div>
          <Group gap="sm">
            <Text size="sm" c="dimmed">{session?.user?.name}님 환영합니다!</Text>
            {/* 💡 로그아웃 버튼 */}
            <Button
              variant="subtle"
              color="red"
              size="sm"
              leftSection={<LogOut size={16} />}
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              로그아웃
            </Button>
          </Group>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Group justify="space-between" mb="lg">
                <Tabs value={selectedChar} onChange={handleCharChange} variant="pills" color="indigo" radius="xl" style={{ flex: 1 }}>
                <Tabs.List grow>
                    {CHARACTERS.map(char => (
                    <Tabs.Tab key={char.id} value={char.id} fz="md" fw={700}>{char.name}</Tabs.Tab>
                    ))}
                </Tabs.List>
                </Tabs>
                <Button variant="light" color="violet" size="md" radius="xl" onClick={() => setIsListModalOpen(true)}>
                    👀 전체 마이덱 보기 ({decks.length}개)
                </Button>
            </Group>

            <ScrollArea h="calc(100vh - 220px)" type="auto" offsetScrollbars>
              <Grid>
                {availableCards.map(card => {
                  const countInDeck = deck.filter(id => id === card.id).length;
                  const maxCount = card.max_count || 3;
                  const isFull = deck.length >= 20;
                  const isLimit = countInDeck >= maxCount;

                  return (
                    <Grid.Col span={{ base: 6, sm: 4, md: 3, lg: 3 }} key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div 
                          style={{ transform: 'scale(1.00)', transformOrigin: 'top center', height: '220px', marginBottom: '10px' }}
                          onMouseEnter={() => { if (!isFull && !isLimit) SoundEngine.play('ui_card_hover'); }}
                      >
                        <GameCard3D
                            card={card as Card}
                            disabled={isFull || isLimit}
                            onClick={() => handleAddCard(card.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ position: 'relative' }} 
                        />
                      </div>
                      <Badge color={isLimit ? 'red' : 'indigo'} variant="filled" size="md">
                          {countInDeck} / {maxCount}
                      </Badge>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </ScrollArea>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <MantineCard shadow="md" radius="lg" bg="dark.6" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
              <Group justify="space-between" mb="sm">
                <Title order={3} c="gray.3">
                    {editingDeckId ? `편집 중: ${decks.find(d => d.id === editingDeckId)?.name}` : '새 덱 구성 중'}
                </Title>
                {editingDeckId && (
                    <Badge color="orange" variant="light" onClick={() => setEditingDeckId(null)} style={{ cursor: 'pointer' }}>
                        취소(새 덱)
                    </Badge>
                )}
              </Group>
              <Progress value={(deck.length / 20) * 100} color={deck.length === 20 ? 'green' : 'blue'} size="xl" radius="xl" striped={deck.length < 20} animated={deck.length < 20} mb="md" />
              <Text ta="right" size="sm" fw={700} mb="lg" c={deck.length === 20 ? 'green.4' : 'gray.5'}>
                {deck.length} / 20 Cards
              </Text>

              <ScrollArea style={{ flex: 1, minHeight: 0 }} offsetScrollbars scrollbarSize={8} p="xs">
                <Stack gap="xs">
                  {deck.map((id, index) => {
                    const c = allCards.find(card => card.id === id);
                    if (!c) return null;
                    return (
                      <Group key={`${id}-${index}`} justify="space-between" p="xs" bg="dark.5" style={{ borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#333'; SoundEngine.play('ui_card_hover'); }} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--mantine-color-dark-5)'} onClick={() => handleRemoveCard(index)}>
                        <Text size="sm" fw={600} truncate w={150}>{c.name}</Text>
                        <Badge size="sm" color="red.9" variant="filled">{c.cost}</Badge>
                      </Group>
                    );
                  })}
                  {deck.length === 0 && <Text ta="center" c="dimmed" mt="xl">카드를 선택하여 덱을 구성하세요.</Text>}
                </Stack>
              </ScrollArea>

              <Stack gap="sm" mt="lg">
                  {/* 저장 버튼 (편집/신규 모달 트리거) */}
                  <Button 
                    fullWidth size="md" radius="md" 
                    color={deck.length === 20 ? (editingDeckId ? 'orange.5' : 'indigo.5') : 'dark.4'} 
                    onClick={openSaveModal} 
                    disabled={deck.length < 20} 
                    style={{ transition: 'all 0.3s ease' }}
                  >
                      {editingDeckId ? '현재 덱 업데이트' : '새 마이덱으로 저장'}
                  </Button>

                  <Divider label="게임 시작" labelPosition="center" my={4} />

                  {/* 💡 친선전 방 코드 입력 */}
                  <TextInput
                    placeholder="친구에게 방 코드를 알려주세요"
                    label="친선전 방 코드"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.currentTarget.value)}
                    size="sm"
                    disabled={deck.length < 20 || isMatching}
                  />
                  {/* 친선전 입장 버튼 */}
                  <Button
                    fullWidth size="md" radius="md"
                    color={deck.length === 20 && roomCode.trim() ? 'violet.5' : 'dark.4'}
                    disabled={deck.length < 20 || !roomCode.trim() || isMatching}
                    loading={isMatching}
                    onClick={() => {
                      if (!socket) return;
                      SoundEngine.play('ui_turn_ready');
                      setIsMatching(true);
                      socket.emit('JOIN_CUSTOM_ROOM', { charId: selectedChar, deck, roomCode: roomCode.trim() });
                    }}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    🤝 친선전 입장
                  </Button>

                  {/* 💡 매칭 중이면 취소 버튼, 아니면 랭크 게임 시작 버튼 */}
                  {isMatching ? (
                    <Button
                      fullWidth size="lg" radius="md"
                      color="red.6"
                      onClick={handleCancelMatch}
                      style={{ transition: 'all 0.3s ease', animation: 'pulse-red 1.5s infinite' }}
                    >
                      ⏳ 매칭 취소 (대기 중...)
                    </Button>
                  ) : (
                    <Button
                      fullWidth size="lg" radius="md"
                      color={deck.length === 20 ? 'teal.5' : 'dark.4'}
                      onClick={handleStartGame}
                      disabled={deck.length < 20}
                      style={{ transition: 'all 0.3s ease', boxShadow: deck.length === 20 ? '0 0 15px rgba(32, 201, 151, 0.5)' : 'none' }}
                    >
                      ⚔️ 랭크 게임 시작
                    </Button>
                  )}
              </Stack>
            </MantineCard>
          </Grid.Col>
        </Grid>
      </Flex>

      {/* 덱 저장 모달 */}
      <Modal opened={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title={editingDeckId ? "마이덱 업데이트" : "마이덱 저장"} centered overlayProps={{ blur: 3 }}>
        <Stack gap="md">
            <TextInput 
                label="덱 이름" 
                placeholder="덱의 고유한 이름을 지어주세요" 
                value={newDeckName} 
                onChange={(e) => setNewDeckName(e.currentTarget.value)} 
                data-autofocus
            />
            {editingDeckId && (
                <Text size="sm" c="dimmed">
                    ※ 새로운 이름으로 변경하여 기존 덱에 덮어쓸 수 있습니다.<br/>
                    완전히 새로운 덱으로 저장하려면 우측 패널에서 '취소(새 덱)'을 누른 뒤 다시 시도해주세요.
                </Text>
            )}
            <Button color="indigo" fullWidth mt="md" loading={isSaving} onClick={executeSaveDeck} disabled={!newDeckName.trim()}>
                {editingDeckId ? '업데이트 저장' : '이름 정하고 저장'}
            </Button>
        </Stack>
      </Modal>

      {/* 마이덱 목록 보기 모달 */}
      <Modal opened={isListModalOpen} onClose={() => setIsListModalOpen(false)} title="내 마이덱 보관함" size="xl" centered overlayProps={{ blur: 3 }}>
          {decks.length === 0 ? (
              <Center py="xl"><Text c="dimmed">아직 저장된 덱이 없습니다. 멋진 덱을 만들어 직접 이름을 붙여보세요!</Text></Center>
          ) : (
              <Grid>
                  {decks.map(d => (
                      <Grid.Col span={{ base: 12, sm: 6 }} key={d.id}>
                          <MantineCard shadow="sm" radius="md" withBorder padding="md" bg="dark.7">
                              <Group justify="space-between" mb="xs">
                                  <Text fw={700} truncate style={{ flex: 1 }}>{d.name}</Text>
                                  <Badge color="violet">{CHARACTERS.find(c => c.id === d.character)?.name || d.character}</Badge>
                              </Group>
                              <Text size="xs" c="dimmed" mb="md">
                                  저장일: {new Date(d.createdAt).toLocaleDateString()}
                              </Text>

                              <Group grow>
                                  <Button size="xs" color="teal" leftSection={<Play size={14}/>} onClick={() => handleStartWithSpecificDeck(d)}>시작</Button>
                                  <Button size="xs" color="indigo" variant="light" leftSection={<Edit2 size={14}/>} onClick={() => handleEditDeck(d)}>편집</Button>
                                  <ActionIcon size="lg" color="red" variant="subtle" title="삭제" onClick={() => handleDeleteDeck(d.id)}>
                                      <Trash2 size={18} />
                                  </ActionIcon>
                              </Group>
                          </MantineCard>
                      </Grid.Col>
                  ))}
              </Grid>
          )}
      </Modal>
    </Container>
  );
}
```

---

## src/app/register/page.tsx

```tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Paper,
    Title,
    Text,
    TextInput,
    PasswordInput,
    Button,
    Anchor,
    Stack,
    Alert,
    Center,
    Box,
} from '@mantine/core';

export default function RegisterPage() {
    const router = useRouter();

    // 폼 입력 상태
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI 피드백 상태
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // 비밀번호 일치 여부 클라이언트 검증 (서버 호출 전 빠른 검증)
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // 회원가입 API 호출
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // 서버에서 내려준 에러 메시지 표시
                setError(data.message || '회원가입에 실패했습니다.');
            } else {
                // 성공 시 안내 후 로그인 페이지로 이동
                setSuccess('회원가입 완료! 로그인 페이지로 이동합니다...');
                setTimeout(() => router.push('/login'), 1500);
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container size={460} w="100%">
                <Center mb={40}>
                    <Stack align="center" gap={4}>
                        <Text
                            size="42px"
                            fw={900}
                            style={{
                                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '3px',
                                fontFamily: 'Georgia, serif',
                            }}
                        >
                            ⚔️ TCB
                        </Text>
                        <Text c="dimmed" size="sm" ta="center">
                            Turn-based Card Battle
                        </Text>
                    </Stack>
                </Center>

                <Paper
                    radius="md"
                    p="xl"
                    withBorder
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <Title order={2} ta="center" mb={4} c="white">
                        새 계정 만들기
                    </Title>
                    <Text c="dimmed" size="sm" ta="center" mb="xl">
                        전장에 입장할 장수를 등록하세요
                    </Text>

                    {error && (
                        <Alert color="red" mb="md" radius="md" variant="filled">
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert color="teal" mb="md" radius="md" variant="filled">
                            {success}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="닉네임"
                                placeholder="전장에서 불릴 이름"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                required
                                styles={{
                                    label: { color: '#c1c2c5' },
                                    input: {
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(124, 58, 237, 0.3)',
                                        color: 'white',
                                    },
                                }}
                            />

                            <TextInput
                                label="이메일"
                                placeholder="your@email.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                required
                                styles={{
                                    label: { color: '#c1c2c5' },
                                    input: {
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(124, 58, 237, 0.3)',
                                        color: 'white',
                                    },
                                }}
                            />

                            <PasswordInput
                                label="비밀번호"
                                placeholder="6자 이상 입력해 주세요"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                required
                                styles={{
                                    label: { color: '#c1c2c5' },
                                    input: {
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(124, 58, 237, 0.3)',
                                    },
                                    innerInput: { color: 'white' },
                                }}
                            />

                            <PasswordInput
                                label="비밀번호 확인"
                                placeholder="비밀번호를 한번 더 입력해 주세요"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                                required
                                styles={{
                                    label: { color: '#c1c2c5' },
                                    input: {
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(124, 58, 237, 0.3)',
                                    },
                                    innerInput: { color: 'white' },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="md"
                                mt="sm"
                                loading={isLoading}
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                    border: 'none',
                                    fontWeight: 700,
                                    letterSpacing: '1px',
                                }}
                            >
                                전장에 등록하기
                            </Button>
                        </Stack>
                    </form>

                    <Text ta="center" mt="xl" size="sm" c="dimmed">
                        이미 계정이 있으신가요?{' '}
                        <Anchor href="/login" c="violet.4" fw={700}>
                            로그인하기
                        </Anchor>
                    </Text>
                </Paper>
            </Container>
        </Box>
    );
}
```

---

## src/components/game/ui/ActionDPad.tsx

```tsx
"use client";

import { Group, ActionIcon, Stack } from '@mantine/core';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ActionDPadProps {
    onMove: (dx: number, dy: number) => void;
    disabled?: boolean;
}

export function ActionDPad({ onMove, disabled }: ActionDPadProps) {
    const btnStyle = {
        background: 'rgba(20, 20, 30, 0.8)',
        border: '1px solid #444',
        boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
        color: '#ccc',
        transition: 'all 0.2s',
    };

    const activeStyle = {
        ...btnStyle,
        '&:hover': {
            background: 'rgba(60, 60, 80, 0.9)',
            borderColor: '#666',
            color: '#fff',
        }
    };

    return (
        <Stack gap={4} align="center" justify="center" p="xs" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid #333' }}>
            <ActionIcon
                size="lg"
                disabled={disabled}
                onClick={() => onMove(0, -1)}
                styles={{ root: disabled ? btnStyle : activeStyle }}
            >
                <ArrowUp size={20} />
            </ActionIcon>
            <Group gap={4}>
                <ActionIcon
                    size="lg"
                    disabled={disabled}
                    onClick={() => onMove(-1, 0)}
                    styles={{ root: disabled ? btnStyle : activeStyle }}
                >
                    <ArrowLeft size={20} />
                </ActionIcon>
                {/* Center empty space */}
                <div style={{ width: '38px', height: '38px' }} />
                <ActionIcon
                    size="lg"
                    disabled={disabled}
                    onClick={() => onMove(1, 0)}
                    styles={{ root: disabled ? btnStyle : activeStyle }}
                >
                    <ArrowRight size={20} />
                </ActionIcon>
            </Group>
            <ActionIcon
                size="lg"
                disabled={disabled}
                onClick={() => onMove(0, 1)}
                styles={{ root: disabled ? btnStyle : activeStyle }}
            >
                <ArrowDown size={20} />
            </ActionIcon>
        </Stack>
    );
}
```

---

## src/components/game/ui/ActionPanel.tsx

```tsx
"use client";

import { Stack, Button, Text } from '@mantine/core';
import { MousePointer2, Sword, BookOpen, BatteryCharging } from 'lucide-react';

export type ActionCommandType = 'move' | 'play_card' | 'draw' | 'rest';

interface ActionPanelProps {
    currentCommand: ActionCommandType | null;
    onCommandSelect: (cmd: ActionCommandType) => void;
    disabled?: boolean;
}

export function ActionPanel({ currentCommand, onCommandSelect, disabled }: ActionPanelProps) {
    const commands: { id: ActionCommandType; label: string; icon: React.ReactNode; costLabel: string }[] = [
        { id: 'move', label: '이동', icon: <MousePointer2 size={18} />, costLabel: '(턴 소모)' },
        { id: 'play_card', label: '카드 사용', icon: <Sword size={18} />, costLabel: '(기력 소모)' },
        { id: 'draw', label: '카드 뽑기', icon: <BookOpen size={18} />, costLabel: '(턴 소모)' },
        { id: 'rest', label: '기력 회복', icon: <BatteryCharging size={18} />, costLabel: '(턴 소모)' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
            {commands.map(cmd => {
                const isSelected = currentCommand === cmd.id;
                // 'play_card'는 황금색, 나머지는 푸른색 톤으로 시안 반영
                const isCardCmd = cmd.id === 'play_card';
                const baseColor = isCardCmd ? '#E6C36A' : '#3FA7FF';
                const darkColor = isCardCmd ? '#4A3B1C' : '#1A334A';

                return (
                    <Button
                        key={cmd.id}
                        size="md"
                        disabled={disabled}
                        onClick={() => onCommandSelect(cmd.id)}
                        styles={{
                            root: {
                                height: '48px',
                                padding: '0 8px',
                                border: isSelected ? `2px solid ${baseColor}` : '1px solid #444',
                                background: isSelected
                                    ? `linear-gradient(180deg, ${darkColor} 0%, #111 100%)`
                                    : 'linear-gradient(180deg, #222 0%, #111 100%)',
                                boxShadow: isSelected ? `0 0 10px ${baseColor}60, inset 0 2px 4px rgba(255,255,255,0.1)` : 'inset 0 2px 4px rgba(255,255,255,0.05)',
                                transition: 'all 0.2s ease',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            },
                            inner: { width: '100%' },
                            label: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }
                        }}
                    >
                        <div style={{ color: isSelected ? baseColor : '#888', display: 'flex', alignItems: 'center' }}>
                            {cmd.icon}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
                            <Text size="sm" fw={800} c={isSelected ? '#fff' : 'gray.4'} style={{ fontFamily: 'var(--font-fantasy)', textShadow: isSelected ? `0 0 5px ${baseColor}` : 'none' }}>
                                {cmd.label}
                            </Text>
                            <Text size="xs" c={isSelected ? '#ccc' : '#666'}>
                                {cmd.costLabel}
                            </Text>
                        </div>
                    </Button>
                );
            })}
        </div>
    );
}
```

---

## src/components/game/ui/Card.tsx

```tsx
"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Card } from '../../../types';
import { Tooltip } from '@mantine/core';

const CARD_COLORS: Record<string, { bg: string; border: string; accent: string }> = {
    attack: { bg: 'linear-gradient(145deg,#2c1010,#4a1a1a)', border: '#e53e3e', accent: '#fc8181' },
    magic: { bg: 'linear-gradient(145deg,#12103a,#1e1870)', border: '#7c3aed', accent: '#c4b5fd' },
    support: { bg: 'linear-gradient(145deg,#0c2a1e,#133d2e)', border: '#2f855a', accent: '#68d391' },
    defense: { bg: 'linear-gradient(145deg,#1a1a2e,#2a2a4a)', border: '#3182ce', accent: '#90cdf4' },
    default: { bg: 'linear-gradient(145deg,#1a1a1a,#2d2d2d)', border: '#4a5568', accent: '#a0aec0' },
};

const imgUrl = (name: string | undefined) => name ? `/images/${name.replace(/\.png$/i, '.jpg')}` : undefined;

interface GameCardProps {
    card: Card;
    disabled: boolean;
    selected?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
    initial?: any; animate?: any; transition?: any; whileHover?: any; whileTap?: any;
    drag?: boolean; onDragStart?: () => void; onDragEnd?: (e: any, info: any) => void;
    errorShake?: boolean; exit?: any;
    jumperDamageStack?: number;
    isQueued?: boolean;
}

export function GameCard3D({
    card, disabled, selected, onClick,
    style, initial, animate, transition, whileHover, whileTap,
    drag, onDragStart, onDragEnd, errorShake, exit, jumperDamageStack, isQueued
}: GameCardProps) {
    const [imgError, setImgError] = useState(false);

    const colors = CARD_COLORS[card.type || 'default'] ?? CARD_COLORS.default;
    const costStr = card.cost === 'all_energy' ? 'ALL' : (card.cost ?? '?');
    const defaultFrameNames: Record<string, string> = { attack: 'attack_frame.png', magic: 'magic_frame.png', support: 'support_frame.png', defense: 'support_frame.png' };
    const frameBasename = card.type ? (defaultFrameNames[card.type] || 'support_frame.png') : 'support_frame.png';
    const frameUrl = imgUrl(card.ui?.frame) || `/images/${frameBasename}`;
    const illustrationUrl = imgUrl(card.ui?.illustration) || `/images/${card.id}.jpg`;
    const typeEmoji = card.type === 'attack' ? '⚔️' : card.type === 'magic' ? '✨' : card.type === 'support' ? '💚' : card.type === 'defense' ? '🛡️' : '🃏';

    const baseId = card.originalId || card.id;
    let displayEffect = card.effect || card.logic_detail || '설명이 없습니다.';
    if ((baseId === 'weakness_strike' || baseId === 'wide_strike') && jumperDamageStack !== undefined) {
        const currentDmg = 1 * Math.pow(2, jumperDamageStack);
        displayEffect = displayEffect.replace('1*', `${currentDmg}`);
    }

    const filterStyle = isQueued
        ? 'brightness(0.3) grayscale(0.8)'
        : (disabled && !errorShake ? 'brightness(0.5) grayscale(0.5)' : 'none');

    return (
        <Tooltip label={displayEffect} multiline w={200} position="top" withArrow transitionProps={{ duration: 200 }} disabled={drag || disabled} zIndex={1000}>
            <motion.div layout drag={disabled ? false : drag} dragSnapToOrigin onDragStart={onDragStart} onDragEnd={onDragEnd} initial={initial} transition={transition} whileHover={whileHover} whileTap={whileTap} animate={errorShake ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.2 } } : animate} exit={exit} onClick={onClick} style={{ width: '140px', height: '200px', flexShrink: 0, position: 'absolute', pointerEvents: disabled && !errorShake ? 'none' : 'auto', cursor: disabled ? 'not-allowed' : (drag ? 'grab' : 'pointer'), borderRadius: '12px', overflow: 'hidden', boxShadow: errorShake ? `0 0 20px rgba(255,0,0,0.8), 0 4px 12px rgba(0,0,0,0.8)` : selected ? `0 0 25px ${colors.accent}, 0 6px 16px rgba(0,0,0,0.9)` : `0 8px 24px rgba(0,0,0,0.9)`, filter: filterStyle, transformOrigin: 'bottom center', ...style }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${frameUrl}")`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '12px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }} />
                {selected && <div style={{ position: 'absolute', inset: 0, border: `3px solid var(--accent-gold)`, borderRadius: '12px', boxShadow: `0 0 20px var(--accent-gold), inset 0 0 10px var(--accent-gold)`, pointerEvents: 'none', zIndex: 10 }} />}
                <div style={{ position: 'absolute', top: '2%', left: '3%', right: '3%', height: '58%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px 8px 0 0', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.5)', backgroundColor: '#111' }}>
                    {illustrationUrl && !imgError ? <img src={illustrationUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgError(true)} /> : <span style={{ fontSize: '50px' }}>{typeEmoji}</span>}
                </div>
                <div style={{ position: 'absolute', top: '-8px', left: '-8px', zIndex: 15, width: '32px', height: '32px', borderRadius: '50%', background: `radial-gradient(circle at top left, #555, #111)`, border: `2px solid #E6C36A`, color: '#fff', fontSize: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.3)', textShadow: '0 2px 4px #000', fontFamily: 'var(--font-fantasy)' }}>{costStr}</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 3, background: 'linear-gradient(to bottom, rgba(20,20,25,0.9) 0%, rgba(10,10,15,1) 100%)', borderTop: `2px solid ${colors.border}`, display: 'flex', flexDirection: 'column', padding: '4px 8px', borderRadius: '0 0 12px 12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: colors.accent, textShadow: '0 2px 4px #000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-fantasy)', textAlign: 'center', marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px' }}>{card.name}</div>
                    <div style={{ fontSize: '10px', color: '#ccc', lineHeight: 1.3, textShadow: '0 1px 2px #000', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'center' }}>
                        {displayEffect}
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: '6px', left: 0, right: 0, textAlign: 'center', fontSize: '9px', color: '#666', fontWeight: 800, letterSpacing: '1px', textShadow: '0px 1px 1px #000', zIndex: 3 }}>{card.type?.toUpperCase()}</div>
            </motion.div>
        </Tooltip>
    );
}
```

---

## src/components/game/ui/FieldBoard.tsx

```tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualEffect, PlayerStatus, Action } from '../../../types';

interface FieldBoardProps {
    p1Pos: { x: number; y: number };
    p2Pos: { x: number; y: number };
    previewTiles: Set<string>;
    validTargets?: Set<string>;
    targetTiles?: Set<string>;
    onTileClick: (x: number, y: number) => void;
    onTileHover: (x: number, y: number) => void;
    onTileLeave: () => void;
    isTargeting: boolean;
    virtualP1Pos?: { x: number; y: number };
    visualEffects?: VisualEffect[];
    isP1Turn?: boolean;
    isP2Turn?: boolean;
    p1Statuses?: PlayerStatus[];
    p2Statuses?: PlayerStatus[];
    removeVisualEffect?: (id: string) => void;
    p1CharId?: string;
    p2CharId?: string;
    p1Hp?: number;
    p2Hp?: number;
    resolvingStep?: number;
    p1Action?: Action[];
    p2Action?: Action[];
    status?: string;
    p1ResolvingSteps?: number[];
    p2ResolvingSteps?: number[];
    // 💡 1턴 한정 '나' 표시를 위한 현재 턴 카운트
    turnCount?: number;
}

export function FieldBoard({
    p1Pos, p2Pos, virtualP1Pos, previewTiles, validTargets, targetTiles,
    onTileClick, onTileHover, onTileLeave, isTargeting,
    visualEffects = [], isP1Turn = false, isP2Turn = false,
    p1Statuses = [], p2Statuses = [], removeVisualEffect = () => { },
    p1CharId = 'warrior', p2CharId = 'warrior', p1Hp, p2Hp, resolvingStep, p1Action, p2Action, status,
    p1ResolvingSteps = [0, 2, 4], p2ResolvingSteps = [1, 3, 5],
    turnCount = 0  // 💡 1턴일 때만 '나' 표시 (0이면 보이지 않음)
}: FieldBoardProps) {
    const GRID_SIZE = 3;

    const getAnimationState = (isPlayer1: boolean) => {
        const hp = isPlayer1 ? p1Hp : p2Hp;
        const pos = isPlayer1 ? p1Pos : p2Pos;
        if (hp !== undefined && hp <= 0) return 'death_down';
        const isGettingHit = visualEffects.some(ef => ef.x === pos.x && ef.y === pos.y && (ef.type === 'slash' || ef.type === 'explosion' || ef.type === 'magic'));
        if (isGettingHit) return 'hit';
        if (status === 'resolving' && resolvingStep !== undefined) {
            const isMyTurn = isPlayer1 ? p1ResolvingSteps.includes(resolvingStep) : p2ResolvingSteps.includes(resolvingStep);
            if (isMyTurn) {
                const actionIndex = Math.floor(resolvingStep / 2);
                const currentActionArr = isPlayer1 ? p1Action : p2Action;
                const currentAction = currentActionArr ? currentActionArr[actionIndex] : null;
                if (currentAction && currentAction.type === 'move') return 'walk';
                if (currentAction && currentAction.type === 'play_card') return 'skill_cast_loop';
            }
        }
        return 'idle';
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 150px)`, gridTemplateRows: `repeat(${GRID_SIZE}, 150px)`, gap: '4px', padding: '24px', background: 'rgba(20, 20, 30, 0.4)', borderRadius: '12px', border: '2px solid rgba(255, 215, 0, 0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', margin: 'auto' }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE; const y = Math.floor(i / GRID_SIZE);
                const isP1 = p1Pos.x === x && p1Pos.y === y;
                const isP2 = p2Pos.x === x && p2Pos.y === y;
                const isVirtualP1 = virtualP1Pos && virtualP1Pos.x === x && virtualP1Pos.y === y && !isP1;
                const isPreview = previewTiles.has(`${x},${y}`);
                const isTarget = targetTiles?.has(`${x},${y}`);
                const isValidTarget = validTargets ? validTargets.has(`${x},${y}`) : true;
                const isOutOfRange = isTargeting && !isValidTarget;
                const tileEffects = visualEffects.filter(ef => ef.x === x && ef.y === y);

                return (
                    <motion.div key={`${x}-${y}`} whileHover={{ scale: 1.05, z: 15 }} onClick={() => onTileClick(x, y)} onMouseEnter={() => onTileHover(x, y)} onMouseLeave={onTileLeave} style={{ width: '150px', height: '150px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isTargeting ? (isOutOfRange ? 'not-allowed' : 'crosshair') : 'default', position: 'relative', overflow: 'visible' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("/map_images/${isTarget ? 'tile_red' : isPreview ? 'tile_blue' : 'tile_normal'}.png")`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'scale(1.514) rotate(45deg)', filter: isOutOfRange ? 'brightness(0.5)' : 'brightness(0.9)', transition: 'background-image 0.2s ease, filter 0.2s ease', animation: isTarget ? 'pulse-red 1.5s infinite' : 'none', pointerEvents: 'none', zIndex: 0 }} />
                        
                        {(isTarget || isPreview) && (
                            <img src="/effect_images/Crosshair.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'screen', backgroundColor: 'transparent', pointerEvents: 'none', zIndex: 25, opacity: isTarget ? 1 : 0.6, objectFit: 'cover' }} />
                        )}


                        {/* 💡 1턴 한정 '나▼' 표시 + 황금 테두리 없이 스프라이트만 대력 렌더링 */}
                        {isP1 && (
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', zIndex: 6 }}>
                                {/* 💡 1턴 계획 단계(status=planning, turnCount=1)에서만 '나 ▼' 표시 */}
                                {status === 'planning' && turnCount === 1 && (
                                    <motion.div
                                        initial={{ y: 0, opacity: 0 }}
                                        animate={{ y: -65, opacity: 1 }}
                                        transition={{ duration: 0.4, ease: 'easeOut' }}
                                        style={{
                                            position: 'absolute',
                                            backgroundColor: '#E6C36A',
                                            color: '#000',
                                            padding: '2px 10px',
                                            borderRadius: '6px',
                                            fontWeight: 900,
                                            fontSize: '16px',
                                            border: '2px solid #fff',
                                            boxShadow: '0 0 15px gold',
                                            zIndex: 100,
                                            whiteSpace: 'nowrap',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        나 ▼
                                    </motion.div>
                                )}
                                {/* 🔴 황금 테두리 div 제거 - 스프라이트만 렌더링 */}
                                <CharacterSprite charId={p1CharId} animation={getAnimationState(true)} />
                            </div>
                        )}
                        {isVirtualP1 && <CharacterSprite charId={p1CharId} animation="idle" ghostMode />}
                        {/* 상대방(P2) 붉은 테두리 */}
                        {isP2 && (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6 }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: '-10px',
                                    border: '2px solid rgba(255,80,80,0.7)',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 10px rgba(255,80,80,0.4)',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                }} />
                                <CharacterSprite charId={p2CharId} animation={getAnimationState(false)} glowColor="rgba(255, 120, 120, 0.7)" />
                            </div>
                        )}

                        <div style={{ position: 'absolute', bottom: 4, right: 6, fontSize: '10px', color: '#555', zIndex: 70 }}>{x},{y}</div>

                        <AnimatePresence>
                            {tileEffects.map(ef => (
                                <TileOneShotEffect key={ef.id} type={ef.type} x={x} y={y} sourceX={ef.sourceX} sourceY={ef.sourceY} onComplete={() => removeVisualEffect(ef.id)} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}

interface SpriteFrame { x: number; y: number; w: number; h: number; }
function CharacterSprite({ charId, animation = 'idle', glowColor, ghostMode = false }: { charId: string; animation?: string; glowColor?: string; ghostMode?: boolean; }) {
    const [frames, setFrames] = useState<SpriteFrame[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setFrames([]); setCurrentFrame(0); setVisible(true);
        fetch(`/chracter_images/${charId}.json`).then(res => { if (!res.ok) throw new Error('not found'); return res.json(); })
            .then(data => {
                const animData = data[animation];
                if (animData?.frames?.length) setFrames(animData.frames);
                else {
                    const idleFrames = data['idle']?.frames;
                    if (idleFrames?.length) setFrames(idleFrames); else setVisible(false);
                }
            }).catch(err => setVisible(false));
    }, [charId, animation]);

    useEffect(() => {
        if (frames.length <= 1) return;
        const interval = setInterval(() => setCurrentFrame(prev => (prev + 1) % frames.length), 250);
        return () => clearInterval(interval);
    }, [frames]);

    if (!visible || frames.length === 0) return null;
    const frame = frames[currentFrame];
    const bgPosX = -frame.x; const bgPosY = -frame.y;
    const renderHeight = 121; 
    const renderWidth = Math.round(renderHeight * (frame.w / frame.h));
    const scale = renderHeight / frame.h;

    const filterStr = ghostMode ? 'grayscale(100%) drop-shadow(0 0 6px rgba(255,255,255,0.2)) contrast(1.2)' : glowColor ? `drop-shadow(0 0 10px ${glowColor}) contrast(1.2)` : 'contrast(1.2)';

    return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: `${renderWidth}px`, height: `${renderHeight}px`, backgroundImage: `url("/chracter_images/${charId}.png")`, backgroundPosition: `${bgPosX * scale}px ${bgPosY * scale}px`, backgroundSize: `${1000 * scale}px auto`, backgroundRepeat: 'no-repeat', pointerEvents: 'none', filter: filterStr, opacity: ghostMode ? 0.5 : 1, zIndex: 5, flexShrink: 0, marginTop: '10px' }} />
    );
}

function TileOneShotEffect({ type, x, y, sourceX, sourceY, onComplete }: { type: string; x: number, y: number, sourceX?: number, sourceY?: number, onComplete: () => void }) {
    const [imgError, setImgError] = useState(false);
    let src = ''; let animConfig: any = {}; let initialConfig: any = { opacity: 0, scale: 0.5 }; let duration = 0.5; let extraStyle: React.CSSProperties = {};

    switch (type) {
        case 'projectile':
            src = '/effect_images/projectile.png';
            const dx = sourceX !== undefined ? (sourceX - x) * 154 : 0;
            const dy = sourceY !== undefined ? (sourceY - y) * 154 : 0;
            initialConfig = { x: dx, y: dy, opacity: 1, scale: 0.5 };
            animConfig = { x: 0, y: 0, opacity: 0, scale: 1.2 };
            duration = 0.3;
            extraStyle = { zIndex: 80, mixBlendMode: 'screen' };
            break;
        case 'slash':
            src = '/effect_images/vfx_slash.png';
            initialConfig = { opacity: 0, scale: 0.5, rotate: -30 };
            animConfig = { scale: [0.5, 1.4, 1.8], opacity: [1, 1, 0], rotate: [15, 25] };
            duration = 0.3; break;
        case 'explosion': case 'magic':
            src = '/effect_images/vfx_explosion.png';
            initialConfig = { opacity: 0, scale: 0.2 };
            animConfig = { scale: [0.2, 1.6, 2.2], opacity: [1, 1, 0] };
            duration = 0.6; break;
        case 'heal': case 'buff': case 'shield':
            src = '/effect_images/vfx_heal.png';
            initialConfig = { opacity: 0, scale: 0.8, y: 20 };
            animConfig = { y: [20, -60], opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1.2] };
            duration = 0.8; break;
        case 'crack':
            src = '/effect_images/crack_effect.png';
            initialConfig = { opacity: 1, scale: 1 };
            animConfig = { opacity: [1, 1, 0], scale: [1, 1.2, 1.4] };
            duration = 0.4; break;
        case 'impact_ring': case 'hit':
            src = '/effect_images/impact_ring.png';
            initialConfig = { opacity: 1, scale: 0 };
            animConfig = { scale: [0, 2.8], opacity: [1, 0] };
            duration = 0.5; extraStyle = { width: '160px', height: '160px' }; break;
        default:
            src = '/effect_images/vfx_slash.png'; animConfig = { opacity: [1, 0] }; break;
    }

    useEffect(() => {
        if (imgError) {
            const timer = setTimeout(() => onComplete(), duration * 1000);
            return () => clearTimeout(timer);
        }
    }, [imgError]);

    if (imgError) return <div style={{ display: 'none' }} />;

    return (
        <motion.img src={src} initial={initialConfig} animate={animConfig} exit={{ opacity: 0 }} transition={{ duration, ease: 'easeOut' }} onAnimationComplete={onComplete} onError={() => setImgError(true)} style={{ position: 'absolute', inset: 0, margin: 'auto', width: '120px', height: '120px', objectFit: 'contain', backgroundColor: 'transparent', pointerEvents: 'none', zIndex: 60, ...extraStyle }} />
    );
}
```

---

## src/components/game/ui/HandSystem.tsx

```tsx
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { GameCard3D } from './Card';
import type { Card } from '../../../types';
import { SoundEngine } from '../../../engine/soundEngine';

interface HandSystemProps {
    hand: Card[];
    selectedCardId: string | null;
    onSelectCard: (id: string) => void;
    isTargeting?: boolean;
    disabled?: boolean;
    currentEnergy: number;
    usedEnergy: number;
    jumperDamageStack?: number;
    queuedCardIds?: string[];
    isDiscarding?: boolean;
}

export function HandSystem({ hand, selectedCardId, onSelectCard, disabled, currentEnergy, usedEnergy, jumperDamageStack, queuedCardIds = [], isDiscarding = false }: HandSystemProps) {
    const total = hand.length;
    const centerIdx = (total - 1) / 2;
    const calcCost = (c: Card) => c.cost === 'all_energy' ? currentEnergy : (typeof c.cost === 'number' ? c.cost : 0);

    return (
        <div style={{ position: 'relative', width: '100%', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', perspective: '1000px' }}>
            <AnimatePresence>
                {hand.map((card, i) => {
                    const isSelected = selectedCardId === card.id;
                    const isQueued = (queuedCardIds || []).includes(card.id);
                    const offset = i - centerIdx;
                    const rotateZ = offset * 6;
                    const translateX = offset * 70;
                    const translateY = Math.abs(offset) * 10 + (isSelected ? -40 : 0);
                    const cardCost = calcCost(card);

                    const isPassive = card.originalId === 'blink' || card.id === 'blink';
                    const isPlayable = isDiscarding ? true : (!isPassive && currentEnergy - usedEnergy >= cardCost);

                    const errorShake = !isPlayable && !disabled && isSelected;
                    const errShakeY = errorShake ? [translateY - 5, translateY + 5, translateY - 5, translateY + 5, translateY] : translateY;
                    const zIndex = isSelected ? 100 : i + 10;

                    return (
                        <div 
                            key={card.id} 
                            style={{ position: 'absolute', zIndex: zIndex }}
                            onMouseEnter={() => { if (!disabled && !isQueued) SoundEngine.play('ui_card_hover'); }}
                        >
                            <GameCard3D
                                card={card}
                                disabled={disabled || (!isPlayable && !isSelected) || isQueued}
                                selected={isSelected}
                                errorShake={errorShake}
                                jumperDamageStack={jumperDamageStack}
                                isQueued={isQueued}
                                onClick={() => { 
                                    if (!disabled && !isQueued) {
                                        SoundEngine.play(isPlayable ? 'ui_card_select' : 'ui_error');
                                        onSelectCard(card.id); 
                                    }
                                }}
                                initial={{ opacity: 0, x: -250, y: 150, scale: 0.5 }}
                                animate={{ opacity: 1, x: translateX, y: errShakeY, rotate: rotateZ, scale: errorShake ? [1, 1.05, 1, 1.05, 1] : 1 }}
                                whileHover={(disabled || isQueued) ? undefined : { scale: 1.25, y: translateY - 40, rotateZ: 0, rotateY: 5, zIndex: 80, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                exit={{ opacity: 0, y: -200, scale: 1.2 }}
                            />
                        </div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
```

---

## src/components/game/ui/PlayerStatus.tsx

```tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Title, Badge, Text, Tooltip, Group } from '@mantine/core';
import { Shield as ShieldIcon } from 'lucide-react'; 
import type { PlayerState } from '../../../types';
import { getStatusData, getSkillData } from '../../../engine/dataLoader';

interface PlayerStatusProps {
    player: PlayerState;
    isTurn: boolean;
    reverse?: boolean; 
    prevHp?: number;
}

export function PlayerStatus({ player, isTurn, reverse = false, prevHp }: PlayerStatusProps) {
    const [dmgText, setDmgText] = useState<number | null>(null);
    const [showFlash, setShowFlash] = useState(false);
    const [showDiscardViewer, setShowDiscardViewer] = useState(false);
    const prevHpRef = useRef(player.hp);

    useEffect(() => {
        // 💡 최대 체력이 아닌 직전 체력(prevHpRef.current)과 비교하여 정확한 피격 데미지 산출
        if (prevHpRef.current > player.hp) {
            const dmg = prevHpRef.current - player.hp;
            setDmgText(dmg);
            setShowFlash(true);
            setTimeout(() => setDmgText(null), 1000);
            setTimeout(() => setShowFlash(false), 300);
        }
        prevHpRef.current = player.hp;
    }, [player.hp]);

    return (
        <div style={{
            position: 'relative', display: 'flex', flexDirection: reverse ? 'row-reverse' : 'row',
            alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px',
            background: 'url("/map_images/frame_top.png")', backgroundSize: '100% 100%',
            backgroundPosition: 'center', backgroundRepeat: 'no-repeat', border: 'none',
            borderRadius: '12px', transition: 'filter 0.3s ease',
            filter: isTurn ? 'drop-shadow(0 0 10px var(--accent-gold))' : 'none'
        }}>
            {showFlash && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 76, 76, 0.3)', borderRadius: reverse ? '0 0 24px 24px' : '24px 24px 0 0', pointerEvents: 'none', zIndex: 10, animation: 'red-flash 0.3s ease-out forwards' }} />
            )}

            {dmgText !== null && (
                <div style={{ position: 'absolute', top: reverse ? '60%' : '-40px', left: reverse ? '10%' : '80%', fontSize: '48px', fontWeight: 900, color: '#ff4c4c', textShadow: '0 0 15px #ff0000, 0 4px 8px #000', animation: 'dmg-pop 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards', pointerEvents: 'none', zIndex: 20 }}>-{dmgText}</div>
            )}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `6px solid #4a3b2c`, boxShadow: `0 8px 16px rgba(0,0,0,0.7), inset 0 4px 8px rgba(0,0,0,0.9)${isTurn ? ', 0 0 25px rgba(138, 108, 66, 0.8)' : ''}`, background: 'linear-gradient(180deg, #333, #111)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldIcon size={48} color={isTurn ? 'var(--accent-gold)' : '#888'} style={{ filter: 'drop-shadow(0 2px 4px #000)' }} />
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid rgba(90, 66, 49, 0.3)', paddingBottom: '4px', flexWrap: 'wrap' }}>
                        <Title order={2} style={{ fontFamily: 'var(--font-fantasy)', letterSpacing: '1px', color: 'var(--text-main)', textShadow: '0 1px 2px rgba(255,255,255,0.2)' }}>
                            {player.id.toUpperCase()}
                        </Title>

                        <Tooltip label={`[${getSkillData(player.characterId)?.skill_name}] Lv.${player.skillLevel} 활성화!`} position="top" withArrow>
                            <Badge color={player.skillLevel > 0 ? 'red' : 'gray'} variant="filled" size="lg" style={{ cursor: 'help', boxShadow: player.skillLevel > 0 ? '0 0 10px rgba(255,0,0,0.5)' : 'none', border: player.skillLevel > 0 ? '1px solid #ffcc00' : 'none' }}>
                                특수능력 Lv.{player.skillLevel}
                            </Badge>
                        </Tooltip>

                        {player.statuses && player.statuses.length > 0 && (
                            <Group gap={6} ml="auto">
                                {player.statuses.map((st, i) => {
                                    const sData = getStatusData(st.id);
                                    let borderColor = '#9b59b6'; let bgColor = 'rgba(155, 89, 182, 0.4)'; let labelText = st.id.substring(0, 2).toUpperCase();
                                    if (st.id === 'poison') { borderColor = '#2ecc71'; bgColor = 'rgba(46, 204, 113, 0.4)'; labelText = '독'; }
                                    else if (st.id === 'burn') { borderColor = '#e74c3c'; bgColor = 'rgba(231, 76, 60, 0.4)'; labelText = '화상'; }
                                    else if (st.id === 'freeze') { borderColor = '#3498db'; bgColor = 'rgba(52, 152, 219, 0.4)'; labelText = '빙결'; }
                                    return (
                                        <Tooltip key={i} label={`${sData?.name || st.id} (${st.value}스택)`} position="top">
                                            <div style={{ position: 'relative', width: '28px', height: '28px', border: `2px solid ${borderColor}`, backgroundColor: bgColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', cursor: 'help' }}>
                                                <Text size="10px" fw={900} c="#fff" style={{ textShadow: '0 1px 2px #000' }}>{labelText}</Text>
                                                <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', background: '#111', border: `1px solid ${borderColor}`, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#fff' }}>{st.value}</div>
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                            </Group>
                        )}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ position: 'relative', width: '80px', height: '24px', background: 'url("/map_images/deck_icon.png") no-repeat center', backgroundSize: 'contain', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text size="xs" fw={800} c="#cbbca0" style={{ textShadow: '0 1px 2px #000', pointerEvents: 'none' }}>{player.drawPile.length}</Text>
                            </div>
                            <div onMouseEnter={() => setShowDiscardViewer(true)} onMouseLeave={() => setShowDiscardViewer(false)} style={{ position: 'relative', width: '80px', height: '24px', background: 'url("/map_images/grave_icon.png") no-repeat center', backgroundSize: 'contain', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}>
                                <Text size="xs" fw={800} c="#ff6b6b" style={{ textShadow: '0 1px 2px #000', pointerEvents: 'none' }}>{player.discardPile.length}</Text>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {player.shield > 0 && (
                            <Badge color="blue" size="lg" variant="filled" leftSection={<ShieldIcon size={14} />} style={{ alignSelf: 'flex-start', boxShadow: '0 0 10px rgba(50, 150, 255, 0.8)', border: '1px solid #fff' }}>
                                방어력: {player.shield}
                            </Badge>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', height: '20px' }}>
                            <Text fw={900} size="sm" c="#d5c7a3" style={{ minWidth: '30px', fontFamily: 'var(--font-fantasy)', textShadow: '0 1px 2px #000', zIndex: 2 }}>HP</Text>
                            <div style={{ flex: 1, position: 'relative', height: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${Math.max(0, player.hp)}%`, backgroundImage: 'url("/map_images/hp_fill.png")', backgroundSize: '100% 100%', transition: 'width 0.4s ease-out' }} />
                                <Text style={{ position: 'absolute', inset: 0, textAlign: 'center', color: '#fff', fontSize: '12px', fontWeight: 900, textShadow: '0 1px 2px #000', lineHeight: '20px' }}>{Math.max(0, player.hp)} / 100</Text>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', height: '20px' }}>
                            <Text fw={900} size="sm" c="#d5c7a3" style={{ minWidth: '30px', fontFamily: 'var(--font-fantasy)', textShadow: '0 1px 2px #000', zIndex: 2 }}>EP</Text>
                            <div style={{ flex: 1, position: 'relative', height: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${Math.max(0, player.energy)}%`, backgroundImage: 'url("/map_images/ep_fill.png")', backgroundSize: '100% 100%', transition: 'width 0.4s ease-out' }} />
                                <Text style={{ position: 'absolute', inset: 0, textAlign: 'center', color: '#fff', fontSize: '12px', fontWeight: 900, textShadow: '0 1px 2px #000', lineHeight: '20px' }}>{Math.max(0, player.energy)} / 100</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
```

---

## src/components/game/ui/TurnIndicator.tsx

```tsx
"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TurnIndicator({ turnLabel }: { turnLabel: string | null }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (turnLabel) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 1500); // 1.5초 후 사라짐
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [turnLabel]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed', inset: 0,
                        zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        // 다크 비네트 배경
                        background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%)',
                        pointerEvents: 'none',
                    }}
                >
                    <motion.h1
                        initial={{ scale: 0.5, y: 50, opacity: 0 }}
                        animate={{ scale: 1.2, y: 0, opacity: 1 }}
                        exit={{ scale: 1.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        style={{
                            fontFamily: 'var(--font-fantasy)',
                            fontSize: '6rem',
                            fontWeight: 900,
                            color: '#E6C36A',
                            textShadow: '0 0 20px rgba(230, 195, 106, 0.8), 0 10px 30px rgba(0,0,0,1)',
                            letterSpacing: '8px',
                            margin: 0,
                        }}
                    >
                        {turnLabel}
                    </motion.h1>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
```

---

## src/components/game/ui/VFXManager.tsx

```tsx
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../engine/store';

export function VFXManager() {
    const store = useGameStore();
    const myId = store.myId;
    const p1 = myId ? store.players[myId] : null;
    const opponentId = Object.keys(store.players).find(id => id !== myId);
    const p2 = opponentId ? store.players[opponentId] : null;

    const isP1Danger = p1 && p1.hp > 0 && p1.hp <= 20;
    const isExplosionActive = store.visualEffects.some(ef => ef.type === 'explosion' || ef.type === 'magic');

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
            <AnimatePresence>
                {isP1Danger && (
                    <motion.div key="vignette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/effect_images/vignette_danger.png")', backgroundSize: '100% 100%', backgroundPosition: 'center', zIndex: 110, mixBlendMode: 'multiply', animation: 'vignette-fade 1.5s ease-in-out infinite' }} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isExplosionActive && (
                    <motion.div key="focus-mask" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/effect_images/focus_mask.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 105, mixBlendMode: 'multiply' }} />
                )}
            </AnimatePresence>

            {/* 💡 필살기 컷인 연출 */}
            <AnimatePresence>
                {store.activeSkillCutin && (
                    <motion.div key="skill-cutin-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: 0, width: '100%', height: '15%', backgroundColor: 'black' }} />
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '15%', backgroundColor: 'black' }} />
                        <motion.img src={`/chracter_images/${store.activeSkillCutin}_skill.png`} style={{ width: '100vw', height: 'auto', maxHeight: '70vh', objectFit: 'contain', transformStyle: 'preserve-3d', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.8))' }} animate={{ x: ["-100vw", "0vw", "0vw", "100vw"], skewX: ["-15deg", "-15deg", "-15deg", "-15deg"] }} transition={{ duration: 1.5, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
```

---

## src/components/Providers.tsx

```tsx
"use client";

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

import { SocketProvider } from './SocketProvider';

interface ProvidersProps {
    children: React.ReactNode;
    // 서버에서 미리 가져온 세션을 클라이언트에 전달하여 깜빡임 현상 방지
    session?: Session | null;
}

// 앱 전체에 NextAuth 세션 상태를 공급하는 컴포넌트
export function Providers({ children, session }: ProvidersProps) {
    return (
        <SessionProvider session={session}>
            <SocketProvider>
                {children}
            </SocketProvider>
        </SessionProvider>
    );
}
```

---

## src/components/SocketProvider.tsx

```tsx
// src/components/SocketProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

const SocketContext = createContext<Socket | null>(null);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && !socket) {
            // 배포 시에는 NEXT_PUBLIC_SOCKET_URL을 비워두면 자동으로 같은 도메인을 바라봅니다.
            const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
                withCredentials: true,
                transports: ['websocket'],
                reconnection: true,
            });

            socketInstance.on('connect', () => console.log('[Socket] Connected.'));
            setSocket(socketInstance);

            return () => { socketInstance.disconnect(); };
        }
    }, [status]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
```

---

## src/engine/dataLoader.ts

```typescript
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
```

---

## src/engine/skillEngine.ts

```typescript
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
```

---

## src/engine/soundEngine.ts

```typescript
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
```

---

## src/engine/statusEngine.ts

```typescript
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
```

---

## src/engine/store.ts

```typescript
"use client";
import { create } from 'zustand';
import type { GameState, PlayerState, Action, Card, VisualEffect } from '../types';
import { SoundEngine } from './soundEngine';

export const INITIAL_PLAYER_STATE: PlayerState = {
    id: '', characterId: 'warrior', hp: 100, shield: 0, energy: 100, position: { x: 0, y: 0 },
    drawPile: [], hand: [], discardPile: [], statuses: [], skillLevel: 0, shuffleCount: 0,
    jumperDamageStack: 0, actionQueue: [{ type: 'none' as const }, { type: 'none' as const }, { type: 'none' as const }], isReady: false
};

interface GameStore extends GameState {
    myId: string | null;
    // TCB v3.0: 서버 주도형(Server Authority)을 위한 상태 덮어쓰기 메서드
    syncState: (serverState: GameState, myId?: string) => void;
    playReplays: (snapshots: GameState[]) => void;
    
    // 오프라인/디버그용 더미 (이제 실제 연산 안 함)
    initGame: (selectedDeckIds?: string[], characterId?: string) => void;
    appendAction: (playerId: string, action: Action) => void;
    unstageAction: (playerId: string, index: number) => void;
    setReady: (playerId: string) => void;
    discardHandCard: (playerId: string, cardInstanceId: string) => void;
    
    // 클라이언트 UI 전용 (이펙트/애니메이션 제거)
    removeVisualEffect: (id: string) => void;
    closePeekingCards: () => void;
    showSkillCutin: (charId: string) => void;
    
    // 로비 귀환 초기화용
    reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    myId: null,
    status: 'lobby', resolvingStep: 0, resolvingPhase: 0, visualEffects: [],
    players: { },
    lastPlayedCard: { player1: null, player2: null }, activeSkillCutin: null, isScreenShaking: false, peekingCards: null, turnCount: 1, logs: ['서버 접속을 대기 중입니다...'],

    syncState: (serverState: GameState, myId?: string) => {
        if (myId) {
            set({ ...serverState, myId });
        } else {
            set((state) => ({ ...serverState, myId: state.myId }));
        }
    },

    playReplays: (snapshots: GameState[]) => {
        if (!snapshots || !Array.isArray(snapshots) || snapshots.length === 0) {
            console.warn('[Store] playReplays 예외 발생: 유효하지 않은 snapshots 데이터(빈 배열 또는 undefined)가 수신되었습니다.', snapshots);
            return;
        }
        console.log(`[Store] [Replay] Starting animation sequence! 총 ${snapshots.length}개의 스냅샷을 순차적으로 렌더링합니다.`);
        let delay = 0;
        snapshots.forEach((snap, idx) => {
            setTimeout(() => {
                const currentMyId = get().myId;
                set({ ...snap, myId: currentMyId });
                // 진행 중에 이전 스냅샷의 이펙트 잔재 및 흔들림 정리 보장
                if (snap.status === 'resolving') {
                    if (snap.activeSkillCutin) {
                        SoundEngine.play('ui_turn_ready');
                    }
                    if (snap.visualEffects && snap.visualEffects.length > 0) {
                        const hasExplosionOrMagic = snap.visualEffects.some(v => v.type === 'explosion' || v.type === 'magic');
                        if (hasExplosionOrMagic) SoundEngine.play('skill_explosion');
                        else SoundEngine.play('combat_slash');
                        
                        // 추가로 에스퍼 사운드 연동
                        const isEsperAttack = snap.lastPlayedCard?.player1?.id === 'telekinesis_manipulation' || snap.lastPlayedCard?.player2?.id === 'telekinesis_manipulation';
                        if (isEsperAttack) SoundEngine.play('char_esper_psychic');
                    }
                }
            }, delay);
            // 각 스텝당 1000ms 간격 재생 (보기 편하도록)
            delay += 1000;
        });
    },

    initGame: (selectedDeckIds?: string[], characterId?: string) => {
        console.log('[Store] 클라이언트 단독 initGame 비활성화됨. 서버 매칭을 기다리세요.');
    },

    appendAction: (playerId: string, action: Action) => set((state) => {
        if (state.status !== 'planning') return state;
        const p = state.players[playerId];
        if (!p || p.isReady) return state;
        
        const newPlayers = JSON.parse(JSON.stringify(state.players));
        const emptyIdx = newPlayers[playerId].actionQueue.findIndex((a: Action) => a && a.type === 'none');
        if (emptyIdx === -1) return state;
        
        newPlayers[playerId].actionQueue[emptyIdx] = action;
        SoundEngine.play('ui_button_click');
        return { players: newPlayers };
    }),

    unstageAction: (playerId: string, index: number) => set((state) => {
        if (state.status !== 'planning') return state;
        const p = state.players[playerId];
        if (!p || p.isReady) return state;
        
        const newPlayers = JSON.parse(JSON.stringify(state.players));
        newPlayers[playerId].actionQueue[index] = { type: 'none' };
        for (let i = index; i < 2; i++) { 
            if (newPlayers[playerId].actionQueue[i + 1].type !== 'none') { 
                newPlayers[playerId].actionQueue[i] = newPlayers[playerId].actionQueue[i + 1]; 
                newPlayers[playerId].actionQueue[i + 1] = { type: 'none' }; 
            } 
        }
        SoundEngine.play('action_discard');
        return { players: newPlayers };
    }),

    setReady: (playerId: string) => set((state) => {
        // 클라이언트에서 Ready 상태만 만들고 소켓으로 ACTION_SUBMIT을 보내는 뼈대
        if (state.status !== 'planning') return state;
        const newPlayers = JSON.parse(JSON.stringify(state.players));
        const p = newPlayers[playerId];
        
        if (p.actionQueue.some((a: Action) => a.type === 'none')) return state; 
        
        p.isReady = true; 
        SoundEngine.play('ui_turn_ready'); 
        
        // TODO: 여기서 Socket.io로 actionQueue 전송 로직 필요 (컴포넌트 단에서 store.getState().players[playerId].actionQueue 참조하여 전송할 것)
        return { players: newPlayers };
    }),

    discardHandCard: (playerId: string, cardInstanceId: string) => set((state) => {
        const newPlayers = JSON.parse(JSON.stringify(state.players));
        const p = newPlayers[playerId];
        if (!p) return state;
        const idx = p.hand.findIndex((c: any) => c.id === cardInstanceId);
        if (idx !== -1) {
            const discarded = p.hand.splice(idx, 1)[0];
            p.discardPile.push(discarded);
            SoundEngine.play('action_discard');
            console.log(`[Store] Optimistically discarded card ${cardInstanceId}`);
        }
        return { players: newPlayers };
    }),

    removeVisualEffect: (id: string) => set((s) => ({ visualEffects: s.visualEffects.filter(e => e.id !== id) })),
    closePeekingCards: () => set({ peekingCards: null }),
    showSkillCutin: (charId: string) => set({ activeSkillCutin: charId }),

    reset: () => set((state) => ({ 
        status: 'lobby', resolvingStep: 0, resolvingPhase: 0, visualEffects: [],
        players: {}, lastPlayedCard: { player1: null, player2: null }, 
        activeSkillCutin: null, isScreenShaking: false, peekingCards: null, turnCount: 1, 
        logs: ['서버 접속을 대기 중입니다...'] 
    }))
}));
```

---

## src/lib/authOptions.ts

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: { email: { label: '이메일', type: 'email' }, password: { label: '비밀번호', type: 'password' } },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) throw new Error('이메일과 비밀번호를 입력해 주세요.');
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) throw new Error('가입되지 않은 이메일 주소입니다.');
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) throw new Error('비밀번호가 일치하지 않습니다.');
                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) { 
            if (user) token.id = user.id; 
            return token; 
        },
        async session({ session, token }) { 
            if (session.user) (session.user as any).id = token.id; 
            return session; 
        },
    },
    pages: { signIn: '/login', error: '/login' },
};
```

---

## src/lib/prisma.ts

```typescript
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. DB 연결 주소 (안전하게 하드코딩 포함)
const connectionString = process.env.DATABASE_URL || "postgresql://admin:password@localhost:5435/cardgame?schema=public";

// 2. Postgres 연결 풀(Pool) 및 Prisma 어댑터 생성 (v7 필수 사항)
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 3. PrismaClient에 어댑터를 장착하여 생성!
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

---

## src/server/GameEngine.ts

```typescript
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
```

---

## src/server/RoomManager.ts

```typescript
// src/server/RoomManager.ts
import { ServerGameEngine } from './GameEngine';
import { Action, GameState } from '../types';
import { Server } from 'socket.io';

export interface RoomState {
    roomId: string;
    engine: ServerGameEngine;
    playerSockets: string[];    // 소켓 ID 목록
    playerUserIds: string[];    // 유저 DB ID 목록 (랭크 점수 갱신용)
    isFriendly: boolean;        // 친선전 여부
    expireTimer: NodeJS.Timeout | null;
}

export class RoomManager {
    private rooms = new Map<string, RoomState>();
    private userRoomMap = new Map<string, string>();   // socketId → roomId

    // 💡 랭크 매칭 대기열 (점수 + 입장시간 포함)
    private matchQueue: {
        socketId: string;
        deck: string[];
        charId: string;
        rank: number;
        userId: string;
        joinedAt: number;
    }[] = [];

    // 💡 친선전 대기열 (방 코드 → 플레이어 목록)
    private customRooms = new Map<string, any[]>();

    private io: Server;
    private prisma: any; // 생성자에서 주입받음

    constructor(io: Server, prisma?: any) {
        this.io = io;
        this.prisma = prisma;
        // 💡 5초마다 랭크 매칭 시도 (대기시간이 길수록 범위 확대)
        setInterval(() => this.processRankMatch(), 5000);
    }

    // ────────────────────────────────────────────
    //  💡 랭크 매칭 큐 등록
    // ────────────────────────────────────────────
    public joinMatchQueue(
        socketId: string,
        deck: string[],
        charId: string,
        rank: number,
        userId: string
    ) {
        console.log(`[RoomManager] joinMatchQueue: ${socketId} / rank:${rank}`);

        // 이미 큐에 있거나 방에 있으면 무시
        if (this.matchQueue.some(q => q.socketId === socketId)) {
            console.log(`[RoomManager] 이미 큐에 있습니다: ${socketId}`);
            return;
        }
        if (this.userRoomMap.has(socketId)) {
            console.log(`[RoomManager] 이미 방에 있습니다: ${socketId}`);
            return;
        }

        this.matchQueue.push({ socketId, deck, charId, rank, userId, joinedAt: Date.now() });
        this.io.to(socketId).emit('MATCH_STATUS', '매칭 대기 중...');
        console.log(`[RoomManager] 대기열 등록 완료. 현재 큐: ${this.matchQueue.length}명`);
    }

    // 💡 [매칭 취소] 랭크 큐 및 친선전 대기열에서 소켓 제거
    public cancelMatch(socketId: string) {
        // 랭크 매칭 큐에서 제거
        const qIdx = this.matchQueue.findIndex(q => q.socketId === socketId);
        if (qIdx !== -1) {
            this.matchQueue.splice(qIdx, 1);
            console.log(`[MatchCancel] ${socketId} 랭크 큐 이탈. 남은 인원: ${this.matchQueue.length}명`);
        }

        // 친선전 대기열에서도 제거 (forEach는 Map 내장 메서드라 에러 없음)
        this.customRooms.forEach((players, code) => {
            const filtered = players.filter((p: any) => p.socketId !== socketId);
            if (filtered.length === 0) this.customRooms.delete(code);
            else this.customRooms.set(code, filtered);
        });
    }

    // 💡 [랭크 매칭 처리] 5초마다 호출, 대기시간이 길수록 허용 점수 차이 확대
    private processRankMatch() {
        if (this.matchQueue.length < 2) return;

        for (let i = 0; i < this.matchQueue.length; i++) {
            for (let j = i + 1; j < this.matchQueue.length; j++) {
                const p1 = this.matchQueue[i];
                const p2 = this.matchQueue[j];

                // 대기 시간(초)에 따라 허용 점수 차이 계산 (1초당 10점 확대, 최대 500점)
                const waitSec = (Date.now() - p1.joinedAt) / 1000;
                const allowedDiff = Math.min(100 + waitSec * 10, 500);

                if (Math.abs(p1.rank - p2.rank) <= allowedDiff) {
                    // 큐에서 두 플레이어 제거 후 배틀 시작
                    this.matchQueue.splice(j, 1);
                    this.matchQueue.splice(i, 1);
                    console.log(`[RoomManager] 랭크 매칭 성공! ${p1.socketId} vs ${p2.socketId}`);
                    this.startBattle(p1, p2, false);
                    return;
                }
            }
        }
    }

    // ────────────────────────────────────────────
    //  💡 친선전 방 입장/매칭
    // ────────────────────────────────────────────
    public joinCustomRoom(
        socketId: string,
        deck: string[],
        charId: string,
        roomCode: string,
        userId: string
    ) {
        let players = this.customRooms.get(roomCode) || [];
        players.push({ socketId, deck, charId, userId, rank: 1000 });

        if (players.length >= 2) {
            // 2명이 모이면 즉시 배틀 시작
            const p1 = players[0];
            const p2 = players[1];
            this.customRooms.delete(roomCode);
            console.log(`[RoomManager] 친선전 매칭! 코드:${roomCode}, ${p1.socketId} vs ${p2.socketId}`);
            this.startBattle(p1, p2, true);
        } else {
            // 첫 번째 플레이어는 대기
            this.customRooms.set(roomCode, players);
            this.io.to(socketId).emit('MATCH_STATUS', `친선전 대기 중... (방 코드: ${roomCode})`);
            console.log(`[RoomManager] 친선전 대기 중. 코드: ${roomCode}`);
        }
    }

    // ────────────────────────────────────────────
    //  배틀 시작 (랭크/친선 공통)
    // ────────────────────────────────────────────
    private startBattle(p1: any, p2: any, isFriendly: boolean) {
        const roomId = this.generateRoomId();
        const engine = new ServerGameEngine();

        engine.initPlayer(p1.socketId, p1.charId, p1.deck, 0, 2);
        engine.initPlayer(p2.socketId, p2.charId, p2.deck, 2, 0);
        engine.startGame();

        this.rooms.set(roomId, {
            roomId,
            engine,
            playerSockets: [p1.socketId, p2.socketId],
            playerUserIds: [p1.userId, p2.userId],
            isFriendly,
            expireTimer: null,
        });

        [p1.socketId, p2.socketId].forEach(sid => {
            this.userRoomMap.set(sid, roomId);
        });

        const initialState = engine.getState();
        this.io.to(p1.socketId).emit('MATCH_FOUND', { roomId, state: initialState, myId: p1.socketId });
        this.io.to(p2.socketId).emit('MATCH_FOUND', { roomId, state: initialState, myId: p2.socketId });
        console.log(`[RoomManager] 배틀 시작! Room:${roomId} / 친선전: ${isFriendly}`);
    }

    // ────────────────────────────────────────────
    //  액션 처리
    // ────────────────────────────────────────────
    public getRoomBySocketId(socketId: string): RoomState | undefined {
        const roomId = this.userRoomMap.get(socketId);
        return roomId ? this.rooms.get(roomId) : undefined;
    }

    public handleActionSubmit(socketId: string, actionQueue: Action[]) {
        const room = this.getRoomBySocketId(socketId);
        if (!room) return;

        const engine = room.engine;
        engine.setAction(socketId, actionQueue);

        if (engine.isBothReady()) {
            console.log(`[RoomManager] 양쪽 액션 제출 완료. Room:${room.roomId}`);
            const snapshots = engine.resolveTurnFull();

            room.playerSockets.forEach(sid => {
                this.io.to(sid).emit('TURN_RESULT', { snapshots });
            });

            // 💡 게임 종료 체크 및 랭크 점수 반영
            const finalState = engine.getState();
            if (finalState.status === 'game_over') {
                this.applyRankResult(room, finalState);
            }
        }
    }

    // 💡 [랭크 점수 처리] 승자 +20점, 패자 -20점 (친선전은 제외)
    private async applyRankResult(room: RoomState, state: GameState) {
        if (room.isFriendly || !this.prisma) return;

        try {
            const [p1SocketId, p2SocketId] = room.playerSockets;
            const [p1UserId, p2UserId] = room.playerUserIds;
            const p1State = state.players[p1SocketId];
            const p2State = state.players[p2SocketId];

            if (!p1State || !p2State) return;

            // HP가 더 높은 쪽이 승자
            const p1Won = p1State.hp > p2State.hp;
            const RANK_CHANGE = 20;

            await Promise.all([
                this.prisma.user.update({
                    where: { id: p1UserId },
                    data: { rankScore: { increment: p1Won ? RANK_CHANGE : -RANK_CHANGE } }
                }),
                this.prisma.user.update({
                    where: { id: p2UserId },
                    data: { rankScore: { increment: p1Won ? -RANK_CHANGE : RANK_CHANGE } }
                }),
            ]);

            console.log(`[Rank] ${p1UserId} ${p1Won ? '+' : '-'}${RANK_CHANGE}, ${p2UserId} ${p1Won ? '-' : '+'}${RANK_CHANGE}`);
        } catch (err) {
            console.error('[Rank] 점수 갱신 실패:', err);
        }
    }

    public handleCardDiscard(socketId: string, cardInstanceId: string) {
        const room = this.getRoomBySocketId(socketId);
        if (!room) return;

        const success = room.engine.discardCard(socketId, cardInstanceId);
        if (success) {
            room.playerSockets.forEach(sid => {
                this.io.to(sid).emit('STATE_SYNC', { state: room.engine.getState() });
            });
        }
    }

    // ────────────────────────────────────────────
    //  연결 관리 / 클린업
    // ────────────────────────────────────────────
    public leaveRoom(socketId: string) {
        const roomId = this.userRoomMap.get(socketId);
        if (roomId) {
            const room = this.rooms.get(roomId);
            if (room) {
                room.playerSockets = room.playerSockets.filter(id => id !== socketId);
                this.destroyRoom(roomId);
            }
            this.userRoomMap.delete(socketId);
            console.log(`[RoomManager] ${socketId} 방 나감. Room:${roomId}`);
        }

        // 매칭 큐에서도 제거
        const qIdx = this.matchQueue.findIndex(q => q.socketId === socketId);
        if (qIdx !== -1) {
            this.matchQueue.splice(qIdx, 1);
            console.log(`[RoomManager] ${socketId} 매칭 큐에서 제거됨`);
        }

        // 💡 친선전 대기 중이었다면 제거 (Array.from으로 MapIterator 오류 방지)
        Array.from(this.customRooms.entries()).forEach(([code, players]: [string, any[]]) => {
            const filtered = players.filter((p: any) => p.socketId !== socketId);
            if (filtered.length === 0) this.customRooms.delete(code);
            else this.customRooms.set(code, filtered);
        });
    }

    public destroyRoom(roomId: string) {
        const room = this.rooms.get(roomId);
        if (room) {
            if (room.expireTimer) clearTimeout(room.expireTimer);
            room.playerSockets.forEach(id => this.userRoomMap.delete(id));
            this.rooms.delete(roomId);
            console.log(`[RoomManager] Room 파기: ${roomId}`);
        }
    }

    public handleReconnect(socketId: string, oldSocketId: string) {
        const roomId = this.userRoomMap.get(oldSocketId);
        if (!roomId) return;
        const room = this.rooms.get(roomId);
        if (!room) return;

        if (room.expireTimer) { clearTimeout(room.expireTimer); room.expireTimer = null; }

        this.userRoomMap.delete(oldSocketId);
        this.userRoomMap.set(socketId, roomId);

        const idx = room.playerSockets.indexOf(oldSocketId);
        if (idx !== -1) room.playerSockets[idx] = socketId;

        room.engine.replacePlayerId(oldSocketId, socketId);
        console.log(`[RoomManager] 재접속. Old:${oldSocketId} → New:${socketId}`);
    }

    public generateRoomId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}
```

---

## src/server/server.ts

```typescript
// src/server/server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { decode } from 'next-auth/jwt';
import * as dotenv from 'dotenv';
import path from 'path';
import next from 'next';
import { PrismaClient } from '@prisma/client'; // 💡 DB 연동을 위해 추가

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const secret = process.env.NEXTAUTH_SECRET;
const PORT = process.env.PORT || 4000;

// 💡 서버 전용 Prisma 인스턴스 (랭크 점수 조회/갱신용)
const prisma = new PrismaClient();

// 💡 유저 ID와 소켓 ID를 매핑 (중복 로그인 체크용)
const userSocketMap = new Map<string, string>();

nextApp.prepare().then(() => {
    const app = express();
    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // 소켓 인증 미들웨어
    io.use(async (socket, next) => {
        try {
            const cookieString = socket.request.headers.cookie;
            const tokenMatch = cookieString?.match(/next-auth\.session-token=([^;]+)/);
            const sessionToken = tokenMatch ? tokenMatch[1] : null;

            if (!sessionToken) return next(new Error('Authentication error'));

            const decoded = await decode({ token: sessionToken, secret: secret! });
            if (!decoded) return next(new Error('Authentication error'));

            const userId = (decoded as any).id;

            // 💡 [중복 로그인 차단 로직] 기존 세션이 있으면 강제 종료
            if (userSocketMap.has(userId)) {
                const oldSocketId = userSocketMap.get(userId);
                io.to(oldSocketId!).emit('KICK_OUT', '다른 기기에서 로그인이 시도되었습니다.');
                console.log(`[Kick] User ${userId}의 기존 세션(${oldSocketId})을 강제 종료합니다.`);
            }

            userSocketMap.set(userId, socket.id);
            (socket as any).user = decoded;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    // RoomManager 로딩
    const { RoomManager } = require('./RoomManager');
    const roomManager = new RoomManager(io, prisma); // 💡 prisma 주입

    io.on('connection', (socket) => {
        const user = (socket as any).user;
        console.log(`[Connected] ${user.name} (${socket.id})`);

        // 💡 [랭크 매칭] DB에서 실제 랭크 점수를 가져와서 큐에 넣음
        socket.on('MATCH_FIND', async (data) => {
            try {
                const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
                // 💡 prisma db push 전엔 rankScore 타입이 없을 수 있어 any로 안전하게 접근
                const rank = (dbUser as any)?.rankScore ?? 1000;
                console.log(`[Match] ${user.name} 랭크 매칭 요청. 점수: ${rank}`);
                roomManager.joinMatchQueue(socket.id, data.deck, data.charId, rank, user.id);
            } catch (err) {
                console.error('[Match] 유저 정보 조회 실패:', err);
                // DB 오류 시 기본값으로 큐 등록
                roomManager.joinMatchQueue(socket.id, data.deck, data.charId, 1000, user.id);
            }
        });

        // 💡 [친선전] 방 코드로 즉시 매칭
        socket.on('JOIN_CUSTOM_ROOM', (data) => {
            console.log(`[CustomRoom] ${user.name} 친선전 방 입장 시도. 코드: ${data.roomCode}`);
            roomManager.joinCustomRoom(socket.id, data.deck, data.charId, data.roomCode, user.id);
        });

        // 💡 [매칭 취소] 클라이언트가 대기 중 취소 버튼을 누를 때
        socket.on('CANCEL_MATCH', () => {
            roomManager.cancelMatch(socket.id);
            console.log(`[Socket] ${user.name} 매칭 취소 요청`);
        });

        socket.on('ACTION_SUBMIT', (actions) => roomManager.handleActionSubmit(socket.id, actions));
        socket.on('CARD_DISCARD', (data) => roomManager.handleCardDiscard(socket.id, data.cardInstanceId));
        socket.on('LEAVE_ROOM', () => roomManager.leaveRoom(socket.id));

        socket.on('disconnect', () => {
            // 💡 연결 끊김 시 중복 로그인 맵에서 해당 유저 제거
            if (userSocketMap.get(user.id) === socket.id) {
                userSocketMap.delete(user.id);
            }
            roomManager.leaveRoom(socket.id);
            console.log(`[Disconnected] ${user.name} (${socket.id})`);
        });
    });

    app.all('*', (req: any, res: any) => handle(req, res));

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server on port ${PORT}`);
    });
});
```

---

## src/types/index.ts

```typescript
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
```

---

## tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
    "target": "ES2017"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "data"
  ]
}
```

---

## tsconfig.server.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "lib": ["esnext"],
    "types": ["node"],
    "noEmit": false,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": [
    "src/server/**/*.ts", 
    "src/types/**/*.ts", 
    "src/engine/dataLoader.ts"
  ],
  "exclude": ["node_modules"]
}
```

---

