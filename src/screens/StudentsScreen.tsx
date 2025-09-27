import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {database} from '../utils/watermelon/database';
import {Student} from '../utils/watermelon/models';

interface StudentItemProps {
  student: Student;
}

const StudentItem: React.FC<StudentItemProps> = ({student}) => {
  return (
    <View style={styles.studentItem}>
      <Text style={styles.studentName}>{student.name}</Text>
      <Text style={styles.studentClass}>Class: {student.class}</Text>
      <Text style={styles.studentAge}>Age: {student.age}</Text>
    </View>
  );
};

const StudentsScreen: React.FC = () => {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchStudents = async () => {
    try {
      console.log('🔄 Fetching students from WatermelonDB...');
      const studentsCollection = database.collections.get('students');
      const allStudents = await studentsCollection.query().fetch();
      setStudents(allStudents);
      setLoading(false);
      console.log(`✅ Fetched ${allStudents.length} students from WatermelonDB`);
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStudents();

    // Set up observer for changes (observe entire table like cbqmethod)
    const studentsCollection = database.collections.get('students');
    const subscription = studentsCollection.query().observe().subscribe({
      next: (students) => {
        console.log('📊 Students table changed, updating state directly');
        console.log(`Found ${students.length} students in WatermelonDB`);
        setStudents(students);
        setLoading(false);
      },
      error: (error) => {
        console.error('❌ Error in WatermelonDB observer:', error);
        setLoading(false);
      },
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up WatermelonDB observer');
      subscription.unsubscribe();
    };
  }, []);

  const renderStudent = ({item}: {item: Student}) => (
    <StudentItem student={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading students...</Text>
          <Text style={styles.loadingSubtext}>
            Migration in progress or no data available
          </Text>
        </View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderStudent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.headerInfo}>
              <Text style={styles.headerInfoText}>
                Found {students.length} students
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 16,
  },
  headerInfo: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerInfoText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
    textAlign: 'center',
  },
  studentItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentClass: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  studentAge: {
    fontSize: 14,
    color: '#666',
  },
});

export default StudentsScreen;
