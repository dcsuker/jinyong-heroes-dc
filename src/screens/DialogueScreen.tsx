import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CHARACTERS } from '../data/characters';
import { DIALOGUES } from '../data/dialogues';

export default function DialogueScreen() {
  const {
    currentDialogue,
    setCurrentDialogue,
    setScreen,
    modifyAffinity,
    addPartyMember,
    completedQuests,
    party,
    player,
  } = useGameStore();

  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [ended, setEnded] = useState(false);

  const char = currentDialogue ? CHARACTERS[currentDialogue] : null;
  const affinity = useMemo(() => {
    if (!currentDialogue) return 0;
    return player.charAffinities[currentDialogue] ?? 0;
  }, [currentDialogue, player.charAffinities]);

  const lines = useMemo(() => {
    if (!char) return [];
    return DIALOGUES[char.id] ?? [char.description || `${char.name} 看着你，等你开口。`];
  }, [char]);

  useEffect(() => {
    setDone(false);
    setMessage('');
    setLineIdx(0);
    setEnded(false);
  }, [currentDialogue]);

  useEffect(() => {
    if (!currentDialogue) return;
    if (char) return;
    useGameStore.setState({ currentDialogue: null, screen: 'town' });
  }, [char, currentDialogue]);

  const recruitCheck = useMemo(() => {
    if (!char || !char.recruitable) {
      return { canRecruit: false, reason: '该角色不可招募' };
    }
    if (party.includes(char.id)) {
      return { canRecruit: false, reason: '该角色已在队伍中' };
    }
    if (party.length >= 4) {
      return { canRecruit: false, reason: '队伍人数已满（最多 4 人）' };
    }

    const cond = char.recruitCondition;
    if (!cond) return { canRecruit: true, reason: '' };

    if (typeof cond.fameGood === 'number' && player.fameGood < cond.fameGood) {
      return { canRecruit: false, reason: `正派声望需达到 ${cond.fameGood}` };
    }
    if (typeof cond.fameEvil === 'number' && player.fameEvil < cond.fameEvil) {
      return { canRecruit: false, reason: `邪派声望需达到 ${cond.fameEvil}` };
    }
    if (typeof cond.affinity === 'number' && affinity < cond.affinity) {
      return { canRecruit: false, reason: `好感度需达到 ${cond.affinity}` };
    }
    if (cond.quest && !completedQuests.includes(cond.quest)) {
      return { canRecruit: false, reason: `需先完成任务：${cond.quest}` };
    }

    return { canRecruit: true, reason: '' };
  }, [affinity, char, completedQuests, party, player.fameEvil, player.fameGood]);

  if (!char) {
    return (
      <div className="w-full h-full bg-ink flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-parchment/80 text-lg">对话目标异常，已回退到城镇。</p>
          <button
            onClick={() => {
              useGameStore.setState({ currentDialogue: null, screen: 'town' });
            }}
            className="px-4 py-2 border border-gold/50 text-gold rounded"
          >
            返回城镇
          </button>
        </div>
      </div>
    );
  }

  const leave = () => {
    setCurrentDialogue(null);
    setScreen('town');
  };

  const handleFriendly = () => {
    modifyAffinity(char.id, 5);
    setDone(false);
    setMessage('');
    if (lineIdx < Math.max(lines.length - 1, 0)) {
      setLineIdx((idx) => idx + 1);
    } else {
      setEnded(true);
      setMessage('这段对话已结束。');
    }
  };

  const handleRecruit = () => {
    if (!recruitCheck.canRecruit) {
      setMessage(recruitCheck.reason);
      return;
    }

    const ok = addPartyMember(char.id);
    setDone(ok);
    setMessage(ok ? `${char.name} 已加入队伍` : '入队失败');
  };

  const handleBattle = () => {
    setCurrentDialogue(null);
    setScreen('battle');
  };

  const handleNextLine = () => {
    setDone(false);
    setMessage('');
    if (lineIdx < Math.max(lines.length - 1, 0)) {
      setLineIdx((idx) => idx + 1);
    } else {
      setEnded(true);
      setMessage('已到最后一句。');
    }
  };

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-ink-dark border border-gold/30 rounded-lg p-6">
          <h2 className="text-3xl text-gold font-bold mb-2">{char.name}</h2>
          <p className="text-parchment/70 mb-4 text-lg">好感度: {affinity}</p>
          <p className="text-parchment mb-6 text-xl leading-9">
            {done ? `${char.name} 对你的态度有所变化。` : lines[lineIdx] ?? char.description}
          </p>
          {message && <p className="text-amber-300 mb-4 text-lg">{message}</p>}

          <div className="flex flex-wrap gap-3 text-lg">
            <button
              onClick={handleNextLine}
              disabled={ended}
              className={`px-5 py-2.5 border rounded ${
                ended
                  ? 'border-sky-900/60 text-sky-800 cursor-not-allowed'
                  : 'border-sky-500/60 text-sky-300'
              }`}
            >
              {ended ? '已结束' : '下一句'}
            </button>
            <button onClick={handleFriendly} className="px-5 py-2.5 bg-crimson text-parchment rounded">
              寒暄
            </button>
            {char.recruitable && (
              <button
                onClick={handleRecruit}
                disabled={!recruitCheck.canRecruit}
                className={`px-5 py-2.5 rounded ${
                  recruitCheck.canRecruit
                    ? 'bg-green-700 text-parchment hover:bg-green-600'
                    : 'bg-stone-700 text-stone-300 cursor-not-allowed'
                }`}
                title={recruitCheck.canRecruit ? '' : recruitCheck.reason}
              >
                邀请入队
              </button>
            )}
            <button onClick={handleBattle} className="px-5 py-2.5 border border-red-500/60 text-red-300 rounded">
              切磋
            </button>
            <button onClick={leave} className="px-5 py-2.5 border border-gold/50 text-gold rounded">
              离开
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
