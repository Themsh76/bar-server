/*
  Warnings:

  - You are about to drop the `OrderDrink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderFood` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrderDrink";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrderFood";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DrinkOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "drinkId" INTEGER NOT NULL,
    CONSTRAINT "DrinkOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DrinkOrder_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "Drink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FoodOrder" (
    "orderId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    PRIMARY KEY ("orderId", "foodId"),
    CONSTRAINT "FoodOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FoodOrder_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
