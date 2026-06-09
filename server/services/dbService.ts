import admin from "firebase-admin";
import NodeCache from "node-cache";

// Cache for 5 minutes to reduce Firestore reads (and costs)
const cache = new NodeCache({ stdTTL: 300 });

export const getDb = () => admin.firestore();

export const findRecordByField = async (collection: string, field: string, value: any) => {
  const cacheKey = `${collection}:${field}:${value}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const snapshot = await getDb().collection(collection).where(field, "==", value).limit(1).get();
  if (snapshot.empty) return null;
  
  const data = snapshot.docs[0].data();
  cache.set(cacheKey, data);
  return data;
};

export const updateRecord = async (collection: string, docId: string, data: any) => {
  // Invalidate any relevant caches if we had a more complex cache key system
  await getDb().collection(collection).doc(docId).update(data);
};
