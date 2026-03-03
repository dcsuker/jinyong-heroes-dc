/**
 * 音频管理器
 * 管理游戏中的背景音乐(BGM)和音效(SFX)
 */

// 音频资源路径配置
const AUDIO_PATHS = {
  bgm: {
    // Runtime uses a small WAV set for now; keep semantic keys as aliases.
    worldmap: '/audio/worldmap.wav',
    town: '/audio/town.wav',
    battle: '/audio/battle.wav',
    mainmenu: '/audio/mainmenu.wav',
    town_jiangnan: '/audio/town.wav',
    town_heroic: '/audio/town.wav',
    town_capital: '/audio/town.wav',
    town_yunnan: '/audio/town.wav',
    temple_zen: '/audio/town.wav',
    mountain_taoist: '/audio/worldmap.wav',
    mountain_buddhist: '/audio/worldmap.wav',
    mountain_swords: '/audio/worldmap.wav',
    mountain_mystic: '/audio/worldmap.wav',
    mountain_majestic: '/audio/worldmap.wav',
    cult_theme: '/audio/worldmap.wav',
    evil_lair: '/audio/worldmap.wav',
    jianghu_theme: '/audio/worldmap.wav',
    island_mysterious: '/audio/worldmap.wav',
    tomb_mysterious: '/audio/worldmap.wav',
    battle_normal: '/audio/battle.wav',
    battle_boss: '/audio/battle.wav',
    main_menu: '/audio/mainmenu.wav',
  },
  sfx: {
    // UI音效
    click: '/audio/sfx/confirm.wav',
    hover: '/audio/sfx/confirm.wav',
    confirm: '/audio/sfx/confirm.wav',
    cancel: '/audio/sfx/confirm.wav',
    travel: '/audio/sfx/travel.wav',
    encounter: '/audio/sfx/encounter.wav',
    talk: '/audio/sfx/confirm.wav',
    // 战斗音效
    attack_hit: '/audio/sfx/encounter.wav',
    attack_miss: '/audio/sfx/confirm.wav',
    skill_cast: '/audio/sfx/encounter.wav',
    damage_taken: '/audio/sfx/encounter.wav',
    battle_start: '/audio/sfx/encounter.wav',
    battle_victory: '/audio/sfx/confirm.wav',
    battle_defeat: '/audio/sfx/encounter.wav',
    level_up: '/audio/sfx/confirm.wav',
    item_use: '/audio/sfx/confirm.wav',
    equip: '/audio/sfx/confirm.wav',
    // 环境音效
    footsteps: '/audio/sfx/travel.wav',
    dialog_open: '/audio/sfx/confirm.wav',
    gold_gain: '/audio/sfx/confirm.wav',
    quest_complete: '/audio/sfx/confirm.wav',
  },
};

type BGMType = keyof typeof AUDIO_PATHS.bgm;
type SFXType = keyof typeof AUDIO_PATHS.sfx;

class AudioManager {
  private bgm: HTMLAudioElement | null = null;
  private currentBGM: BGMType | null = null;
  private sfxCache: Map<SFXType, HTMLAudioElement> = new Map();
  private bgmVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private isMuted: boolean = false;
  private isBGMEnabled: boolean = true;
  private isSFXEnabled: boolean = true;

  constructor() {
    // 从localStorage加载音量设置
    this.loadSettings();
  }

  /**
   * 加载保存的音频设置
   */
  private loadSettings(): void {
    try {
      const settings = localStorage.getItem('jy-audio-settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.bgmVolume = parsed.bgmVolume ?? 0.5;
        this.sfxVolume = parsed.sfxVolume ?? 0.7;
        this.isMuted = parsed.isMuted ?? false;
        this.isBGMEnabled = parsed.isBGMEnabled ?? true;
        this.isSFXEnabled = parsed.isSFXEnabled ?? true;
      }
    } catch (e) {
      console.warn('加载音频设置失败:', e);
    }
  }

  /**
   * 保存音频设置
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(
        'jy-audio-settings',
        JSON.stringify({
          bgmVolume: this.bgmVolume,
          sfxVolume: this.sfxVolume,
          isMuted: this.isMuted,
          isBGMEnabled: this.isBGMEnabled,
          isSFXEnabled: this.isSFXEnabled,
        })
      );
    } catch (e) {
      console.warn('保存音频设置失败:', e);
    }
  }

  /**
   * 播放背景音乐
   * @param type BGM类型
   * @param fadeDuration 淡入时间（毫秒）
   */
  public playBGM(type: BGMType, fadeDuration: number = 1000): void {
    if (!this.isBGMEnabled || this.isMuted) return;
    if (this.currentBGM === type) return; // 已经在播放同一首

    const path = AUDIO_PATHS.bgm[type];
    if (!path) {
      console.warn(`未找到BGM: ${type}`);
      return;
    }

    // 如果已有BGM在播放，先淡出
    if (this.bgm) {
      this.fadeOut(this.bgm, fadeDuration, () => {
        this.startBGM(path, type, fadeDuration);
      });
    } else {
      this.startBGM(path, type, fadeDuration);
    }
  }

  /**
   * 开始播放新的BGM
   */
  private startBGM(path: string, type: BGMType, fadeDuration: number): void {
    this.bgm = new Audio(path);
    this.bgm.loop = true;
    this.bgm.volume = 0;
    this.currentBGM = type;

    this.bgm
      .play()
      .then(() => {
        this.fadeIn(this.bgm!, this.bgmVolume, fadeDuration);
      })
      .catch((e) => {
        console.warn('BGM播放失败:', e);
        this.bgm = null;
        this.currentBGM = null;
      });
  }

