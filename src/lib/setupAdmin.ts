/**
 * ADMIN SETUP SCRIPT
 * 
 * This script helps set up the admin user in Firebase.
 * Run this ONCE to initialize the admin user.
 * 
 * INSTRUCTIONS:
 * 1. Make sure you're logged in to Firebase Console
 * 2. Create this user manually in Firebase Authentication:
 *    - Email: admin@collabx.com
 *    - Password: 1234321
 * 
 * 3. Then run this function in browser console or in your app
 * 4. After that, the user will have admin access
 */

import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const setupAdminUser = async (uid: string) => {
  try {
    const adminDocRef = doc(db, 'users', uid);
    await setDoc(adminDocRef, {
      displayName: 'Admin',
      email: 'admin@collabx.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }, { merge: true });
    
    console.log('✅ Admin user set up successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    return false;
  }
};

/**
 * SETUP INSTRUCTIONS:
 * 
 * Step 1: Create user in Firebase Console
 * ========================================
 * - Go to Firebase Console > Authentication
 * - Click "Add user"
 * - Email: admin@collabx.com
 * - Password: 1234321
 * - Click "Create user"
 * - Copy the UID (shown in the user list)
 * 
 * Step 2: Set Admin Role
 * =====================
 * Option A - Using Firestore Console:
 * - Go to Firebase Console > Firestore Database
 * - Create collection "users"
 * - Add document with UID as document ID
 * - Add fields:
 *   - role (string): "admin"
 *   - email (string): "admin@collabx.com"
 *   - displayName (string): "Admin"
 * 
 * Option B - Using this script in app:
 * - Import setupAdminUser from this file
 * - Call: setupAdminUser('USER_UID_HERE')
 * - Replace USER_UID_HERE with the actual UID from step 1
 * 
 * Step 3: Verify
 * ==============
 * - Log out and log in with admin@collabx.com / 1234321
 * - You should see admin features in the Hackathon page
 */
