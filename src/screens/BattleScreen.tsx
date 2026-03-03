import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CHARACTERS } from '../data/characters';
import { ITEMS } from '../data/items';
import { SKILLS } from '../data/skills';
import { audioManager } from '../utils/audioManager';
import type { BattleUnit } from '../types';

type UnitMap = Record<string, BattleUnit>;

function makeEnemyId(activeQuests: ReturnType<typeof useGameStore.getState>['activeQuests']): string {
  const battleTarget = Object.values(activeQuests)
    .flatMap((q) => q.objectives)
    .find((o) => o.type === 'battle' && o.target && o.progress < (o.count ?? 1))?.target;
  return battleTarget ?? 'mongol_soldier';
}

export default function BattleScreen() {
  const {
    player,
    activeQuests,
    inventory,
    useItem,
    updateQuestProgress,
    gainExp,
    addGold,
    modifyReputation,
    setScreen,
  } = useGameStore();

  const [units, setUnits] = useState<UnitMap>({});
  const [log, setLog] = useState<string[]>(['战斗开始']);
  const [busy, setBusy] = useState(false);
  const [ended, setEnded] = useState<'victory' | 'defeat' | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showItems, setShowItems] = useState(false);

  const enemySourceId = useMemo(() => makeEnemyId(activeQuests), [activeQuests]);
  const syncPlayerVitals = (hp: number, mp: number) => {
    useGameStore.setState((s) => ({
      player: {
        ...s.player,
        hp: Math.max(0, Math.min(s.player.hpMax, hp)),
        mp: Math.max(0, Math.min(s.player.mpMax, mp)),
      },
    }));
  };

  useEffect(() => {
    audioManager.playBGM('battle');
    const enemy = CHARACTERS[enemySourceId] ?? CHARACTERS.mongol_soldier;

    setUnits({
      player: {
        id: 'player',
        name: player.name,
        portrait: '👤',
        stats: {
          hp: player.hpMax,
          hpMax: player.hpMax,
          mp: player.mpMax,
          mpMax: player.mpMax,
          atk: player.atk,
          def: player.def,
          spd: player.spd,
          wis: player.wis,
          charm: player.charm,
        },
        currentHp: player.hp,
        currentMp: player.mp,
        skills: player.skills,
        statusEffects: [],
        isPlayer: true,
        isDefeated: player.hp <= 0,
      },
      enemy: {
        id: 'enemy',
        enemyId: enemy.id,
        name: enemy.name,
        portrait: enemy.portrait,
        stats: enemy.stats,
        currentHp: enemy.stats.hpMax,
        currentMp: enemy.stats.mpMax,
        skills: enemy.skills,
        statusEffects: [],
        isPlayer: false,
        isDefeated: false,
      },
    });
    setLog([`遭遇 ${enemy.name}`]);
    setBusy(false);
    setEnded(null);
    setSelectedSkill(null);
    setShowItems(false);
  }, [enemySourceId, player]);

  const addLog = (text: string) => setLog((prev) => [...prev.slice(-30), text]);

  const commitEnd = (
    result: 'victory' | 'defeat',
    killedEnemyId?: string,
    hpOverride?: number,
    mpOverride?: number
  ) => {
    if (ended) return;
    setEnded(result);
    const current = useGameStore.getState().player;
    const hpToSync = hpOverride ?? current.hp;
    const mpToSync = mpOverride ?? current.mp;

    if (result === 'victory') {
      const exp = 100;
      const gold = 50;
      syncPlayerVitals(hpToSync, mpToSync);
      gainExp(exp);
      addGold(gold);
      modifyReputation('good', 2);

      if (killedEnemyId) {
        Object.values(activeQuests).forEach((quest) => {
          quest.objectives.forEach((obj, idx) => {
            if (
              (obj.type === 'battle' || obj.type === 'kill') &&
              obj.target === killedEnemyId &&
              obj.progress < (obj.count ?? 1)
            ) {
              updateQuestProgress(quest.id, idx, Math.min(obj.progress + 1, obj.count ?? 1));
            }
          });
        });
      }

      addLog(`胜利，获得 ${exp} 经验与 ${gold} 银两`);
    } else {
      syncPlayerVitals(Math.max(1, hpToSync), mpToSync);
      addLog('战败，返回城镇');
    }
  };

  const enemyTurn = (next: UnitMap) => {
    const enemy = next.enemy;
    const hero = next.player;
    if (!enemy || !hero || enemy.isDefeated || hero.isDefeated) return next;

    const dmg = Math.max(1, Math.floor(enemy.stats.atk * 1.1 - hero.stats.def * 0.5));
    const hp = Math.max(0, hero.currentHp - dmg);
    addLog(`${enemy.name} 攻击你，造成 ${dmg} 点伤害`);

    const updated: UnitMap = {
      ...next,
      player: { ...hero, currentHp: hp, isDefeated: hp <= 0 },
    };

    if (hp <= 0) commitEnd('defeat', undefined, hp, hero.currentMp);
    return updated;
  };

  const doAttack = (skillId?: string) => {
    if (busy || ended) return;
    setBusy(true);

    setUnits((prev) => {
      const hero = prev.player;
      const enemy = prev.enemy;
      if (!hero || !enemy || hero.isDefeated || enemy.isDefeated) return prev;

      const skill = skillId ? SKILLS[skillId] : undefined;
      const power = skill?.power ?? 3;
      const mpCost = skill?.mpCost ?? 0;
      if (hero.currentMp < mpCost) {
        addLog('内力不足');
        setBusy(false);
        return prev;
      }

      const dmg = Math.max(1, Math.floor(hero.stats.atk * (power * 0.4) - enemy.stats.def * 0.4));
      const enemyHp = Math.max(0, enemy.currentHp - dmg);

      addLog(`${hero.name}${skill ? ` 使用 ${skill.name}` : ' 攻击'}，造成 ${dmg} 点伤害`);

      let next: UnitMap = {
        ...prev,
        player: { ...hero, currentMp: Math.max(0, hero.currentMp - mpCost) },
        enemy: { ...enemy, currentHp: enemyHp, isDefeated: enemyHp <= 0 },
      };

      if (enemyHp <= 0) {
        commitEnd(
          'victory',
          enemy.enemyId,
          hero.currentHp,
          Math.max(0, hero.currentMp - mpCost)
        );
        setBusy(false);
        return next;
      }

      next = enemyTurn(next);
      setBusy(false);
      return next;
    });
  };

  const doUseItem = (itemId?: string) => {
    if (busy || ended) return;
    const medicine = itemId
      ? inventory.find((i) => i.id === itemId && ITEMS[i.id]?.type === 'medicine' && i.count > 0)
      : inventory.find((i) => ITEMS[i.id]?.type === 'medicine' && i.count > 0);
    if (!medicine) {
      addLog('没有可用药品');
      return;
    }

    const item = ITEMS[medicine.id];
    if (!item) return;
    const consumed = useItem(medicine.id);
    if (!consumed) {
      addLog('道具使用失败');
      return;
    }
    setShowItems(false);

    setUnits((prev) => {
      const hero = prev.player;
      if (!hero) return prev;
      const hpAdd = typeof item.effect.hp === 'number' ? item.effect.hp : 0;
      const mpAdd = typeof item.effect.mp === 'number' ? item.effect.mp : 0;
      const next: UnitMap = {
        ...prev,
        player: {
          ...hero,
          currentHp: Math.min(hero.stats.hpMax, hero.currentHp + hpAdd),
          currentMp: Math.min(hero.stats.mpMax, hero.currentMp + mpAdd),
        },
      };
      addLog(`使用 ${item.name}`);
      return enemyTurn(next);
    });
  };

  const doEscape = () => {
    if (busy || ended) return;
    if (Math.random() < 0.5) {
      if (units.player) {
        syncPlayerVitals(units.player.currentHp, units.player.currentMp);
      }
      addLog('成功逃跑');
      setTimeout(() => setScreen('town'), 300);
    } else {
      addLog('逃跑失败');
      setUnits((prev) => enemyTurn(prev));
    }
  };

  const playerUnit = units.player;
  const enemyUnit = units.enemy;
  const skillList = (playerUnit?.skills ?? []).map((id) => SKILLS[id]).filter(Boolean);
  const medicineList = inventory.filter((i) => ITEMS[i.id]?.type === 'medicine' && i.count > 0);

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
        <div className="bg-ink-dark border border-gold/30 p-4 rounded">
          <h3 className="text-gold text-lg font-bold mb-2">我方</h3>
          <p className="text-parchment">{playerUnit?.name}</p>
          <p className="text-parchment/70">HP: {playerUnit?.currentHp ?? 0}/{playerUnit?.stats.hpMax ?? 0}</p>
          <p className="text-parchment/70">MP: {playerUnit?.currentMp ?? 0}/{playerUnit?.stats.mpMax ?? 0}</p>
        </div>

        <div className="bg-ink-dark border border-red-500/30 p-4 rounded">
          <h3 className="text-red-300 text-lg font-bold mb-2">敌方</h3>
          <p className="text-parchment">{enemyUnit?.name}</p>
          <p className="text-parchment/70">HP: {enemyUnit?.currentHp ?? 0}/{enemyUnit?.stats.hpMax ?? 0}</p>
          <p className="text-parchment/70">MP: {enemyUnit?.currentMp ?? 0}/{enemyUnit?.stats.mpMax ?? 0}</p>
        </div>

        <div className="col-span-2 bg-ink-dark border border-gold/20 rounded p-3 h-52 overflow-y-auto">
          {log.map((line, idx) => (
            <p key={idx} className="text-sm text-parchment/80">{line}</p>
          ))}
        </div>
      </div>

      {!ended && (
        <div className="p-4 bg-ink-dark border-t border-gold/30 flex gap-3 justify-center flex-wrap">
          {!selectedSkill && !showItems && (
            <>
              <button onClick={() => doAttack()} className="px-4 py-2 bg-crimson text-parchment rounded">攻击</button>
              <button
                onClick={() => setSelectedSkill(skillList[0]?.id ?? null)}
                className="px-4 py-2 border border-gold text-gold rounded"
              >
                技能
              </button>
              <button onClick={() => setShowItems(true)} className="px-4 py-2 border border-green-500 text-green-300 rounded">道具</button>
              <button onClick={doEscape} className="px-4 py-2 border border-gold/50 text-gold/70 rounded">逃跑</button>
            </>
          )}

          {selectedSkill && (
            <>
              {skillList.map((skill) => {
                const canUse = (playerUnit?.currentMp ?? 0) >= skill.mpCost;
                return (
                  <button
                    key={skill.id}
                    disabled={!canUse}
                    onClick={() => doAttack(skill.id)}
                    className={`px-4 py-2 rounded border ${canUse ? 'border-gold text-gold' : 'border-gold/20 text-gold/30'}`}
                  >
                    {skill.name} (MP {skill.mpCost})
                  </button>
                );
              })}
              <button onClick={() => setSelectedSkill(null)} className="px-4 py-2 border border-gold/50 text-gold/70 rounded">
                取消
              </button>
            </>
          )}

          {showItems && (
            <>
              {medicineList.length === 0 && <span className="text-parchment/60">没有药品</span>}
              {medicineList.map((it) => (
                <button
                  key={it.id}
                  onClick={() => doUseItem(it.id)}
                  className="px-4 py-2 border border-green-500 text-green-300 rounded"
                >
                  {ITEMS[it.id]?.name ?? it.id} x{it.count}
                </button>
              ))}
              <button onClick={() => setShowItems(false)} className="px-4 py-2 border border-gold/50 text-gold/70 rounded">
                取消
              </button>
            </>
          )}
        </div>
      )}

      {ended && (
        <div className="p-4 bg-ink-dark border-t border-gold/30 text-center">
          <p className={`mb-3 font-bold ${ended === 'victory' ? 'text-gold' : 'text-red-400'}`}>
            {ended === 'victory' ? '战斗胜利' : '战斗失败'}
          </p>
          <button onClick={() => setScreen('town')} className="px-4 py-2 bg-crimson text-parchment rounded">
            返回城镇
          </button>
        </div>
      )}
    </div>
  );
}
