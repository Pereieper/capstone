import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private readonly STORAGE_KEY = 'registrations';
  private readonly INIT_KEY = 'initializedUsers';
  private currentUser: any = null;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    await this.initPredefinedUsers();
  }

  // ✅ Save updated user info to storage
  async updateUser(updated: any): Promise<void> {
    const allUsers = await this.getAllRegistrations();
    const index = allUsers.findIndex(u => u.contact === updated.contact);
    if (index > -1) {
      allUsers[index] = updated;
      await this.storage.set(this.STORAGE_KEY, allUsers);
      this.currentUser = updated;
    }
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async initPredefinedUsers(): Promise<void> {
    const isInitialized = await this.storage.get(this.INIT_KEY);
    if (!isInitialized) {
      const users = [
        {
          role: 'secretary',
          contact: '+639123456789',
          password: CryptoJS.SHA256('secret123').toString(),
          firstName: 'Secretary',
          middleName: '',
          lastName: 'User'
        },
        {
          role: 'captain',
          contact: '+639987654321',
          password: CryptoJS.SHA256('captain123').toString(),
          firstName: 'Captain',
          middleName: '',
          lastName: 'User'
        }
      ];

      await this.storage.set(this.STORAGE_KEY, users);
      await this.storage.set(this.INIT_KEY, true);
    }
  }

  async saveOfflineRegistration(data: any): Promise<void> {
    const existing = (await this.storage.get(this.STORAGE_KEY)) || [];
    existing.push(data);
    await this.storage.set(this.STORAGE_KEY, existing);
  }

  async getAllRegistrations(): Promise<any[]> {
    return (await this.storage.get(this.STORAGE_KEY)) || [];
  }

  async isDuplicateContact(contact: string): Promise<boolean> {
    const records = await this.getAllRegistrations();
    return records.some((r: any) => r.contact === contact);
  }

  async isDuplicateName(first: string, middle: string, last: string): Promise<boolean> {
    const records = await this.getAllRegistrations();
    return records.some((r: any) =>
      r.firstName?.toLowerCase() === first.toLowerCase() &&
      r.middleName?.toLowerCase() === middle.toLowerCase() &&
      r.lastName?.toLowerCase() === last.toLowerCase()
    );
  }

  async checkLogin(contact: string, password: string): Promise<any | null> {
    const users = await this.getAllRegistrations();
    const hashed = CryptoJS.SHA256(password).toString();
    const user = users.find(u => u.contact === contact && u.password === hashed);
    return user || null;
  }

  async clearAll(): Promise<void> {
    await this.storage.remove(this.STORAGE_KEY);
    await this.storage.remove(this.INIT_KEY);
  }
}
