import { Application, Container } from 'pixi.js';

export class PixiRoot {
  private app: Application | null = null;
  private mountEl: HTMLDivElement | null = null;
  readonly world = new Container();

  async init(mountEl: HTMLDivElement): Promise<Application> {
    this.destroy();

    this.mountEl = mountEl;
    const app = new Application();
    await app.init({
      antialias: false,
      backgroundAlpha: 0,
      resizeTo: mountEl,
    });

    app.canvas.style.width = '100%';
    app.canvas.style.height = '100%';
    app.canvas.style.display = 'block';
    app.stage.addChild(this.world);
    mountEl.appendChild(app.canvas);

    this.app = app;
    return app;
  }

  getApp(): Application {
    if (!this.app) {
      throw new Error('PixiRoot is not initialized');
    }
    return this.app;
  }

  destroy(): void {
    if (!this.app) return;

    const app = this.app;
    this.app = null;
    this.world.removeChildren();
    app.destroy(true, { children: true, texture: false, textureSource: false });

    if (this.mountEl && this.mountEl.contains(app.canvas)) {
      this.mountEl.removeChild(app.canvas);
    }
    this.mountEl = null;
  }
}
