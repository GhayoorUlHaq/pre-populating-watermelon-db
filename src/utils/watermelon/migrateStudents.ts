import {database} from './database';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

/**
 * Migrate students from bundled SQLite database to WatermelonDB
 */
export const migrateStudents = async () => {
  try {
    console.log('🔄 Starting students migration...');

    // Check if students already exist in WatermelonDB
    const existingStudents = await database.collections
      .get('students')
      .query()
      .fetch();

    console.log(`Found ${existingStudents.length} existing students in database`);

    if (existingStudents.length > 0) {
      console.log(`Students already exist in database (${existingStudents.length} students), skipping migration`);
      return;
    }

    console.log('No students found, copying from bundled SQLite database...');

    // Find path to the bundled SQLite database
    let bundledPath = '';

    if (Platform.OS === 'android') {
      // Create temp directory and copy from APK assets to internal storage
      const androidTempDir = `${RNFS.DocumentDirectoryPath}/tempSqliteDb`;
      const androidTempPath = `${androidTempDir}/students.db`;

      // Create temp directory if it doesn't exist
      try {
        const dirExists = await RNFS.exists(androidTempDir);
        if (!dirExists) {
          await RNFS.mkdir(androidTempDir);
        }
      } catch (_) {
        // ignore directory creation error
      }

      // Copy the asset "students.db" -> temp path
      await RNFS.copyFileAssets('students.db', androidTempPath);
      console.log(`📁 Copied bundled SQLite to temp path: ${androidTempPath}`);
      bundledPath = androidTempPath;
    } else {
      // iOS: read directly from main bundle
      bundledPath = `${RNFS.MainBundlePath}/students.db`;
    }

    // Ensure the file is actually present before proceeding
    const hasFile = await RNFS.exists(bundledPath);
    if (!hasFile) {
      throw new Error(`Bundled SQLite file not found at: ${bundledPath}`);
    }

    console.log('📖 Reading bundled SQLite database from:', bundledPath);

    // Read data from bundled SQLite database
    const bundledData = await readBundledSQLiteData(bundledPath);

    // Migrate data to WatermelonDB
    await migrateDataToWatermelonDB(bundledData);

    // Clean up temp file on Android
    if (Platform.OS === 'android') {
      try {
        await RNFS.unlink(bundledPath);
        console.log('🧹 Cleaned up temp file');
      } catch (cleanupError) {
        console.log('⚠️ Could not clean up temp file:', cleanupError);
      }
    }

    console.log('✅ Students migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
};

/**
 * Read data from bundled SQLite database
 */
const readBundledSQLiteData = async (dbPath: string) => {
  return new Promise((resolve, reject) => {
    // Use the actual file path instead of createFromLocation
    const bundledDb = SQLite.openDatabase({
      name: dbPath,
      location: 'default',
    });

    console.log('✅ Bundled database opened successfully');

    bundledDb.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM students',
          [],
          (tx, results) => {
            const students = [];
            for (let i = 0; i < results.rows.length; i++) {
              students.push(results.rows.item(i));
            }
            console.log(`📊 Read ${students.length} students from bundled database`);
            resolve({students});
          },
          (tx, error) => {
            console.error('Error reading bundled SQLite data:', error);
            reject(error);
          }
        );
      },
      error => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Migrate data to WatermelonDB
 */
const migrateDataToWatermelonDB = async (bundledData: any) => {
  try {
    await database.write(async () => {
      // Insert students from bundled data
      if (bundledData.students && bundledData.students.length > 0) {
        console.log(
          `📝 Inserting ${bundledData.students.length} students from bundled data`
        );

        for (const studentData of bundledData.students) {
          await database.collections.get('students').create(studentRecord => {
            studentRecord._raw.id = studentData.id.toString();
            studentRecord.name = studentData.name;
            studentRecord.class = studentData.class;
            studentRecord.age = studentData.age;
          });
        }

        console.log(
          `✅ Successfully inserted ${bundledData.students.length} students`
        );
      }
    });
  } catch (error) {
    console.error('Error migrating data to WatermelonDB:', error);
    throw error;
  }
};
