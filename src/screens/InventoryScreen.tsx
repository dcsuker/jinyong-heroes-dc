import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ITEMS } from '../data/items';
import type { Item } from '../types';

const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-500 text-gray-400',
  uncommon: 'border-green-500 text-green-400',
  rare: 'border-blue-500 text-blue-400',
  epic: 'border-purple-500 text-purple-400',
  legendary: 'border-gold text-gold',
};

const ITEM_TYPE_ICONS: Record<string, string> = {
  weapon: '🗡️',
  armor: '🛡️',
  medicine: '🧪',
  manual: '📜',
  material: '🔧',
  quest: '🔍',
  accessory: '💍',
};

export default function InventoryScreen() {
  const { inventory, gold, removeItem, setScreen, equipItem, unequipItem, consumeItem, player } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [message, setMessage] = useState('');

  const filteredInventory =
    filter === 'all' ? inventory : inventory.filter((entry) => ITEMS[entry.id]?.type === filter);

  const handleUseItem = () => {
    if (!selectedItem) return;

    if (selectedItem.type !== 'medicine' && selectedItem.type !== 'manual') {
      setMessage('该道具不可直接使用');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const result = consumeItem(selectedItem.id);
    setMessage(result.message);
    setTimeout(() => setMessage(''), 2000);
    setSelectedItem(null);
  };

  const handleEquipItem = () => {
    if (!selectedItem) return;
    const slot = selectedItem.type as 'weapon' | 'armor' | 'accessory';
    if (['weapon', 'armor', 'accessory'].includes(slot)) {
      equipItem(selectedItem.id, slot);
      setMessage(`装备了 ${selectedItem.name}`);
      setTimeout(() => setMessage(''), 2000);
      setSelectedItem(null);
    }
  };

  const handleUnequip = (slot: 'weapon' | 'armor' | 'accessory') => {
    unequipItem(slot);
    setMessage('卸下装备');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDropItem = () => {
    if (!selectedItem) return;
    removeItem(selectedItem.id, 1);
    setSelectedItem(null);
  };

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gold/30 bg-ink-dark">
        <h2 className="text-2xl font-bold text-gold">背包</h2>
        <div className="flex items-center gap-4">
          <span className="text-gold text-xl">💰 {gold} 两</span>
          {message && <span className="text-green-400 text-sm">{message}</span>}
          <button
            onClick={() => setScreen('worldmap')}
            className="px-4 py-2 border border-gold/50 text-gold/70 rounded hover:border-gold hover:text-gold"
          >
            返回
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gold/20 bg-ink-dark/50">
        <h3 className="text-gold font-bold mb-2">已装备</h3>
        <div className="flex gap-4">
          {[
            { slot: 'weapon', label: '武器', icon: '🗡️' },
            { slot: 'armor', label: '防具', icon: '🛡️' },
            { slot: 'accessory', label: '饰品', icon: '💍' },
          ].map(({ slot, label, icon }) => {
            const equippedId = player.equipped[slot as keyof typeof player.equipped];
            const equippedItem = equippedId ? ITEMS[equippedId] : null;
            return (
              <div key={slot} className="flex items-center gap-2 bg-ink p-2 rounded border border-gold/30">
                <span className="text-xl">{equippedItem ? ITEM_TYPE_ICONS[equippedItem.type] : icon}</span>
                <div>
                  <div className="text-xs text-parchment/60">{label}</div>
                  <div className="text-sm text-parchment">{equippedItem?.name || '未装备'}</div>
                </div>
                {equippedItem && (
                  <button
                    onClick={() => handleUnequip(slot as 'weapon' | 'armor' | 'accessory')}
                    className="ml-2 text-xs text-red-400 hover:text-red-300"
                  >
                    卸下
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 p-4 border-b border-gold/20 overflow-x-auto">
        {[
          { id: 'all', label: '全部', icon: '📦' },
          { id: 'weapon', label: '武器', icon: '🗡️' },
          { id: 'armor', label: '防具', icon: '🛡️' },
          { id: 'medicine', label: '药品', icon: '🧪' },
          { id: 'manual', label: '秘籍', icon: '📜' },
          { id: 'material', label: '材料', icon: '🔧' },
          { id: 'quest', label: '任务', icon: '🔍' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setFilter(type.id)}
            className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
              filter === type.id
                ? 'bg-gold text-ink-dark font-bold'
                : 'border border-gold/50 text-gold/70 hover:border-gold hover:text-gold'
            }`}
          >
            <span className="mr-1">{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-w-6xl mx-auto">
          {Array.from({ length: 48 }).map((_, idx) => {
            const itemEntry = filteredInventory[idx];
            const item = itemEntry ? ITEMS[itemEntry.id] : null;

            return (
              <button
                key={idx}
                onClick={() => item && setSelectedItem(item)}
                className={`relative aspect-square bg-ink-dark border-2 rounded-lg flex flex-col items-center justify-center
                  transition-all duration-200
                  ${item ? `${RARITY_COLORS[item.rarity]} hover:scale-105 hover:shadow-lg cursor-pointer` : 'border-ink-light opacity-30'}`}
              >
                {item ? (
                  <>
                    <span className="text-2xl mb-1">{ITEM_TYPE_ICONS[item.type] || '📦'}</span>
                    <span className="text-xs text-center px-1 truncate w-full">{item.name}</span>
                    {itemEntry.count > 1 && (
                      <span className="absolute bottom-1 right-1 text-xs bg-ink text-gold px-1 rounded">{itemEntry.count}</span>
                    )}
                  </>
                ) : (
                  <span className="text-parchment/20 text-2xl">+</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedItem && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ink-dark border-2 border-gold p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{ITEM_TYPE_ICONS[selectedItem.type] || '📦'}</span>
              <div>
                <h3 className={`text-xl font-bold ${RARITY_COLORS[selectedItem.rarity].split(' ')[1]}`}>{selectedItem.name}</h3>
                <p className="text-sm text-parchment/60">{selectedItem.type}</p>
              </div>
            </div>

            <p className="text-parchment/80 mb-4">{selectedItem.description}</p>

            {Object.keys(selectedItem.effect).length > 0 && (
              <div className="bg-ink p-3 rounded mb-4">
                <h4 className="text-gold text-sm mb-2">效果</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(selectedItem.effect).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-parchment/60">{key}</span>
                      <span className={typeof value === 'number' && value > 0 ? 'text-green-400' : 'text-red-400'}>
                        {typeof value === 'number' && value > 0 ? '+' : ''}
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-right text-gold mb-4">售价: {selectedItem.price} 两</div>

            <div className="flex gap-3 flex-wrap">
              {(selectedItem.type === 'medicine' || selectedItem.type === 'manual') && (
                <button onClick={handleUseItem} className="flex-1 px-4 py-2 bg-crimson text-parchment rounded hover:bg-crimson-light">
                  使用
                </button>
              )}
              {['weapon', 'armor', 'accessory'].includes(selectedItem.type) && (
                <button onClick={handleEquipItem} className="flex-1 px-4 py-2 bg-green-600 text-parchment rounded hover:bg-green-500">
                  装备
                </button>
              )}
              <button onClick={handleDropItem} className="px-4 py-2 border border-red-500/50 text-red-400 rounded hover:bg-red-500/20">
                丢弃
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-gold/50 text-gold/70 rounded hover:border-gold hover:text-gold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
