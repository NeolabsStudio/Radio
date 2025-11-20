
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Station, Episode } from '../types';
import { MOCK_STATIONS, MOCK_EPISODES } from '../constants';

interface NCORDatabase extends DBSchema {
  stations: {
    key: string;
    value: Station;
    indexes: { 'by-category': string; 'by-type': string };
  };
  episodes: {
    key: string;
    value: Episode;
    indexes: { 'by-station': string };
  };
}

const DB_NAME = 'ncor-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NCORDatabase>>;

export const initDB = async () => {
  dbPromise = openDB<NCORDatabase>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create Stations Store
      const stationStore = db.createObjectStore('stations', { keyPath: 'id' });
      stationStore.createIndex('by-category', 'category');
      stationStore.createIndex('by-type', 'type');

      // Create Episodes Store
      const episodeStore = db.createObjectStore('episodes', { keyPath: 'id' });
      episodeStore.createIndex('by-station', 'stationId');

      // Seed Data if empty
      console.log("Seeding Database...");
      MOCK_STATIONS.forEach(station => {
        stationStore.put({ ...station, isFavorite: false, createdAt: Date.now() });
      });
      MOCK_EPISODES.forEach(episode => {
        episodeStore.put(episode);
      });
    },
  });
  return dbPromise;
};

export const getDB = async () => {
  if (!dbPromise) {
    await initDB();
  }
  return dbPromise;
};

// --- Station Operations ---

export const getAllStations = async (): Promise<Station[]> => {
  const db = await getDB();
  // Sort by createdAt desc to show newest uploads first
  const stations = await db.getAll('stations');
  return stations.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const addStation = async (station: Station): Promise<void> => {
  const db = await getDB();
  await db.put('stations', { ...station, createdAt: Date.now() });
};

export const updateStation = async (station: Station): Promise<void> => {
  const db = await getDB();
  await db.put('stations', station);
};

export const toggleStationFavorite = async (id: string): Promise<Station | undefined> => {
  const db = await getDB();
  const station = await db.get('stations', id);
  if (station) {
    station.isFavorite = !station.isFavorite;
    await db.put('stations', station);
    return station;
  }
  return undefined;
};

// --- Episode Operations ---

export const getAllEpisodes = async (): Promise<Episode[]> => {
  const db = await getDB();
  return db.getAll('episodes');
};

// --- Utilities ---

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
