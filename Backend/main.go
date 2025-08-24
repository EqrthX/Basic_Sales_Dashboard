package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var db *sqlx.DB

type Sale struct {
	Order_ID      string    `json:"Order_ID" db:"order_id"`
	Order_Date    time.Time `json:"Order_Date" db:"order_date"`
	Customer_Name *string   `json:"Customer_Name" db:"customer_name"`
	Segment       *string   `json:"Segment" db:"segment"`
	City          *string   `json:"City" db:"city"`
	Product_Name  *string   `json:"Product_Name" db:"product_name"`
	Sales         *float64  `json:"Sales" db:"sales"`
}

type FilterYear struct {
	Year int `json:"year"`
}

type ShipModeStats struct {
	ShipMode  string `db:"ship_mode"`
	ShipCount int    `db:"ship_count"`
}

type ProductAndSales struct {
	ProductName  string   `db:"product_name"`
	CountProduct int      `db:"count_product"`
	TotalSales   *float64 `db:"total_sales"`
}

type TotalProduct struct {
	ProductName  string `db:"product_name"`
	CountProduct int    `db:"count_product"`
}

type SaleMonth struct {
	OrderYear  int      `db:"order_year" json:"order_year"`
	OrderMonth int      `db:"order_month" json:"order_month"`
	Sales      *float64 `db:"sales" json:"sales"`
}
type CountOrder struct {
	OrderID int `db:"order_id" json:"order_id"`
}

type CountShipment struct {
	Ship_Mode int `db:"ship_mode" json:"ship_mode"`
}

type SumSales struct {
	Sales    float64 `db:"sales" json:"sales"`
	AvgSales float64 `db:"avg_sales" json:"avg_sales"`
}

// ดึงข้อมูลทั้งหมดจากตาราง sales
func getSalesAll(c *gin.Context) {
	var sales []Sale

	err := db.Select(&sales, "SELECT order_id, order_date, customer_name, segment, city, product_name, sales FROM sales")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sales)
}

func getFilterYearSales(c *gin.Context) {
	yearStr := c.Query("year")
	if yearStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "year parameter is empty"})
		return
	}

	year, err := strconv.Atoi(yearStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "year must be a number"})
		return
	}

	var count int
	query := "select count(order_date) from sales where extract(year from order_date) = $1"
	err = db.Get(&count, query, year)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Count Year " + string(year): count})
}

func getShipMode(c *gin.Context) {

	var results []ShipModeStats

	query := `
        SELECT 
            ship_mode,
			count(ship_mode) as ship_count
        FROM sales
        GROUP BY ship_mode
    `

	err := db.Select(&results, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}

func getProductAndSaleSum(c *gin.Context) {

	var results []ProductAndSales

	query := `
		select 
			product_name,
			count(product_name) as count_product,
			SUM(sales) as total_sales
		from sales
		group by product_name
	`

	err := db.Select(&results, query)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}

func getTotalProduct_Sale(c *gin.Context) {

	var results []TotalProduct

	query := `
		select 
			product_name,
			count(product_name) as count_product
		from sales
		group by product_name
	`

	err := db.Select(&results, query)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}

func getTopProduct(c *gin.Context) {
	var results []ProductAndSales

	query := `
		select 
			product_name,
			count(product_name) as count_product,
			SUM(Sales) as Total_sales
		from sales
		group by product_name
		order by Total_sales DESC
		limit 10
	`

	err := db.Select(&results, query)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}

func getSaleMounth(c *gin.Context) {

	var sales []SaleMonth
	query := `
	select
		extract(YEAR from order_date)::int as order_year,
		extract(MONTH from order_date)::int as order_month,
		SUM(sales)::float8 as sales
	from sales
	group by order_year, order_month
	order by order_year, order_month
	`
	_, err := db.Queryx(query)

	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}

	err = db.Select(&sales, query)

	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(200, sales)
}

func countOrders(c *gin.Context) {
	{

		var count CountOrder

		query := `
		select
			count(order_id) as order_id
		from sales
	`

		err := db.Get(&count, query)

		if err != nil {
			c.JSON(500, gin.H{"Error": err.Error()})
			return
		}

		c.JSON(200, count)
	}
}

func sumSales(c *gin.Context) {

	var sale SumSales

	query := `
		select
			sum(sales) as sales,
			avg(sales) as avg_sales
		from sales
	`

	err := db.Get(&sale, query)

	if err != nil {
		c.JSON(500, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(200, sale)
}

func main() {
	var err error
	const maxRetries = 10

	// รอจนกว่าจะ connect DB ได้
	for i := 0; i < maxRetries; i++ {
		db, err = sqlx.Connect("postgres", "host=db user=postgres password=postgres dbname=Basic_Sales_Dashboard sslmode=disable")
		if err == nil {
			break
		}
		log.Printf("Waiting for database to be ready... retry %d/%d: %v", i+1, maxRetries, err)
		time.Sleep(3 * time.Second)
	}

	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}

	// Router
	route := gin.Default()
	route.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // React dev server
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	route.GET("/products", getSalesAll)
	route.GET("/countOrder", countOrders)
	route.GET("/sumSale", sumSales)
	route.GET("/filterYear", getFilterYearSales)
	route.GET("/ship-mode", getShipMode)
	route.GET("/productsale", getProductAndSaleSum)
	route.GET("/totalproduct", getTotalProduct_Sale)
	route.GET("/topProduct", getTopProduct)
	route.GET("/getSalesMonth", getSaleMounth)

	log.Println("Starting backend server...")
	if err := route.Run(":8080"); err != nil {
		log.Fatal("Failed to run server: %v", err)
	}
}
