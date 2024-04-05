import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require('./../../src/backend-19290-firebase-adminsdk-v2j43-07999cc8c0.json');
    if (!getApps().length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'backend-19290.appspot.com',
      });
    }
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
