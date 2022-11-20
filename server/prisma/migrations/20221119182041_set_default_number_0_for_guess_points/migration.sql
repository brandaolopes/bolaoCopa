/*
  Warnings:

  - Made the column `guessResultPoints` on table `guess` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `guess` MODIFY `guessResultPoints` INTEGER NOT NULL DEFAULT 0;
