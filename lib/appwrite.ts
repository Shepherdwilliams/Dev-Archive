
import { Client, Account, Databases, ID, Permission, Role } from 'appwrite';

// --- IMPORTANT ---
// 1. Paste your Project ID and API Endpoint from your Appwrite project dashboard.
// 2. Paste your Database ID and Collection ID from your Appwrite database settings.
export const APPWRITE_CONFIG = {
    endpoint: 'PASTE_YOUR_API_ENDPOINT_HERE', // e.g., 'https://cloud.appwrite.io/v1'
    projectId: 'PASTE_YOUR_PROJECT_ID_HERE',
    databaseId: 'PASTE_YOUR_DATABASE_ID_HERE', // e.g., 'dev-archive-db'
    userProgressCollectionId: 'PASTE_YOUR_COLLECTION_ID_HERE' // e.g., 'user-progress'
};

const client = new Client();

client
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

// Export ID, Permission, and Role for easy access
export { ID, Permission, Role };
