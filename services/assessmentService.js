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
        Neglectful: 0,
        Uninvolved: 0,
        Mixed: 0
      },
      averageScores: {
        Authoritative: 0,
        Authoritarian: 0,
        Permissive: 0,
        Neglectful: 0,
        Uninvolved: 0
      }
    };

    assessments.forEach(assessment => {
      if (assessment.dominantStyle) {
        // Handle both old and new style names
        const styleKey = assessment.dominantStyle === 'Uninvolved' ? 'Neglectful' : assessment.dominantStyle;
        if (stats.styleDistribution.hasOwnProperty(styleKey) || stats.styleDistribution.hasOwnProperty(assessment.dominantStyle)) {
          stats.styleDistribution[assessment.dominantStyle] = (stats.styleDistribution[assessment.dominantStyle] || 0) + 1;
        }
      }
      
      // Handle both old format (counts) and new format (scores)
      const scoreData = assessment.scores || assessment.counts;
      if (scoreData) {
        Object.keys(stats.averageScores).forEach(style => {
          // Map Uninvolved to Neglectful for backward compatibility
          const sourceStyle = style === 'Neglectful' ? (scoreData.Uninvolved !== undefined ? 'Uninvolved' : style) : style;
          stats.averageScores[style] += scoreData[sourceStyle] || 0;
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

/**
 * Save challenge progress to Firebase
 * @param {string} userId - The authenticated user's ID
 * @param {Object} challengeProgress - The challenge progress data
 * @returns {Promise<boolean>} - Success status
 */
export const saveChallengeProgress = async (userId, challengeProgress) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const assessmentRef = doc(db, ASSESSMENTS_COLLECTION, userId);
    
    const dataToUpdate = {
      challengeProgress,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(assessmentRef, dataToUpdate);
    console.log('Challenge progress saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving challenge progress:', error);
    throw error;
  }
};

/**
 * Get challenge progress for a user
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<Object|null>} - Challenge progress or null if not found
 */
export const getChallengeProgress = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const assessmentRef = doc(db, ASSESSMENTS_COLLECTION, userId);
    const assessmentSnap = await getDoc(assessmentRef);

    if (assessmentSnap.exists()) {
      const data = assessmentSnap.data();
      return data.challengeProgress || {};
    } else {
      console.log('No assessment found for user');
      return {};
    }
  } catch (error) {
    console.error('Error getting challenge progress:', error);
    throw error;
  }
};

