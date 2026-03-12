/*
  Warnings:

  - You are about to drop the `returnedbook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `returnedbook` DROP FOREIGN KEY `ReturnedBook_loanId_fkey`;

-- AlterTable
ALTER TABLE `loan` ADD COLUMN `returnDate` DATETIME(3) NULL;

-- DropTable
DROP TABLE `returnedbook`;
