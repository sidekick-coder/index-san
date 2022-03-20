/*
  Warnings:

  - You are about to drop the column `targetnpx` on the `Archive` table. All the data in the column will be lost.
  - Added the required column `target` to the `Archive` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Archive" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Archive" ("createdAt", "id", "source") SELECT "createdAt", "id", "source" FROM "Archive";
DROP TABLE "Archive";
ALTER TABLE "new_Archive" RENAME TO "Archive";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
