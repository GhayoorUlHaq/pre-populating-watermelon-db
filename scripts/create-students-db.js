const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Static student data
const studentsData = [
  { name: 'Alice Johnson', class: 'Grade 10A', age: 16 },
  { name: 'Bob Smith', class: 'Grade 9B', age: 15 },
  { name: 'Charlie Brown', class: 'Grade 11A', age: 17 },
  { name: 'Diana Prince', class: 'Grade 10B', age: 16 },
  { name: 'Ethan Hunt', class: 'Grade 12A', age: 18 },
  { name: 'Fiona Green', class: 'Grade 9A', age: 15 },
  { name: 'George Wilson', class: 'Grade 11B', age: 17 },
  { name: 'Hannah Davis', class: 'Grade 10A', age: 16 },
  { name: 'Ian Murphy', class: 'Grade 12B', age: 18 },
  { name: 'Julia Roberts', class: 'Grade 9B', age: 15 }
];

async function createStudentsDatabase() {
  try {
    console.log('🚀 Creating SQLite database with students data...');
    
    // Create SQLite database file
    const outputPath = path.join(__dirname, 'students.db');
    
    // Remove existing database file if it exists
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    // Create new SQLite database
    const db = new sqlite3.Database(outputPath);

    // Create the database schema and insert data
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        // Create students table
        db.run(`
          CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            class TEXT NOT NULL,
            age INTEGER NOT NULL
          )
        `, (err) => {
          if (err) {
            console.error('Error creating students table:', err);
            reject(err);
            return;
          }
          console.log('Students table created successfully');
        });

        // Insert students data
        const stmt = db.prepare(`
          INSERT INTO students (name, class, age) VALUES (?, ?, ?)
        `);

        studentsData.forEach((student) => {
          stmt.run([student.name, student.class, student.age]);
        });

        stmt.finalize((err) => {
          if (err) {
            console.error('Error inserting students data:', err);
            reject(err);
            return;
          }
          console.log(`Inserted ${studentsData.length} students into SQLite database`);
          resolve();
        });
      });
    });

    db.close();
    console.log(`Students database saved to: ${outputPath}`);

    // Copy to Android assets
    const androidAssetsDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets');
    const androidTargetPath = path.join(androidAssetsDir, 'students.db');
    
    // Create Android assets directory if it doesn't exist
    if (!fs.existsSync(androidAssetsDir)) {
      fs.mkdirSync(androidAssetsDir, { recursive: true });
    }
    
    fs.copyFileSync(outputPath, androidTargetPath);
    console.log(`Copied to Android assets: ${androidTargetPath}`);

    // iOS bundle will reference the file directly from scripts directory
    console.log(`iOS bundle will reference: ${outputPath}`);

    console.log('\n✅ Script completed successfully!');
    console.log(`📊 Created database with ${studentsData.length} students`);

  } catch (error) {
    console.error('Error creating students database:', error.message);
    process.exit(1);
  }
}

// Run the script
createStudentsDatabase();
