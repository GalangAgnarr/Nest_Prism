/*
  Warnings:

  - You are about to drop the column `returnDate` on the `loan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `loan` DROP COLUMN `returnDate`;

-- CreateTable
CREATE TABLE `returnedBook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loanId` INTEGER NOT NULL,
    `returnDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `returnedBook_loanId_key`(`loanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `returnedBook` ADD CONSTRAINT `returnedBook_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `loan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
