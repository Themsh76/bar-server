-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderDrink" (
    "orderID" INTEGER NOT NULL,
    "drinkID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("orderID", "drinkID"),
    CONSTRAINT "OrderDrink_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderDrink_drinkID_fkey" FOREIGN KEY ("drinkID") REFERENCES "Drink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderDrink" ("drinkID", "orderID", "quantity") SELECT "drinkID", "orderID", "quantity" FROM "OrderDrink";
DROP TABLE "OrderDrink";
ALTER TABLE "new_OrderDrink" RENAME TO "OrderDrink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
