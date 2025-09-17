import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection name for assessments
const ASSESSMENTS_COLLECTION = 'assessments';

/**
 * Save assessment results to Firebase
 * @param {string} userId - The authenticated user's ID
 * @param {Object} assessmentData - The assessment results
 * @returns {Promise<boolean>} - Success status
 */
export const saveAssessmentResults = async (userId, assessmentData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const assessmentRef = doc(db, ASSESSMENTS_COLLECTION, userId);
    
    const dataToSave = {
      ...assessmentData,
      userId,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(assessmentRef, dataToSave, { merge: true });
    console.log('Assessment results saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving assessment results:', error);
    throw error;
  }
};

/**
 * Get assessment results for a user
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<Object|null>} - Assessment results or null if not found
 */
export const getAssessmentResults = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const assessmentRef = doc(db, ASSESSMENTS_COLLECTION, userId);
    const assessmentSnap = await getDoc(assessmentRef);

    if (assessmentSnap.exists()) {
      const data = assessmentSnap.data();
      return {
        id: assessmentSnap.id,
        ...data,
        // Convert Firestore timestamps to readable dates
        completedAt: data.completedAt?.toDate?.() || data.completedAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    } else {
      console.log('No assessment found for user');
      return null;
    }
  } catch (error) {
    console.error('Error getting assessment results:', error);
    throw error;
  }
};

/**
 * Update assessment results
 * @param {string} userId - The authenticated user's ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateAssessmentResults = async (userId, updateData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const assessmentRef = doc(db, ASSESSMENTS_COLLECTION, userId);
    
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(assessmentRef, dataToUpdate);
    console.log('Assessment results updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating assessment results:', error);
    throw error;
  }
};

/**
 * Get all assessments (for admin purposes)
 * @returns {Promise<Array>} - Array of all assessments
 */
export const getAllAssessments = async () => {
  try {
    const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
    const q = query(assessmentsRef);
    const querySnapshot = await getDocs(q);
    
    const assessments = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      assessments.push({
        id: doc.id,
        ...data,
        completedAt: data.completedAt?.toDate?.() || data.completedAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });
    
    return assessments;
  } catch (error) {
    console.error('Error getting all assessments:', error);
    throw error;
  }
};

/**
 * Get assessment statistics
 * @returns {Promise<Object>} - Assessment statistics
 */
export const getAssessmentStats = async () => {
  try {
    const assessments = await getAllAssessments();
    
    const stats = {
      totalAssessments: assessments.length,
      styleDistribution: {
        Authoritative: 0,
        Authoritarian: 0,
        Permissive: 0,
        Neglectful: 0
      },
      averageScores: {
        Authoritative: 0,
        Authoritarian: 0,
        Permissive: 0,
        Neglectful: 0
      }
    };

    assessments.forEach(assessment => {
      if (assessment.dominantStyle) {
        stats.styleDistribution[assessment.dominantStyle]++;
      }
      
      if (assessment.counts) {
        Object.keys(stats.averageScores).forEach(style => {
          stats.averageScores[style] += assessment.counts[style] || 0;
        });
      }
    });

    // Calculate averages
    Object.keys(stats.averageScores).forEach(style => {
      if (stats.totalAssessments > 0) {
        stats.averageScores[style] = (stats.averageScores[style] / stats.totalAssessments).toFixed(2);
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting assessment stats:', error);
    throw error;
  }
};

