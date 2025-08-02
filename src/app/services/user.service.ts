import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly SECRETARY_KEY = 'secretary';
  private readonly CAPTAIN_KEY = 'captain';

  constructor(private storage: Storage) {
    this.init();
  }

  public async init() {
    await this.storage.create();

    const hasSecretary = await this.storage.get(this.SECRETARY_KEY);
    if (!hasSecretary) {
      await this.storage.set(this.SECRETARY_KEY, {
        id: 1,
        name: 'Secretary Juan',
        phone: '+639123456789', // gamit phone
        password: 'secret123'
      });
    }

    const hasCaptain = await this.storage.get(this.CAPTAIN_KEY);
    if (!hasCaptain) {
      await this.storage.set(this.CAPTAIN_KEY, {
        id: 2,
        name: 'Captain Maria',
        phone: '+639987654321', // gamit phone
        password: 'captain123'
      });
    }
  }

  async getSecretary(): Promise<any> {
    return this.storage.get(this.SECRETARY_KEY);
  }

  async getCaptain(): Promise<any> {
    return this.storage.get(this.CAPTAIN_KEY);
  }
}
