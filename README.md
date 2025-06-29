# Inventory Manager

Web application that allows the management of products.  
It was developed in **React with TypeScript** on the frontend and **Spring Boot** on the backend.

---

## 📌 Functions

The application features the following functional requirements:

| ID    | Name                | Description                                                                                     |
|-------|---------------------|-------------------------------------------------------------------------------------------------|
| FR-1  | Get Catalogue       | The application must get the data from the catalogue and display it on the screen.             |
| FR-2  | Add Product         | The application must allow the user to add a product with the specific fields required.        |
| FR-3  | Edit Product        | The application must allow the user to modify fields from the product.                         |
| FR-4  | Delete Product      | The application must allow the user to delete a product from the catalogue.                    |
| FR-5  | Filter Products     | The application must allow the user to filter a product by name, category, and stock status.   |
| FR-6  | Sort Products       | The application must allow the user to sort the products by the fields shown on the screen.    |
| FR-7  | Manage Stock        | The application must allow the user to mark a product as out-of-stock, and re-stock when necessary. |
| FR-8  | Paginate            | The application must display only 10 products per page.                                        |
| FR-9  | Show Metrics        | The application must display inventory metrics per category: total stock, total value and average value. |

---

## 🚀 How to Run

### Frontend

You need the following programs previously installed in your computer:
- Node.js v22+
- npm

From the root folder you need to type the next command:
```bash
cd Frontend/dream-store
```
From there, you need to run the project with the next command:

```bash
npm run dev
```

If you want to run the tests, you use the next command:

```bash
npx jest  
```

### Backend

You need the following programs previously installed in your computer

- Java 21+
- Maven 3

From the root folder you need to type the next command:
```bash
cd Backend/store
```
From there you run the server with the next command:
```bash
mvn spring-boot:run
```
If you want to run the test you use the next command
```bash
mvn test
```
---
