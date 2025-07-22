// src/app/services/storage.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this._storage?.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    return await this._storage?.get(key);
  }

  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this._storage?.clear();
  }

  async getAll(): Promise<any[]> {
    const records: any[] = [];
    if (!this._storage) return [];
    await this._storage.forEach((value) => records.push(value));
    return records;
  }

  async exportData(): Promise<string> {
    const data: Record<string, any> = {};
    if (!this._storage) return '';
    await this._storage.forEach((value, key) => data[key] = value);
    return JSON.stringify(data, null, 2);
  }

  async importData(json: string): Promise<void> {
    const parsed = JSON.parse(json);
    for (const key in parsed) {
      await this.set(key, parsed[key]);
    }
  }
}