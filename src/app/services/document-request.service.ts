import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class DocumentRequestService {
  private dbInstance!: SQLiteObject;

 constructor(private sqlite: SQLite, private platform: Platform) {
  this.platform.ready().then(() => {
    this.initDatabase();
  });
}


  // Public getter to expose database instance safely
  public getDb(): SQLiteObject {
    return this.dbInstance;
  }

  // Initialize the SQLite database
  private async initDatabase(): Promise<void> {
    try {
      const db = await this.sqlite.create({
        name: 'barangayconnect.db',
        location: 'default',
      });

      this.dbInstance = db;

      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS document_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          documentType TEXT,
          purpose TEXT,
          copies INTEGER,
          requirements TEXT,
          photo TEXT,
          timestamp TEXT,
          status TEXT DEFAULT 'Pending',
          notes TEXT DEFAULT '',
          contact TEXT,
          isSynced INTEGER DEFAULT 0
        )
      `, []);
    } catch (error) {
      console.error('SQLite init error:', error);
    }
  }

  
  // Insert a new request into the database
  async addRequest(data: any): Promise<void> {
    if (!this.dbInstance) {
    console.warn('addRequest: DB not initialized.');
    return;
  }
    const query = `
      INSERT INTO document_requests (
        documentType, purpose, copies, requirements, photo, timestamp, status, notes, contact, isSynced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.documentType,
      data.purpose,
      data.copies,
      data.requirements,
      data.photo,
      data.timestamp,
      data.status || 'Pending',
      data.notes || ' ',
      data.contact,
      data.isSynced ?? 0
    ];

    try {
      await this.dbInstance.executeSql(query, values);
    } catch (error: any) {
  console.error('Insert error:', error.message || error);
}

  }

  // Get all requests
  async getAllRequests(): Promise<any[]> {
    const result = await this.dbInstance.executeSql('SELECT * FROM document_requests', []);
    const requests: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      requests.push(result.rows.item(i));
    }
    return requests;
  }

  // Clear all requests
  async clearAll(): Promise<void> {
    await this.dbInstance.executeSql('DELETE FROM document_requests', []);
  }

  // Reject request with a reason
  async rejectRequest(id: number, reason: string): Promise<void> {
    try {
      await this.dbInstance.executeSql(
        `UPDATE document_requests SET status = 'Rejected', notes = ? WHERE id = ?`,
        [reason, id]
      );
    } catch (error) {
      console.error('Update error:', error);
    }
  }

  // Cancel request by ID
  async cancelRequestById(id: number): Promise<void> {
    try {
      await this.dbInstance.executeSql(
        `UPDATE document_requests SET status = 'Cancelled' WHERE id = ?`,
        [id]
      );
    } catch (error) {
      console.error('Cancel error:', error);
    }
  }

  // Delete request by ID
  async deleteRequestById(id: number): Promise<void> {
    try {
      await this.dbInstance.executeSql(
        `DELETE FROM document_requests WHERE id = ?`,
        [id]
      );
    } catch (error) {
      console.error('Delete error:', error);
    }
  }

 async getRequestsByContact(contact: string): Promise<any[]> {
  const result = await this.dbInstance.executeSql(
    'SELECT * FROM document_requests WHERE contact = ?',
    [contact]
  );
  const requests: any[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    requests.push(result.rows.item(i));
  }
  return requests;
}

  async markAsSynced(id: number): Promise<void> {
  try {
    await this.dbInstance.executeSql(
      `UPDATE document_requests SET isSynced = 1 WHERE id = ?`,
      [id]
    );
  } catch (error) {
    console.error('Sync update error:', error);
  }
}

  async getSyncedRequests(): Promise<any[]> {
  const result = await this.dbInstance.executeSql(
    'SELECT * FROM document_requests WHERE isSynced = 1',
    []
  );
  const synced: any[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    synced.push(result.rows.item(i));
  }
  return synced;
}

// Get only released documents (For Pickup or Approved)
async getReleasedDocuments(): Promise<any[]> {
  const result = await this.dbInstance.executeSql(
    `SELECT * FROM document_requests WHERE status = 'For Pickup' OR status = 'Approved'`,
    []
  );
  const released: any[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    released.push(result.rows.item(i));
  }
  return released;
}

async updateStatus(id: number, newStatus: string): Promise<void> {
  try {
    await this.dbInstance.executeSql(
      `UPDATE document_requests SET status = ? WHERE id = ?`,
      [newStatus, id]
    );
  } catch (error) {
    console.error('Status update error:', error);
  }
}






  
}
