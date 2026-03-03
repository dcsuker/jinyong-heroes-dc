import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CHARACTERS } from '../data/characters';
import { SKILLS } from '../data/skills';

export default function CharacterScreen() {
  const { player, party, setScreen } = useGameStore();
  const [activeTab, setActiveTab] = useState<'player' | 'party' | 'reputation'>('player');

  const reputationBar = (value: number, color: string) => (
    <div className="h-3 bg-ink-light rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center p-4 border-b border-gold/30 bg-ink-dark">
        <h2 className="text-2xl font-bold text-gold">角色信息</h2>
        <button
          onClick={() => setScreen('worldmap')}
          className="px-4 py-2 border border-gold/50 text-gold/70 rounded hover:border-gold hover:text-gold"
        >
          返回
        </button>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-4 p-4 border-b border-gold/20">
        {(['player', 'party', 'reputation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded transition-colors
              ${activeTab === tab
                ? 'bg-gold text-ink-dark font-bold'
                : 'border border-gold/50 text-gold/70 hover:border-gold hover:text-gold'}`}
          >
            {tab === 'player' ? '主角' : tab === 'party' ? '队伍' : '声望'}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'player' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 角色信息卡 */}
            <div className="bg-ink-dark border border-gold/30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">👤</div>
                <div>
                  <h3 className="text-2xl font-bold text-gold">{player.name}</h3>
                  <p className="text-parchment/60">等级 {player.level}</p>
                  <p className="text-parchment/60">经验 {player.exp}/{player.expNext}</p>
                </div>
              </div>

              {/* 属性条 */}
              <div className="space-y-4">
                {[
                  { label: '生命', current: player.hp, max: player.hpMax, color: 'bg-red-500' },
                  { label: '内力', current: player.mp, max: player.mpMax, color: 'bg-blue-500' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm text-parchment/80 mb-1">
                      <span>{stat.label}</span>
                      <span>{stat.current}/{stat.max}</span>
                    </div>
                    <div className="h-3 bg-ink-light rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} transition-all duration-300`}
                        style={{ width: `${(stat.current / stat.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 基础属性 */}
            <div className="bg-ink-dark border border-gold/30 p-6 rounded-lg">
              <h4 className="text-xl font-bold text-gold mb-4">基础属性</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '攻击', value: player.atk, icon: '⚔️' },
                  { label: '防御', value: player.def, icon: '🛡️' },
                  { label: '速度', value: player.spd, icon: '💨' },
                  { label: '智慧', value: player.wis, icon: '📖' },
                  { label: '魅力', value: player.charm, icon: '✨' },
                ].map((attr) => (
                  <div key={attr.label} className="flex items-center gap-2 bg-ink p-3 rounded">
                    <span className="text-xl">{attr.icon}</span>
                    <div>
                      <div className="text-sm text-parchment/60">{attr.label}</div>
                      <div className="text-xl font-bold text-parchment">{attr.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 装备栏 */}
            <div className="bg-ink-dark border border-gold/30 p-6 rounded-lg">
              <h4 className="text-xl font-bold text-gold mb-4">装备</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { slot: 'weapon', label: '武器', icon: '🗡️' },
                  { slot: 'armor', label: '防具', icon: '👕' },
                  { slot: 'accessory', label: '饰品', icon: '💍' },
                ].map((equip) => (
                  <div
                    key={equip.slot}
                    className="aspect-square bg-ink border border-gold/30 rounded flex flex-col items-center justify-center"
                  >
                    <span className="text-3xl mb-2">{equip.icon}</span>
                    <span className="text-sm text-parchment/60">{equip.label}</span>
                    {player.equipped[equip.slot as keyof typeof player.equipped] ? (
                      <span className="text-xs text-gold">已装备</span>
                    ) : (
                      <span className="text-xs text-parchment/30">空</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 武功列表 */}
            <div className="bg-ink-dark border border-gold/30 p-6 rounded-lg">
              <h4 className="text-xl font-bold text-gold mb-4">已学武功</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {player.skills.map((skillId) => {
                  const skill = SKILLS[skillId];
                  if (!skill) return null;
                  return (
                    <div key={skillId} className="flex items-center gap-3 bg-ink p-3 rounded">
                      <span className="text-2xl">
                        {skill.type === '剑法' ? '🗡️' :
                         skill.type === '掌法' ? '✋' :
                         skill.type === '内功' ? '☯️' :
                         skill.type === '轻功' ? '💨' : '⚔️'}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-parchment">{skill.name}</div>
                        <div className="text-xs text-parchment/60">{skill.type} | 威力: {skill.power}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'party' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {party.map((charId, idx) => {
              if (charId === 'player') {
                return (
                  <div key={idx} className="bg-ink-dark border border-gold/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">👤</span>
                      <div>
                        <h4 className="font-bold text-gold">{player.name}</h4>
                        <p className="text-sm text-parchment/60">主角</p>
                      </div>
                    </div>
                    <div className="text-sm text-parchment/80">
                      <p>等级: {player.level}</p>
                      <p>生命: {player.hp}/{player.hpMax}</p>
                    </div>
                  </div>
                );
              }
              const char = CHARACTERS[charId];
              if (!char) return null;
              return (
                <div key={idx} className="bg-ink-dark border border-gold/30 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{char.portrait}</span>
                    <div>
                      <h4 className="font-bold text-gold">{char.name}</h4>
                      <p className="text-sm text-parchment/60">{char.novel}</p>
                    </div>
                  </div>
                  <p className="text-sm text-parchment/80 mb-2">{char.description}</p>
                  <div className="text-sm text-parchment/60">
                    <p>攻击: {char.stats.atk} | 防御: {char.stats.def}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {char.personality.map((trait) => (
                      <span key={trait} className="text-xs px-2 py-1 bg-gold/20 text-gold rounded">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'reputation' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* 正道声望 */}
            <div className="bg-ink-dark border border-gold/30 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">😇</span>
                <h4 className="text-xl font-bold text-gold">正道声望</h4>
                <span className="ml-auto text-2xl font-bold text-blue-400">{player.fameGood}</span>
              </div>
              {reputationBar(player.fameGood, 'bg-blue-500')}
              <p className="text-sm text-parchment/60 mt-2">
                正道声望影响正派NPC对你的态度，以及能否加入名门正派。
              </p>
            </div>

            {/* 邪道声望 */}
            <div className="bg-ink-dark border border-gold/30 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">😈</span>
                <h4 className="text-xl font-bold text-crimson">邪道声望</h4>
                <span className="ml-auto text-2xl font-bold text-red-500">{player.fameEvil}</span>
              </div>
              {reputationBar(player.fameEvil, 'bg-red-500')}
              <p className="text-sm text-parchment/60 mt-2">
                邪道声望影响邪派NPC对你的态度，以及能否学习邪派武功。
              </p>
            </div>

            {/* 门派好感度 */}
            <div className="bg-ink-dark border border-gold/30 p-6 rounded-lg">
              <h4 className="text-xl font-bold text-gold mb-4">门派好感度</h4>
              <div className="space-y-3">
                {Object.entries(player.sectAffinities).length > 0 ? (
                  Object.entries(player.sectAffinities).map(([sectId, value]) => (
                    <div key={sectId} className="flex items-center gap-4">
                      <span className="w-20 text-parchment">{sectId}</span>
                      {reputationBar(value + 50, value >= 0 ? 'bg-green-500' : 'bg-red-500')}
                      <span className={`w-12 text-right ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {value > 0 ? `+${value}` : value}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-parchment/40">暂无门派好感度记录</p>
                )}
              </div>
            </div>

            {/* 角色好感度 */}
            <div className="bg-ink-dark border border-gold/30 p-6 rounded-lg">
              <h4 className="text-xl font-bold text-gold mb-4">角色好感度</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(player.charAffinities).length > 0 ? (
                  Object.entries(player.charAffinities).map(([charId, value]) => {
                    const char = CHARACTERS[charId];
                    return (
                      <div key={charId} className="flex items-center gap-3 bg-ink p-3 rounded">
                        <span className="text-2xl">{char?.portrait || '👤'}</span>
                        <span className="flex-1 text-parchment">{char?.name || charId}</span>
                        <span className={`font-bold ${value >= 0 ? 'text-pink-400' : 'text-gray-400'}`}>
                          {value > 0 ? `❤️ ${value}` : `💔 ${value}`}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-parchment/40 col-span-2">暂无角色好感度记录</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
