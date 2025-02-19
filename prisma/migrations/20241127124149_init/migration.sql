-- CreateTable
CREATE TABLE "Food" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "price" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "OrderFood" (
    "orderID" INTEGER NOT NULL,
    "foodID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    PRIMARY KEY ("orderID", "foodID"),
    CONSTRAINT "OrderFood_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderFood_foodID_fkey" FOREIGN KEY ("foodID") REFERENCES "Food" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
