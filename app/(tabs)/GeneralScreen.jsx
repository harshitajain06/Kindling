import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GeneralScreen() {
  const navigation = useNavigation();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="heart-outline" size={42} color="#FF99C8" />
        <Text style={styles.logo}>Kindling</Text>
        <Text style={styles.subtitle}>Empowering Parents. Nurturing Growth.</Text>
      </View>


      {/* Parenting Tips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌟 Daily Parenting Tips</Text>
        <View style={styles.tipItem}>
          <Ionicons name="heart-outline" size={20} color="#FF6FB5" />
          <Text style={styles.tipText}>Active listening builds stronger bonds</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="school-outline" size={20} color="#FF6FB5" />
          <Text style={styles.tipText}>Consistent routines reduce stress</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="happy-outline" size={20} color="#FF6FB5" />
          <Text style={styles.tipText}>Praise effort, not just results</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="time-outline" size={20} color="#FF6FB5" />
          <Text style={styles.tipText}>Quality time beats quantity</Text>
        </View>
      </View>

      {/* Parenting Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parenting Tools</Text>
        <View style={styles.categoryGrid}>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Personalized')}
          >
            <Ionicons name="clipboard-outline" size={24} color="#3A506B" />
            <Text style={styles.categoryText}>Assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Personalized')}
          >
            <Ionicons name="book-outline" size={24} color="#FF99C8" />
            <Text style={styles.categoryText}>Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Personalized')}
          >
            <Ionicons name="trending-up-outline" size={24} color="#FF6FB5" />
            <Text style={styles.categoryText}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Personalized')}
          >
            <Ionicons name="star-outline" size={24} color="#1C2541" />
            <Text style={styles.categoryText}>Recommendations</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Parenting Challenges */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Common Challenges</Text>
        <View style={styles.challengeItem}>
          <Ionicons name="bed-outline" size={18} color="#7F8C8D" />
          <Text style={styles.challengeText}>Sleep training and bedtime routines</Text>
        </View>
        <View style={styles.challengeItem}>
          <Ionicons name="restaurant-outline" size={18} color="#7F8C8D" />
          <Text style={styles.challengeText}>Picky eating and nutrition</Text>
        </View>
        <View style={styles.challengeItem}>
          <Ionicons name="phone-portrait-outline" size={18} color="#7F8C8D" />
          <Text style={styles.challengeText}>Screen time management</Text>
        </View>
        <View style={styles.challengeItem}>
          <Ionicons name="warning-outline" size={18} color="#7F8C8D" />
          <Text style={styles.challengeText}>Tantrums and emotional regulation</Text>
        </View>
      </View>

      {/* Strengthen Your Bond */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💝 Strengthen Your Bond</Text>
        <Text style={styles.bondSubtitle}>Build a stronger, more meaningful relationship with your child for all ages</Text>
        
        <View style={styles.bondSection}>
          <Text style={styles.bondSectionTitle}>Daily Connection Activities</Text>
          <View style={styles.bondItem}>
            <Ionicons name="chatbubbles-outline" size={18} color="#FF6FB5" />
            <Text style={styles.bondText}>15 minutes of uninterrupted conversation</Text>
          </View>
          <View style={styles.bondItem}>
            <Ionicons name="book-outline" size={18} color="#FF6FB5" />
            <Text style={styles.bondText}>Read together before bedtime</Text>
          </View>
          <View style={styles.bondItem}>
            <Ionicons name="game-controller-outline" size={18} color="#FF6FB5" />
            <Text style={styles.bondText}>Play their favorite game together</Text>
          </View>
          <View style={styles.bondItem}>
            <Ionicons name="walk-outline" size={18} color="#FF6FB5" />
            <Text style={styles.bondText}>Take a walk and talk about their day</Text>
          </View>
        </View>

        <View style={styles.bondSection}>
          <Text style={styles.bondSectionTitle}>Age-Specific Bonding</Text>
          <View style={styles.ageGroup}>
            <View style={styles.ageHeader}>
              <Ionicons name="baby-outline" size={16} color="#3A506B" />
              <Text style={styles.ageTitle}>Toddlers (1-3 years)</Text>
            </View>
            <Text style={styles.ageContent}>• Sensory play and exploration • Sing songs and nursery rhymes • Cuddle and physical affection</Text>
          </View>
          <View style={styles.ageGroup}>
            <View style={styles.ageHeader}>
              <Ionicons name="school-outline" size={16} color="#FF99C8" />
              <Text style={styles.ageTitle}>Preschoolers (3-5 years)</Text>
            </View>
            <Text style={styles.ageContent}>• Creative arts and crafts • Pretend play and storytelling • Outdoor adventures and nature walks</Text>
          </View>
          <View style={styles.ageGroup}>
            <View style={styles.ageHeader}>
              <Ionicons name="people-outline" size={16} color="#1C2541" />
              <Text style={styles.ageTitle}>School Age (6-12 years)</Text>
            </View>
            <Text style={styles.ageContent}>• Share hobbies and interests • Cook or bake together • Discuss their dreams and goals</Text>
          </View>
        </View>

        <View style={styles.bondSection}>
          <Text style={styles.bondSectionTitle}>Quality Time Ideas</Text>
          <View style={styles.ideaGrid}>
            <View style={styles.ideaCard}>
              <Ionicons name="restaurant-outline" size={20} color="#3A506B" />
              <Text style={styles.ideaText}>Family Dinner</Text>
            </View>
            <View style={styles.ideaCard}>
              <Ionicons name="musical-notes-outline" size={20} color="#FF6FB5" />
              <Text style={styles.ideaText}>Dance Party</Text>
            </View>
            <View style={styles.ideaCard}>
              <Ionicons name="camera-outline" size={20} color="#FF99C8" />
              <Text style={styles.ideaText}>Photo Scavenger Hunt</Text>
            </View>
            <View style={styles.ideaCard}>
              <Ionicons name="leaf-outline" size={20} color="#1C2541" />
              <Text style={styles.ideaText}>Garden Together</Text>
            </View>
          </View>
        </View>
      </View>


      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="heart" size={20} color="#FF6FB5" />
        <Text style={styles.footerText}>Kindling • Growing Together</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    alignItems: "center",
    paddingBottom: 50,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#0B132B",
    width: "100%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FF99C8",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    color: "#EAEAEA",
    textAlign: "center",
    marginTop: 6,
  },
  section: {
    width: "90%",
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C2541",
    marginBottom: 15,
  },
  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C2541",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  tipText: {
    fontSize: 15,
    color: "#3A506B",
    marginLeft: 10,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    width: "47%",
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#1C2541",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  activityText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: "#95A5A6",
    marginTop: 4,
  },
  challengeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 2,
  },
  challengeText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginLeft: 10,
    flex: 1,
  },
  bondSubtitle: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  bondSection: {
    marginBottom: 20,
  },
  bondSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2541",
    marginBottom: 12,
  },
  bondItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 2,
  },
  bondText: {
    fontSize: 14,
    color: "#3A506B",
    marginLeft: 10,
    flex: 1,
  },
  ageGroup: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  ageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ageTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C2541",
    marginLeft: 8,
  },
  ageContent: {
    fontSize: 13,
    color: "#3A506B",
    lineHeight: 18,
  },
  ideaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  ideaCard: {
    backgroundColor: "#F8F9FA",
    width: "47%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  ideaText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    color: "#1C2541",
    textAlign: "center",
  },
});