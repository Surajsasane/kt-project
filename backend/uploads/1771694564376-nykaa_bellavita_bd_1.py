import pandas as pd
from datetime import datetime, timedelta
import pymysql

# Database connection details
DB_HOST = "database-1.cs7wneoxj0b8.us-east-1.rds.amazonaws.com"
DB_USER = "shivam"
DB_PASSWORD = "Trailytics@789"
DB_DATABASE = "idam"
DB_PORT = 3306

# Get the maximum order date from the database
try:
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_DATABASE,

        port=DB_PORT,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    with connection.cursor() as cursor:
        sql = "SELECT MAX(order_date) AS max_order_date FROM tb_wh_dtd_nykaa WHERE brand_id=1"
        cursor.execute(sql)
        result = cursor.fetchone()
        
        max_order_date = result['max_order_date'] if result else None
finally:
    connection.close()

# Ensure the max_order_date is in the desired format
if max_order_date:
    max_order_date = pd.to_datetime(max_order_date).strftime('%Y-%m-%d')
    print("Max order_date from database:", max_order_date)

file_path = r"C:\Users\MICRON\Downloads\YSR_Seller_Portal_Monthly-IDAM NATURAL WELLNESS PRIVATE LTD_February-2026.csv"
columns_to_exclude = ['seller_code', 'Display Name', 'Company Name', 'Seller Type']
df = pd.read_csv(file_path, usecols=lambda column: column not in columns_to_exclude)

# Convert the 'date' column to datetime format
df['date'] = pd.to_datetime(df['date'], errors='coerce')

# Add 'order_date' column based on 'date' column
df['order_date'] = df['date']

# Add 'created_on' column with current datetime
df['created_on'] = datetime.now()   

# Add 'is_latest' column with a value of 1
df['is_latest'] = 1

df['brand_id'] = 1

# Keep only the rows where 'date' (ignoring time components) is equal to the current date minus 2 days
current_date_minus_2 = datetime.now() - timedelta(days=2)
df = df[df['date'].dt.date == current_date_minus_2.date()]

df.fillna(value="", inplace=True)

# Optionally, if you want to reset the index after filtering
# df.reset_index(drop=True, inplace=True)

# Ensure the 'order_date' is in the desired format 'yyyy-mm-dd'
df['order_date'] = df['order_date'].dt.strftime('%Y-%m-%d')



first_order_date = df['order_date'].min()
last_order_date = df['order_date'].max()

print("First order_date:", first_order_date)
print("Last order_date:", last_order_date)
print(df.head())
print(df.shape)

# Check the conditions
if first_order_date == last_order_date:
    df_order_date = first_order_date
    max_order_date_check = (pd.to_datetime(df_order_date) - timedelta(days=1)).strftime('%Y-%m-%d')
    
    if max_order_date == max_order_date_check:
        print("Conditions satisfied. Proceeding with ingestion.")
        # Establish a connection to the MySQL server
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            db=DB_DATABASE,
            port=DB_PORT,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        try:
            # Create a cursor object
            cursor = connection.cursor()
        
            # Assuming 'your_table_name' is the desired table name
            table_name = 'tb_wh_dtd_nykaa'
        
            for _, row in df.iterrows():
                insert_query = f"INSERT INTO {table_name} VALUES {tuple(row.values)}"
                print(insert_query)
                cursor.execute(insert_query)
        
            # Commit the changes
            connection.commit()
        
            # Print a message indicating the successful operation
            print("DataFrame has been successfully ingested into the MySQL database")
        
        finally:
            # Close the cursor and connection
            cursor.close()
            connection.close()
    else:
        print("Max order_date from database is not one day less than df_order_date. SO Ingestion Nahi hoga bhai kitini bhi koshish karle.........")
else:
    print(" Dates match nahi kar rahi hai,SO Ingestion Nahi hoga bhai kitini bhi koshish karle.........")
