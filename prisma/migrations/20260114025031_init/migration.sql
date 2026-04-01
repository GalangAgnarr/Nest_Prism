-- CreateTable
CREATE TABLE `student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nis` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_nis_key`(`nis`),
    UNIQUE INDEX `student_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
