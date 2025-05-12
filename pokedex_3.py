import os
import json
from PIL import Image
from typing import Dict, Any, List, Tuple
import random

class Pokedex3:
    def __init__(self, base_dir: str = "."):
        self.base_dir = base_dir
        self.pokedex_path = os.path.join(base_dir, "pokedex.json")
        self.fusion_pokedex_path = os.path.join(base_dir, "fusion-pokedex.json")
        self.base_sprites_dir = os.path.join(base_dir, "sprites", "base")
        self.fusion_sprites_dir = os.path.join(base_dir, "sprites", "fusions")
        
        # 确保目录存在
        os.makedirs(self.base_sprites_dir, exist_ok=True)
        os.makedirs(self.fusion_sprites_dir, exist_ok=True)
        
        # 加载数据
        self.pokemon_data = self._load_pokedex()
        self.fusion_data = self._load_fusion_data()

    def _load_pokedex(self) -> Dict[str, Any]:
        """加载原始宝可梦数据"""
        try:
            with open(self.pokedex_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"警告: 找不到 {self.pokedex_path}")
            return {}

    def _load_fusion_data(self) -> Dict[str, Any]:
        """加载融合数据"""
        try:
            with open(self.fusion_pokedex_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"警告: 找不到 {self.fusion_pokedex_path}")
            return []

    def _merge_types(self, head_types: List[str], body_types: List[str]) -> List[str]:
        """合并并去重两个宝可梦的属性"""
        merged = list(set(head_types + body_types))
        return sorted(merged)

    def _merge_abilities(self, head_abilities: List, body_abilities: List) -> List[str]:
        """合并两个宝可梦的特性，只取每个子数组的第一个元素（能力名）"""
        def extract_names(abilities):
            return [a[0] if isinstance(a, list) and len(a) > 0 else a for a in abilities]
        merged = list(set(extract_names(head_abilities) + extract_names(body_abilities)))
        return sorted(merged)

    def _merge_moves(self, head_moves: List[str], body_moves: List[str]) -> List[str]:
        """合并两个宝可梦的技能"""
        merged = list(set(head_moves + body_moves))
        return sorted(merged)

    def _calculate_fusion_percentages(self, head_id: int, body_id: int) -> Tuple[float, float]:
        """计算融合比例"""
        head_percent = random.uniform(40, 60)
        body_percent = 100 - head_percent
        return head_percent, body_percent

    def generate_fusion_entry(self, head_id: int, body_id: int) -> Dict[str, Any]:
        """生成单个融合条目"""
        head_data = self.pokemon_data[head_id-1]
        body_data = self.pokemon_data[body_id-1]

        head_percent, body_percent = self._calculate_fusion_percentages(head_id, body_id)

        return {
            "id": f"{head_id}.{body_id}",
            "name": f"{head_data['name']} + {body_data['name']}",
            "head": {
                "id": head_id,
                "name": head_data["name"],
                "percent": head_percent
            },
            "body": {
                "id": body_id,
                "name": body_data["name"],
                "percent": body_percent
            },
            "types": self._merge_types(head_data.get("types", []), body_data.get("types", [])),
            "abilities": self._merge_abilities(
                head_data.get("profile", {}).get("ability", []),
                body_data.get("profile", {}).get("ability", [])
            ),
            "moves": self._merge_moves(
                head_data.get("moves", []),
                body_data.get("moves", [])
            ),
            "sprite": f"sprites/fusions/{head_id}-{body_id}.png",
            "artist": "AI Generated"
        }

    def generate_fusion_sprite(self, head_id: int, body_id: int, head_percent: float, body_percent: float) -> None:
        """生成融合精灵图片"""
        # 加载原始精灵图片
        head_sprite_path = os.path.join(self.base_sprites_dir, f"{head_id}.png")
        body_sprite_path = os.path.join(self.base_sprites_dir, f"{body_id}.png")
        
        try:
            head_sprite = Image.open(head_sprite_path).convert('RGBA')
            body_sprite = Image.open(body_sprite_path).convert('RGBA')
        except FileNotFoundError as e:
            print(f"警告: 找不到精灵图片 - {e}")
            return

        # 计算最终图片的尺寸
        total_height = max(head_sprite.height, body_sprite.height)
        total_width = max(head_sprite.width, body_sprite.width)
        
        # 创建新的透明图片
        result = Image.new('RGBA', (total_width, total_height), (0, 0, 0, 0))
        
        # 调整两个精灵的大小
        head_height = int(total_height * (head_percent / 100))
        body_height = int(total_height * (body_percent / 100))
        
        # 调整大小
        head_sprite = head_sprite.resize(
            (int(head_sprite.width * head_height / head_sprite.height), head_height),
            Image.Resampling.LANCZOS
        )
        body_sprite = body_sprite.resize(
            (int(body_sprite.width * body_height / body_sprite.height), body_height),
            Image.Resampling.LANCZOS
        )
        
        # 计算位置
        head_x = (total_width - head_sprite.width) // 2
        body_x = (total_width - body_sprite.width) // 2
        
        # 粘贴头部
        result.paste(head_sprite, (head_x, 0), head_sprite)
        
        # 粘贴身体
        body_y = head_height
        result.paste(body_sprite, (body_x, body_y), body_sprite)
        
        # 保存结果
        output_path = os.path.join(self.fusion_sprites_dir, f"{head_id}-{body_id}.png")
        result.save(output_path, 'PNG')

    def generate_all_fusions(self, start_id: int = 1, end_id: int = 151) -> None:
        """生成所有融合组合"""
        fusion_entries = []
        
        print("开始生成融合数据...")
        for head_id in range(start_id, end_id + 1):
            for body_id in range(start_id, end_id + 1):
                if head_id != body_id:  # 避免自身融合
                    fusion_entry = self.generate_fusion_entry(head_id, body_id)
                    fusion_entries.append(fusion_entry)
                    
                    # 生成融合图片
                    self.generate_fusion_sprite(
                        head_id, 
                        body_id,
                        fusion_entry['head']['percent'],
                        fusion_entry['body']['percent']
                    )
                    print(f"已生成融合: {head_id}-{body_id}")
        
        # 保存融合数据
        with open(self.fusion_pokedex_path, 'w', encoding='utf-8') as f:
            json.dump(fusion_entries, f, ensure_ascii=False, indent=2)
        
        print(f"融合数据已保存到 {self.fusion_pokedex_path}")

    def get_fusion(self, head_id: int, body_id: int) -> Dict[str, Any]:
        """获取特定融合的数据"""
        fusion_id = f"{head_id}.{body_id}"
        for fusion in self.fusion_data:
            if fusion['id'] == fusion_id:
                return fusion
        return None

    def get_fusion_sprite_path(self, head_id: int, body_id: int) -> str:
        """获取融合精灵图片的路径"""
        return os.path.join(self.fusion_sprites_dir, f"{head_id}-{body_id}.png")

    def add_fusion_stats_to_pokedex(self):
        """为每只宝可梦添加融合进度统计，并保存新 pokedex_with_fusion_stats.json"""
        head_counts = {}
        body_counts = {}
        for fusion in self.fusion_data:
            head_id = fusion['head']['id']
            body_id = fusion['body']['id']
            head_counts[head_id] = head_counts.get(head_id, 0) + 1
            body_counts[body_id] = body_counts.get(body_id, 0) + 1
        max_fusions = len(self.fusion_data) // len(self.pokemon_data) if self.pokemon_data else 1
        for p in self.pokemon_data:
            head_val = int(100 * head_counts.get(p['id'], 0) / max_fusions)
            body_val = int(100 * body_counts.get(p['id'], 0) / max_fusions)
            p['fusionStats'] = {
                'headProgress': min(100, head_val),
                'bodyProgress': min(100, body_val),
                'totalFusions': head_counts.get(p['id'], 0) + body_counts.get(p['id'], 0),
                'maxFusions': max_fusions * 2
            }
        with open('pokedex_with_fusion_stats.json', 'w', encoding='utf-8') as f:
            json.dump(self.pokemon_data, f, ensure_ascii=False, indent=2)

def main():
    # 创建 Pokedex3 实例
    pokedex = Pokedex3()
    
    # 生成所有融合（这里以1-151为例）
    pokedex.generate_all_fusions(1, 151)
    # 生成带融合统计的新 pokedex json
    pokedex.add_fusion_stats_to_pokedex()

if __name__ == "__main__":
    main() 