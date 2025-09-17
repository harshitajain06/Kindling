import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GeneralScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Kindling</Text>
        <Text style={styles.tagline}>General Parenting Resources</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="book-outline" size={32} color="#3498DB" />
          <Text style={styles.actionText}>Articles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="play-circle-outline" size={32} color="#E74C3C" />
          <Text style={styles.actionText}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="chatbubbles-outline" size={32} color="#27AE60" />
          <Text style={styles.actionText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="calendar-outline" size={32} color="#F39C12" />
          <Text style={styles.actionText}>Events</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Content */}
      <View style={styles.featuredBox}>
        <Text style={styles.sectionTitle}>Featured Content</Text>
        <View style={styles.contentItem}>
          <Ionicons name="star" size={20} color="#F1C40F" />
          <Text style={styles.contentText}>10 Tips for Better Communication with Your Child</Text>
        </View>
        <View style={styles.contentItem}>
          <Ionicons name="star" size={20} color="#F1C40F" />
          <Text style={styles.contentText}>Understanding Different Learning Styles</Text>
        </View>
        <View style={styles.contentItem}>
          <Ionicons name="star" size={20} color="#F1C40F" />
          <Text style={styles.contentText}>Building Emotional Intelligence in Children</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesBox}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryItem}>
            <Ionicons name="school-outline" size={24} color="#3498DB" />
            <Text style={styles.categoryText}>Education</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Ionicons name="heart-outline" size={24} color="#E74C3C" />
            <Text style={styles.categoryText}>Emotional</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Ionicons name="fitness-outline" size={24} color="#27AE60" />
            <Text style={styles.categoryText}>Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Ionicons name="people-outline" size={24} color="#F39C12" />
            <Text style={styles.categoryText}>Social</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityBox}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Ionicons name="time-outline" size={16} color="#6C757D" />
          <Text style={styles.activityText}>Last read: "Positive Discipline Techniques"</Text>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="time-outline" size={16} color="#6C757D" />
          <Text style={styles.activityText}>Watched: "Managing Screen Time"</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  header: { 
    padding: 20, 
    alignItems: "center" 
  },
  logo: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#2C3E50" 
  },
  tagline: { 
    fontSize: 16, 
    color: "#6C757D", 
    marginTop: 8, 
    textAlign: "center" 
  },
  quickActions: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    width: "90%", 
    marginVertical: 20 
  },
  actionCard: { 
    alignItems: "center", 
    justifyContent: "center", 
    width: 80,
    padding: 10,
  },
  actionText: { 
    marginTop: 8, 
    fontSize: 14, 
    fontWeight: "500", 
    textAlign: "center",
    color: "#2C3E50"
  },
  featuredBox: { 
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 20, 
    borderRadius: 16, 
    width: "90%",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 12,
    flex: 1,
  },
  categoriesBox: { 
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 20, 
    borderRadius: 16, 
    width: "90%",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: "#2C3E50",
    marginTop: 8,
    textAlign: 'center',
  },
  activityBox: { 
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 20, 
    borderRadius: 16, 
    width: "90%",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityText: {
    fontSize: 14,
    color: "#6C757D",
    marginLeft: 8,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#2C3E50",
    marginBottom: 15,
    textAlign: "center" 
  },
});
