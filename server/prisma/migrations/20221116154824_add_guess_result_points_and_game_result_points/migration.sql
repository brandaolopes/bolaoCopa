-- AlterTable
ALTER TABLE `game` ADD COLUMN `firstTeamResultPoints` INTEGER NULL,
    ADD COLUMN `secondTeamResultPoints` INTEGER NULL;

-- AlterTable
ALTER TABLE `guess` ADD COLUMN `guessResultPoints` INTEGER NULL;
