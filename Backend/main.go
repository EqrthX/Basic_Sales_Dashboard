package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var db *sqlx.DB

type Sale struct {
	Row_ID        int       `json:"Row_ID" db:"row_id"`
	Order_ID      string    `json:"Order_ID" db:"order_id"`
	Order_Date    time.Time `json:"Order_Date" db:"order_date"`
	Ship_Date     time.Time `json:"Ship_Date" db:"ship_date"`
	Ship_Mode     *string   `json:"Ship_Mode" db:"ship_mode"`
	Customer_ID   *string   `json:"Customer_ID" db:"customer_id"`
	Customer_Name *string   `json:"Customer_Name" db:"customer_name"`
	Segment       *string   `json:"Segment" db:"segment"`
	Country       *string   `json:"Country" db:"country"`
	City          *string   `json:"City" db:"city"`
	State         *string   `json:"State" db:"state"`
	Postal_Code   *string   `json:"Postal_Code" db:"postal_code"`
	Region        *string   `json:"Region" db:"region"`
	Product_ID    *string   `json:"Product_ID" db:"product_id"`
	Category      *string   `json:"Category" db:"category"`
	Sub_Category  *string   `json:"Sub_Category" db:"sub_category"`
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
	ProductName string `db:"product_name"`
	CountProduct int `db:"count_product"`
	TotalSales *float64 `db:"total_sales"`
}

type TotalProduct struct {
	ProductName string `db:"product_name"`
	CountProduct int `db:"count_product"`
}



// ดึงข้อมูลทั้งหมดจากตาราง sales
func getSalesAll(c *gin.Context) {
	var sales []Sale

	err := db.Select(&sales, "SELECT * FROM sales")
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
	route.Use(cors.Default())
	
	route.GET("/", getSalesAll)
	route.GET("/filterYear", getFilterYearSales)
	route.GET("/ship-mode", getShipMode)
	route.GET("/productsale", getProductAndSaleSum)
	route.GET("/totalproduct", getTotalProduct_Sale)
	route.GET("/topProduct", getTopProduct)



	log.Println("Starting backend server...")
	if err := route.Run(":8080"); err != nil {
		log.Fatal("Failed to run server: %v", err)
	}
}
