/*
  Warnings:

  - You are about to drop the column `subject_id` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_admin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `middle_name` on the `users` table. All the data in the column will be lost.
  - Made the column `unit_id` on table `chapters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chapter_id` on table `questions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `question_id` on table `sub_questions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject_id` on table `units` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAdmin` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "sub_questions" DROP CONSTRAINT "sub_questions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "units" DROP CONSTRAINT "units_subject_id_fkey";

-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "subject_id",
ALTER COLUMN "unit_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "subject_id",
DROP COLUMN "unit_id",
ALTER COLUMN "chapter_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "sub_questions" ALTER COLUMN "question_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "units" ALTER COLUMN "subject_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "first_name",
DROP COLUMN "is_admin",
DROP COLUMN "last_name",
DROP COLUMN "middle_name",
ADD COLUMN     "firstName" VARCHAR(30) NOT NULL,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL,
ADD COLUMN     "lastName" VARCHAR(30) NOT NULL,
ADD COLUMN     "middleName" VARCHAR(30);

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_questions" ADD CONSTRAINT "sub_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
