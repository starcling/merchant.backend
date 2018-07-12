import debug from 'debug';
import { DefaultConfig } from './default.config';
import { DevelopmentConfig } from './development.config';
import { ProductionConfig } from './production.config';
import { Settings } from './settings.interface';

export class Config {
  private static NAMESPACE: string = 'app:config';
  private static combinedSettings: Settings;

  /**
   * Merge two settings. Only the top level keys are considered!
   * @param a: Settings the default settings
   * @param b: Settings environment settings
   * @returns {Settings}
   */
  private static shallowMerge(a: Settings, b: Settings): Settings {
    Object.keys(b).forEach(key => {
      if (b[key] === null) {
        debug(this.NAMESPACE)(`WARNING: key is null: ${key}`);
      } else {
        a[key] = b[key];
      }
    });

    return a;
  }

  /**
   * Get settings based on NODE_ENV.
   * @returns {Settings}
   */
  public static get settings(): Settings {
    if (this.combinedSettings !== undefined && this.combinedSettings !== null) {
      return this.combinedSettings;
    }

    const defaultSettings = DefaultConfig.settings;
    let envSettings: Settings;
    switch (process.env.NODE_ENV) {
      case 'development':
        envSettings = DevelopmentConfig.settings;
        break;
      case 'production':
        envSettings = ProductionConfig.settings;
        break;
      default:
        debug(this.NAMESPACE)(`WARNING: no environment settings for ${process.env.NODE_ENV}.`);
        this.combinedSettings = defaultSettings;

        return defaultSettings;
    }

    // Shallow merge
    // debug(this.NAMESPACE)('default settings', defaultSettings);
    // debug(this.NAMESPACE)(`${process.env.NODE_ENV} settings`, envSettings);
    this.combinedSettings = this.shallowMerge(defaultSettings, envSettings);

    return this.combinedSettings;
  }
}
