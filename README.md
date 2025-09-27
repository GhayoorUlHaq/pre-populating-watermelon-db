# Pre-populating Watermelon DB

This React Native project demonstrates how to create a SQLite database with static data and migrate it to WatermelonDB on app startup.

## Features

- **Node.js Script**: Creates a SQLite database with 10 student records
- **WatermelonDB Integration**: Migrates data from SQLite to WatermelonDB
- **Cross-platform**: Works on both Android and iOS
- **Reactive UI**: Automatically updates when WatermelonDB data changes
- **Clean Design**: Modern UI with smooth loading states and feedback

## Project Structure

```
prePopulatingWatermelonDb/
├── scripts/
│   └── create-students-db.js    # Node.js script to create SQLite DB
├── src/
│   ├── screens/
│   │   └── StudentsScreen.tsx   # Main UI component
│   └── utils/
│       └── watermelon/
│           ├── database.ts      # WatermelonDB configuration
│           ├── models.ts        # Student model
│           ├── schema.ts        # Database schema
│           ├── migrations.ts    # Database migrations
│           └── migrateStudents.ts # Migration logic
├── android/app/src/main/assets/
│   └── students.db              # Android bundle
└── ios/prePopulatingWatermelonDb/
    └── students.db              # iOS bundle
```

## How It Works

1. **Database Creation**: The Node.js script creates a SQLite database with 10 student records
2. **Bundle Copying**: The database is copied to Android assets and iOS bundle
3. **App Startup**: When the app starts, WatermelonDB checks if students exist
4. **Migration**: If no students exist, it reads from the bundled SQLite database
5. **Reactive Loading**: UI automatically updates when data becomes available
6. **Data Display**: Students are displayed in a clean, modern list UI with count

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Students Database

```bash
npm run create-students-db
```

This will:
- Create `scripts/students.db` with 10 student records
- Copy the database to Android assets
- Copy the database to iOS bundle

### 3. Run the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## Expected Behavior

When you run the app:
1. **First Launch**: Migration runs, students are copied from SQLite to WatermelonDB
2. **Subsequent Launches**: Students are loaded directly from WatermelonDB (no migration)
3. **Loading State**: Shows loading indicator while migration/data loading is in progress
4. **Automatic Update**: UI automatically updates when students data becomes available
5. **Data Display**: Shows all 10 students with their names, classes, and ages
6. **Reactive**: Clean, reactive interface that responds to database changes

## Key Differences from cbqmethod

Unlike the main cbqmethod app, this project:

- **No Supabase Integration**: Uses static JSON data instead of fetching from Supabase
- **No Version Management**: No config table or version checking
- **No Migration Checks**: Always migrates data on first app start
- **Simplified Schema**: Only one table (students) with basic fields
- **No Complex Logic**: Straightforward migration without conditional paths

## Student Data

The app includes 10 sample students with the following structure:

```json
{
  "name": "Alice Johnson",
  "class": "Grade 10A", 
  "age": 16
}
```

## Migration Process

1. **Check Existing Data**: WatermelonDB checks if students already exist
2. **Skip if Exists**: If students are found, migration is skipped
3. **Read SQLite**: If no students exist, reads from bundled SQLite database
4. **Copy to WatermelonDB**: Inserts all students into WatermelonDB
5. **Cleanup**: Removes temporary files (Android only)

## Troubleshooting

### No Students Showing
- Check console logs for migration errors
- Ensure the database file exists in the correct bundle location

### Migration Errors
- Verify the SQLite database was created successfully
- Check that the bundle files are in the correct locations
- Review console logs for specific error messages

## Dependencies

- `@nozbe/watermelondb`: WatermelonDB for React Native
- `react-native-sqlite-storage`: SQLite database access
- `react-native-fs`: File system operations
- `sqlite3`: Node.js SQLite support (for script)

## Script Usage

The `create-students-db.js` script can be run independently:

```bash
node scripts/create-students-db.js
```

This is useful for:
- Regenerating the database with new data
- Testing the database creation process
- Updating student records
