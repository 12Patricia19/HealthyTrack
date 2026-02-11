import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { statsService } from '../services/statsService';
import { goalService } from '../services/goalService';
import dailyHabitService from '../services/dailyHabitService';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [recentHabits, setRecentHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadAllData();
      }
    }, [user])
  );

  const loadAllData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [statsData, goalsData, completedGoalsData, habitsData] = await Promise.all([
        statsService.getUserStats(user.id).catch(() => ({})),
        goalService.getActiveGoals(user.id).catch(() => []),
        goalService.getCompletedGoals(user.id).catch(() => []),
        dailyHabitService.getAllDailyHabits().catch(() => [])
      ]);
      setStats(statsData);
      setGoals(goalsData.slice(0, 3)); // Mostrar solo las 3 primeras
      setCompletedGoals(completedGoalsData.slice(0, 3)); // Mostrar solo las 3 más recientes
      setRecentHabits(habitsData.slice(0, 5)); // Mostrar solo los 5 más recientes
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const getProgressPercentage = (goal) => {
    // Si la meta está completada, siempre mostrar 100%
    if (!goal.isActive) return 100;
    if (!goal.currentValue || !goal.targetValue) return 0;
    return Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Hoy';
    if (date.toDateString() === yesterday.toDateString()) return 'Ayer';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (loading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user.fullName}</Text>
        <Text style={styles.subtitle}>Resumen de tu actividad</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.primaryCard]}>
          <Text style={styles.statValue}>{stats?.habitsToday || 0}</Text>
          <Text style={styles.statLabel}>Hábitos Hoy</Text>
        </View>

        <View style={[styles.statCard, styles.secondaryCard]}>
          <Text style={styles.statValue}>{stats?.habitsThisWeek || 0}</Text>
          <Text style={styles.statLabel}>Esta Semana</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.accentCard]}>
          <Text style={styles.statValue}>{stats?.habitsThisMonth || 0}</Text>
          <Text style={styles.statLabel}>Este Mes</Text>
        </View>

        <View style={[styles.statCard, styles.neutralCard]}>
          <Text style={styles.statValue}>{stats?.totalHabits || 0}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Metas Activas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
            <Text style={styles.seeAll}>Ver todas →</Text>
          </TouchableOpacity>
        </View>
        {goals.length === 0 ? (
          <Text style={styles.emptyText}>No tienes metas activas. ¡Crea una en la pestaña Metas!</Text>
        ) : (
          goals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalCardHeader}>
                <Text style={styles.goalCardName}>{goal.goalName}</Text>
                <Text style={styles.goalCardPercentage}>{getProgressPercentage(goal)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${getProgressPercentage(goal)}%` }]} />
              </View>
              <Text style={styles.goalCardProgress}>
                {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
              </Text>
            </View>
          ))
        )}
      </View>

      {completedGoals.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎉 Metas Completadas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
              <Text style={styles.seeAll}>Ver todas →</Text>
            </TouchableOpacity>
          </View>
          {completedGoals.map((goal) => (
            <View key={goal.id} style={styles.completedGoalCard}>
              <View style={styles.completedGoalHeader}>
                <Text style={styles.completedGoalBadge}>✓</Text>
                <View style={styles.completedGoalInfo}>
                  <Text style={styles.completedGoalName}>{goal.goalName}</Text>
                  <Text style={styles.completedGoalText}>
                    Objetivo: {goal.targetValue} {goal.unit}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hábitos Recientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Habits')}>
            <Text style={styles.seeAll}>Ver todos →</Text>
          </TouchableOpacity>
        </View>
        {recentHabits.length === 0 ? (
          <Text style={styles.emptyText}>No has registrado hábitos aún. ¡Comienza en la pestaña Hábitos!</Text>
        ) : (
          recentHabits.map((habit) => (
            <View key={habit.id} style={styles.habitCard}>
              <View style={styles.habitCardHeader}>
                <View style={styles.habitCardLeft}>
                  <Text style={styles.habitCardName}>{habit.habitName}</Text>
                  <Text style={styles.habitCardType}>{habit.habitType}</Text>
                </View>
                <View style={styles.habitCardRight}>
                  <Text style={styles.habitCardDate}>{formatDate(habit.date)}</Text>
                  {habit.value && (
                    <Text style={styles.habitCardValue}>
                      {habit.value} {habit.unit}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {stats?.topHabits && stats.topHabits.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus Hábitos Más Frecuentes</Text>
          {stats.topHabits.map((habit, index) => (
            <View key={index} style={styles.habitItem}>
              <View style={styles.habitRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.habitType}</Text>
                <Text style={styles.habitCount}>{habit.count} registros</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 30,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e8f5e9',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#4CAF50',
  },
  secondaryCard: {
    backgroundColor: '#2196F3',
  },
  accentCard: {
    backgroundColor: '#FF9800',
  },
  neutralCard: {
    backgroundColor: '#9E9E9E',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAll: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  goalCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  goalCardPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  goalCardProgress: {
    fontSize: 13,
    color: '#666',
  },
  completedGoalCard: {
    backgroundColor: '#f0f8f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#66BB6A',
  },
  completedGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedGoalBadge: {
    fontSize: 24,
    color: '#66BB6A',
    fontWeight: 'bold',
    marginRight: 12,
    width: 32,
    height: 32,
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
  },
  completedGoalInfo: {
    flex: 1,
  },
  completedGoalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  completedGoalText: {
    fontSize: 13,
    color: '#666',
  },
  habitCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  habitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitCardLeft: {
    flex: 1,
  },
  habitCardRight: {
    alignItems: 'flex-end',
  },
  habitCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  habitCardType: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
  },
  habitCardDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  habitCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  goalStat: {
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  achievedValue: {
    color: '#FF9800',
  },
  goalLabel: {
    fontSize: 14,
    color: '#666',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  habitRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  habitCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
