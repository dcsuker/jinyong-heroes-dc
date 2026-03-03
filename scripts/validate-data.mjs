import { CHARACTERS } from '../src/data/characters.ts';
import { ITEMS } from '../src/data/items.ts';
import { LOCATIONS } from '../src/data/locations.ts';
import { QUESTS } from '../src/data/quests.ts';
import { SKILLS } from '../src/data/skills.ts';

const errors = [];

const has = (obj, id) => Object.prototype.hasOwnProperty.call(obj, id);
const pushErr = (msg) => errors.push(msg);

for (const [locId, loc] of Object.entries(LOCATIONS)) {
  for (const to of loc.connected ?? []) {
    if (!has(LOCATIONS, to)) {
      pushErr(`[locations] ${locId}.connected -> missing location: ${to}`);
    }
  }
  for (const npc of loc.npcs ?? []) {
    if (!has(CHARACTERS, npc)) {
      pushErr(`[locations] ${locId}.npcs -> missing character: ${npc}`);
    }
  }
}

for (const [charId, char] of Object.entries(CHARACTERS)) {
  for (const skillId of char.skills ?? []) {
    if (!has(SKILLS, skillId)) {
      pushErr(`[characters] ${charId}.skills -> missing skill: ${skillId}`);
    }
  }
}

for (const [itemId, item] of Object.entries(ITEMS)) {
  const maybeSkill = item.effect?.skill;
  if (typeof maybeSkill === 'string' && !has(SKILLS, maybeSkill)) {
    pushErr(`[items] ${itemId}.effect.skill -> missing skill: ${maybeSkill}`);
  }
}

const targetExistsForObjective = (obj) => {
  const target = obj.target;
  if (!target) return true;

  if (obj.type === 'visit' || obj.type === 'reach') return has(LOCATIONS, target);
  if (obj.type === 'find' || obj.type === 'collect') return has(ITEMS, target);
  if (obj.type === 'learn') return has(SKILLS, target);
  if (obj.type === 'puzzle') return true;
  return has(CHARACTERS, target);
};

for (const [questId, quest] of Object.entries(QUESTS)) {
  if (quest.giver !== 'system' && !has(CHARACTERS, quest.giver)) {
    pushErr(`[quests] ${questId}.giver -> missing character: ${quest.giver}`);
  }

  for (const [idx, obj] of quest.objectives.entries()) {
    if (!targetExistsForObjective(obj)) {
      pushErr(
        `[quests] ${questId}.objectives[${idx}] (${obj.type}) -> missing target: ${obj.target}`
      );
    }
  }

  if (quest.reward.item && !has(ITEMS, quest.reward.item)) {
    pushErr(`[quests] ${questId}.reward.item -> missing item: ${quest.reward.item}`);
  }
  if (quest.reward.skill && !has(SKILLS, quest.reward.skill)) {
    pushErr(`[quests] ${questId}.reward.skill -> missing skill: ${quest.reward.skill}`);
  }
}

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} issue(s):`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('Data validation passed.');
