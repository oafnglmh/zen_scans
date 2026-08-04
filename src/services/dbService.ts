import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ProcessedDocument } from '../types/student';
import { ProcessingLogItem } from '../types/log';

interface CertAppDBSchema extends DBSchema {
  cached_results: {
    key: string; // SHA-256 hash
    value: {
      fileHash: string;
      fileName: string;
      mergedStudents: any[];
      decisionNumber: string;
      decisionDate: string;
      totalTokens: number;
      createdAt: number;
    };
  };
  session_states: {
    key: string; // docId
    value: ProcessedDocument;
  };
  processing_logs: {
    key: string; // log id
    value: ProcessingLogItem;
    indexes: { 'by-doc': string };
  };
}

const DB_NAME = 'VietnameseCertExtractorDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CertAppDBSchema>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<CertAppDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cached_results')) {
          db.createObjectStore('cached_results', { keyPath: 'fileHash' });
        }
        if (!db.objectStoreNames.contains('session_states')) {
          db.createObjectStore('session_states', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('processing_logs')) {
          const logStore = db.createObjectStore('processing_logs', { keyPath: 'id' });
          logStore.createIndex('by-doc', 'docId');
        }
      },
    });
  }
  return dbPromise;
}

export async function getCachedDocument(fileHash: string) {
  const db = await getDB();
  return db.get('cached_results', fileHash);
}

export async function setCachedDocument(data: {
  fileHash: string;
  fileName: string;
  mergedStudents: any[];
  decisionNumber: string;
  decisionDate: string;
  totalTokens: number;
  createdAt: number;
}) {
  const db = await getDB();
  await db.put('cached_results', data);
}

export async function saveSessionState(doc: ProcessedDocument) {
  const db = await getDB();
  await db.put('session_states', doc);
}

export async function getSessionState(docId: string) {
  const db = await getDB();
  return db.get('session_states', docId);
}

export async function getAllSessionStates() {
  const db = await getDB();
  return db.getAll('session_states');
}

export async function deleteSessionState(docId: string) {
  const db = await getDB();
  await db.delete('session_states', docId);
}

export async function addLogItem(log: ProcessingLogItem) {
  const db = await getDB();
  await db.put('processing_logs', log);
}

export async function getAllLogs() {
  const db = await getDB();
  const logs = await db.getAll('processing_logs');
  return logs.sort((a, b) => b.timestamp - a.timestamp);
}

export async function clearAllLogs() {
  const db = await getDB();
  await db.clear('processing_logs');
}
