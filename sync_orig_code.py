
import os

files = [
    "src/types/index.ts",
    "src/engine/store.ts",
    "src/engine/skillEngine.ts",
    "src/engine/statusEngine.ts",
    "src/engine/cardEngine.ts",
    "src/engine/actionEngine.ts",
    "src/engine/collisionEngine.ts",
    "src/data/characters.ts",
    "src/data/skills.ts",
    "src/data/cards.ts",
    "src/components/game/Scene.tsx",
    "src/components/game/Grid.tsx",
    "src/components/game/Player.tsx",
    "src/components/game/ui/Card.tsx",
    "src/components/game/ui/ControlPanel.tsx",
    "src/components/game/ui/HandSystem.tsx",
    "src/components/game/ui/LogPanel.tsx",
    "src/app/game/page.tsx",
    "src/app/page.tsx"
]

base_dir = "e:/kang.geonwoo/game/turn_card_battle_v2"
output_file = os.path.join(base_dir, "all_game_code.md")

with open(output_file, "w", encoding="utf-8") as f:
    f.write("# Turn-based Card Battle Game - All Source Code (ORIGINAL VERSION)\n\n")
    for file_path in files:
        full_path = os.path.join(base_dir, file_path)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as sf:
                content = sf.read()
                f.write(f"## File: {file_path}\n\n")
                f.write("```" + ("typescript" if file_path.endswith(".ts") else "tsx" if file_path.endswith(".tsx") else "") + "\n")
                f.write(content)
                f.write("\n```\n\n")
        else:
            f.write(f"## File: {file_path} (NOT FOUND)\n\n")

print(f"Successfully updated {output_file}")
