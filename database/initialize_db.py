import sqlite3

def initialize_database():
    # Connect to the SQLite database (creates the file if it doesn't exist)
    conn = sqlite3.connect('sales_forecasting.db')
    cursor = conn.cursor()

    # Execute the schema to create tables
    cursor.executescript('''
    -- Products Table
    CREATE TABLE IF NOT EXISTS Products (
        ProductID INTEGER PRIMARY KEY,
        ProductName TEXT NOT NULL,
        Category TEXT,
        Brand TEXT,
        Price REAL,
        LaunchDate DATE,
        StockQuantity INTEGER,
        Description TEXT
    );

    -- SalesData Table
    CREATE TABLE IF NOT EXISTS SalesData (
        SalesID INTEGER PRIMARY KEY,
        ProductID INTEGER,
        Date DATE,
        UnitsSold INTEGER,
        Revenue REAL,
        CustomerSegment TEXT,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    );

    -- Reviews Table
    CREATE TABLE IF NOT EXISTS Reviews (
        ReviewID INTEGER PRIMARY KEY,
        ProductID INTEGER,
        ReviewerName TEXT,
        ReviewDate DATE,
        ReviewText TEXT,
        Rating INTEGER,
        SentimentScore REAL,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    );

    -- Customers Table (Optional)
    CREATE TABLE IF NOT EXISTS Customers (
        CustomerID INTEGER PRIMARY KEY,
        Name TEXT,
        Email TEXT,
        AgeGroup TEXT,
        Location TEXT
    );

    -- ScrapingLog Table (Optional)
    CREATE TABLE IF NOT EXISTS ScrapingLog (
        ScrapingID INTEGER PRIMARY KEY,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        Website TEXT,
        Status TEXT,
        Comments TEXT
    );
    ''')

    # Commit changes and close connection
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

# Run the function
if __name__ == "__main__":
    initialize_database()
