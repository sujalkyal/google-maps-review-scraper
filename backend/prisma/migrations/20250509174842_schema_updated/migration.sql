/*
  Warnings:

  - You are about to drop the column `author` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `reviewDate` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `sentiment` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `sentimentScore` on the `Review` table. All the data in the column will be lost.
  - Added the required column `mapUrl` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentiment_label` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentiment_score` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "mapUrl" TEXT NOT NULL,
ADD COLUMN     "summary" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "author",
DROP COLUMN "reviewDate",
DROP COLUMN "sentiment",
DROP COLUMN "sentimentScore",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "sentiment_label" TEXT NOT NULL,
ADD COLUMN     "sentiment_score" DOUBLE PRECISION NOT NULL;
