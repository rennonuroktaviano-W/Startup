-- AlterTable
ALTER TABLE `Inquiry` ADD COLUMN `submissionKey` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Inquiry_submissionKey_key` ON `Inquiry`(`submissionKey`);
