CREATE TABLE sales (
  Row_ID INT,
  Order_ID VARCHAR(50),
  Order_Date DATE,
  Ship_Date DATE,
  Ship_Mode VARCHAR(50),
  Customer_ID VARCHAR(50),
  Customer_Name VARCHAR(100),
  Segment VARCHAR(50),
  Country VARCHAR(50),
  City VARCHAR(50),
  State VARCHAR(50),
  Postal_Code VARCHAR(20),
  Region VARCHAR(50),
  Product_ID VARCHAR(50),
  Category VARCHAR(50),
  Sub_Category VARCHAR(50),
  Product_Name VARCHAR(255),
  Sales NUMERIC(10,2)
);
SET datestyle = 'DMY';
COPY Sales(Row_ID, Order_ID, Order_Date, Ship_Date, Ship_Mode, Customer_ID, Customer_Name, Segment, Country, City, State, Postal_Code, Region, Product_ID, category, Sub_Category, Product_Name, sales)
FROM '/dataset/sales.csv'
WITH CSV HEADER;