  /**
   * 停止背景音乐
   * @param fadeDuration 淡出时间（毫秒）
   */
  public stopBGM(fadeDuration: number = 1000): void {
    if (!this.bgm) return;

    this.fadeOut(this.bgm, fadeDuration, () => {
      if (this.bgm) {
        this.bgm.pause();
        this.bgm.currentTime = 0;
        this.bgm = null;
      }
      this.currentBGM = null;
    });
  }

  /**
   * 暂停背景音乐
   */
  public pauseBGM(): void {
    if (this.bgm) {
      this.bgm.pause();
    }
  }

  /**
   * 恢复背景音乐
   */
  public resumeBGM(): void {
    if (this.bgm && this.isBGMEnabled && !this.isMuted) {
      this.bgm.play().catch((e) => console.warn('恢复BGM失败:', e));
    }
  }

  /**
   * 播放音效
   * @param type 音效类型
   * @param volume 音量（0-1，可选）
   */
  public playSFX(type: SFXType, volume?: number): void {
    if (!this.isSFXEnabled || this.isMuted) return;

    const path = AUDIO_PATHS.sfx[type];
    if (!path) {
      console.warn(`未找到音效: ${type}`);
      return;
    }

    // 检查缓存
    let audio = this.sfxCache.get(type);
    if (!audio) {
      audio = new Audio(path);
      this.sfxCache.set(type, audio);
    }

    // 克隆音频以支持同时播放多个相同音效
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = volume ?? this.sfxVolume;

    clone
      .play()
      .catch((e) => console.warn(`音效播放失败 (${type}):`, e));

    // 播放完成后移除引用
    clone.addEventListener('ended', () => {
      clone.remove();
    });
  }

  /**
   * 设置背景音乐音量
   */
  public setBGMVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgm) {
      this.bgm.volume = this.isMuted ? 0 : this.bgmVolume;
    }
    this.saveSettings();
  }

  /**
   * 设置音效音量
   */
  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  /**
   * 获取当前BGM音量
   */
  public getBGMVolume(): number {
    return this.bgmVolume;
  }

  /**
   * 获取当前SFX音量
   */
  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  /**
   * 静音/取消静音
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgm) {
      this.bgm.volume = this.isMuted ? 0 : this.bgmVolume;
    }
    this.saveSettings();
    return this.isMuted;
  }

  /**
   * 获取静音状态
   */
  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 启用/禁用背景音乐
   */
  public toggleBGM(): boolean {
    this.isBGMEnabled = !this.isBGMEnabled;
    if (this.isBGMEnabled && !this.isMuted) {
      this.resumeBGM();
    } else {
      this.pauseBGM();
    }
    this.saveSettings();
    return this.isBGMEnabled;
  }

  /**
   * 启用/禁用音效
   */
  public toggleSFX(): boolean {
    this.isSFXEnabled = !this.isSFXEnabled;
    this.saveSettings();
    return this.isSFXEnabled;
  }

  /**
   * 获取BGM启用状态
   */
  public getIsBGMEnabled(): boolean {
    return this.isBGMEnabled;
  }

  /**
   * 获取SFX启用状态
   */
  public getIsSFXEnabled(): boolean {
    return this.isSFXEnabled;
  }

  /**
   * 淡入效果
   */
  private fadeIn(
    audio: HTMLAudioElement,
    targetVolume: number,
    duration: number
  ): void {
    const startTime = Date.now();
    const startVolume = audio.volume;

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      }
    };

    requestAnimationFrame(fade);
  }

  /**
   * 淡出效果
   */
  private fadeOut(
    audio: HTMLAudioElement,
    duration: number,
    callback?: () => void
  ): void {
    const startTime = Date.now();
    const startVolume = audio.volume;

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = startVolume * (1 - progress);

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        callback?.();
      }
    };

    requestAnimationFrame(fade);
  }

  /**
   * 预加载音效
   * @param types 要预加载的音效类型列表
   */
  public preloadSFX(types: SFXType[]): void {
    types.forEach((type) => {
      const path = AUDIO_PATHS.sfx[type];
      if (path && !this.sfxCache.has(type)) {
        const audio = new Audio(path);
        audio.load();
        this.sfxCache.set(type, audio);
      }
    });
  }

  /**
   * 根据地点获取对应的BGM
   */
  public getBGMForLocation(locationId: string): BGMType | null {
    const locationBGMMap: Record<string, BGMType> = {
      jiaxing: 'town_jiangnan',
      xiangyang: 'town_heroic',
      shaolin: 'temple_zen',
      wudang: 'mountain_taoist',
      emei: 'mountain_buddhist',
      hua_shan: 'mountain_swords',
      bright_peak: 'cult_theme',
      black_cliff: 'evil_lair',
      beggar_headquarters: 'jianghu_theme',
    };
    return locationBGMMap[locationId] || null;
  }

  /**
   * 销毁音频管理器，清理资源
   */
  public destroy(): void {
    this.stopBGM(0);
    this.sfxCache.clear();
  }
}

// 导出单例实例
export const audioManager = new AudioManager();

// 导出类型
export type { BGMType, SFXType };
