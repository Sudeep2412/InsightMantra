import sqlite3
import pandas as pd

def populate_database_from_csv(db_name, csv_file):
    """
    Populates multiple database tables from a single CSV file.
    
    Parameters:
    - db_name: str, name of the SQLite database file.
    - csv_file: str, path to the CSV file.
    """
    # Connect to the SQLite database
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Load the CSV into a Pandas DataFrame
    df = pd.read_csv(csv_file)

    # Process each table
    table_names = df['TableName'].unique()
    for table_name in table_names:
        table_data = df[df['TableName'] == table_name]  # Filter rows for this table
        table_data = table_data.drop(columns=['TableName'])  # Drop the TableName column

        # Remove columns with all NaN values (columns not relevant to this table)
        table_data = table_data.dropna(axis=1, how='all')

        try:
            # Insert data into the corresponding table
            table_data.to_sql(table_name, conn, if_exists='append', index=False)
            print(f"Data inserted successfully into {table_name}.")
        except Exception as e:
            print(f"Error inserting data into {table_name}: {e}")

    # Close the database connection
    conn.close()

# Populate the database
if __name__ == "__main__":
    db_name = "sales_forecasting.db"
    csv_file = "database_data.csv"
    populate_database_from_csv(db_name, csv_file)
