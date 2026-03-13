import pandas as pd
from datetime import datetime
import pymysql
 
# Database connection details
DB_HOST = "database-1.cs7wneoxj0b8.us-east-1.rds.amazonaws.com"
DB_USER = "shivam"
DB_PASSWORD = "Trailytics@789"
DB_DATABASE = "idam"
DB_PORT = 3306
 
# File path
file_path = r"C:\Users\MICRON\Downloads\189429020504 (1).txt"
delimiter = '\t'
                     
def transform_datetime(dt_str):
    dt_str = dt_str.split('T')[0]
    return pd.to_datetime(dt_str)
# Step 1: Load and preprocess the data
print("Loading data...")
df = pd.read_csv(file_path, delimiter=delimiter, encoding='utf-8')
 
# Check columns
print("Columns in DataFrame:", df.columns)
# Convert date columns
from datetime import datetime, timedelta
two_days_ago = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
 
# Update the 'purchase-date' column with the same date

df['last-updated-date'] = df['last-updated-date'].astype(str).apply(transform_datetime)
df['purchase-date'] = df['purchase-date'].astype(str)
def transform_datetime(dt_str):
    # Remove 'T' and '+00:00'
    dt_str = dt_str.replace('T', ' ').replace('+00:00', '')
    # Convert to datetime
    dt = pd.to_datetime(dt_str)
    # Subtract 7 hours
    dt = dt - pd.Timedelta(hours=1)
    return dt

# Process date columns
df['purchase-date'] = df['purchase-date'].apply(transform_datetime)
df['purchase-date'] =two_days_ago
# Filter for Amazon.com.au sales
df = df[df['sales-channel'] == 'Amazon.co.uk']

 
# Process numeric columns
numeric_columns = [
    'item-price', 'shipping-price', 'gift-wrap-price',
    'item-promotion-discount', 'ship-promotion-discount','item-tax'
]
for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
                                                               
# Calculate Sale_AUD and Sale_INR
df['Sale_POUND'] = (
    df['item-price'] - df['item-tax']+
    df['shipping-price'] +
    df['gift-wrap-price'] -
    df['item-promotion-discount'] -
    df['ship-promotion-discount']
)
df['Sale_INR'] = df['Sale_POUND'] *122.73
 
# Add timestamp and metadata columns
df["created_on"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
df["is_latest"] = 1
df["brand_id"] = 1
df = df.fillna(0)
 
# Ensure all required columns exist
required_columns = ['promotion_ids']
for col in required_columns:
    if col not in df.columns:
        df[col] = ""
 
# print(df.head())
print(df.shape)
 
# Rename columns to match database schema
df.rename(columns={
    'amazon-order-id': 'amazon_order_id',
    'merchant-order-id': 'merchant_order_id',
    'purchase-date': 'purchase_date',
    'last-updated-date': 'last_updated_date',
    'order-status': 'order_status',
    'fulfillment-channel': 'fulfillment_channel',
    'sales-channel': 'sales_channel',
    'order-channel': 'order_channel',
    'ship-service-level': 'ship_service_level',
    'product-name': 'product_name',
    'item-status': 'item_status',
    'item-price': 'item_price',
    'item-tax': 'item_tax',
    'shipping-price': 'shipping_price',
    'shipping-tax': 'shipping_tax',
    'gift-wrap-price': 'gift_wrap_price',
    'gift-wrap-tax': 'gift_wrap_tax',
    'item-promotion-discount': 'item_promotion_discount',
    'ship-promotion-discount': 'ship_promotion_discount',
    'ship-city': 'ship_city',
    'ship-state': 'ship_state',
    'ship-postal-code': 'ship_postal_code',
    'ship-country': 'ship_country',
    'promotion-ids': 'promotion_ids'
}, inplace=True)
 
# # Save cleaned data for debugging
# output_file = r"C:\Users\MICRON\Music\ecom update data\auaua.csv"
# df.to_csv(output_file, index=False)
# print("Cleaned data saved to:", output_file)
print(df.head())
print(df.shape)
# exit()
# Step 3: Insert data into the database
try:
    print("Connecting to the database...")
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_DATABASE,
        port=DB_PORT,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    print("Connected to the database.")

    with connection.cursor() as cursor:

        insert_query = """
        INSERT INTO tb_wh_dtd_amazon_uk (
            amazon_order_id, merchant_order_id, purchase_date, last_updated_date,
            order_status, fulfillment_channel, sales_channel, order_channel,
            ship_service_level, product_name, sku, asin, item_status,
            quantity, currency, item_price, item_tax, shipping_price,
            shipping_tax, gift_wrap_price, gift_wrap_tax,
            item_promotion_discount, ship_promotion_discount, ship_city,
            ship_state, ship_postal_code, ship_country, promotion_ids,
            Sale_POUND, Sale_INR, created_on, is_latest, brand_id
        ) VALUES (
            %(amazon_order_id)s, %(merchant_order_id)s, %(purchase_date)s, %(last_updated_date)s,
            %(order_status)s, %(fulfillment_channel)s, %(sales_channel)s, %(order_channel)s,
            %(ship_service_level)s, %(product_name)s, %(sku)s, %(asin)s, %(item_status)s,
            %(quantity)s, %(currency)s, %(item_price)s, %(item_tax)s, %(shipping_price)s,
            %(shipping_tax)s, %(gift_wrap_price)s, %(gift_wrap_tax)s,
            %(item_promotion_discount)s, %(ship_promotion_discount)s, %(ship_city)s,
            %(ship_state)s, %(ship_postal_code)s, %(ship_country)s, %(promotion_ids)s,
            %(Sale_POUND)s, %(Sale_INR)s, %(created_on)s, %(is_latest)s, %(brand_id)s
        )
        """

        data = df.to_dict("records")   # Convert all rows at once

        cursor.executemany(insert_query, data)  # BULK INSERT
        connection.commit()

        print("Data inserted successfully in bulk.")

except Exception as e:
    print("An error occurred:", e)

finally:
    if connection:
        connection.close()
    print("Database connection closed.")
