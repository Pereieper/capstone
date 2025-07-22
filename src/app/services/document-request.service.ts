import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DocumentRequestService {
  private readonly STORAGE_KEY = 'documentRequests';

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
  }

  // Add a new request
  async addRequest(request: any): Promise<void> {
    const existing = await this.getAllRequests();
    existing.push(request);
    await this.storage.set(this.STORAGE_KEY, existing);
  }

  // Get all saved requests
  async getAllRequests(): Promise<any[]> {
    return (await this.storage.get(this.STORAGE_KEY)) || [];
  }

  // Clear all (optional for debug)
  async clearAll(): Promise<void> {
    await this.storage.remove(this.STORAGE_KEY);
  }
}
