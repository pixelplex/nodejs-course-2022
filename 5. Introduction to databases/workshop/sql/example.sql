CREATE TABLE users (
"id" serial PRIMARY KEY,
"name" varchar(255),
"age" integer);

ALTER TABLE "users" ADD COLUMN "balance" float8;  

INSERT INTO "users" ("age", "balance", "name")
VALUES
(15, 123.1, 'Alex'),
(15, 122.1, 'Alex');

--ALTER TABLE "users" ADD CONSTRAINT name_unique  UNIQUE ("name");

UPDATE "users" SET "name" = 'Maria' WHERE "id" = 2;

ALTER TABLE "users" ADD CONSTRAINT name_unique  UNIQUE ("name");

INSERT INTO "users" ("age", "balance", "name")
VALUES
(28, 14165, 'John'),
(54, 653.42, 'Ann');

DELETE FROM "users" WHERE "id" = 3;

SELECT * FROM "users";
SELECT * FROM "users" ORDER BY “name” ASC;
SELECT "id" AS "userId", "name" AS "firstName"  from users WHERE "name" LIKE '%nn%';
SELECT "id" AS "userId", "name" AS "firstName"  from users WHERE "name" LIKE 'A%' LIMIT 1;

CREATE TABLE "grades" (
 "id" serial PRIMARY KEY,
 "userId" integer,
 "score" integer,
 FOREIGN KEY ("userId") REFERENCES "users" ("id")
);

INSERT INTO "grades" ("userId", "score")
VALUES
(1, 8),
(1, 9),
(1, 10),
(1, 9),
(2, 5),
(2, 8),
(2, 6),
(4, 4),
(4, 9),
(4, 10);

--INSERT INTO "grades" ("userId", "score")
--VALUES                
--(3, 4);

SELECT MAX(score) AS "maxScore", "userId" from "grades" GROUP BY "userId";

SELECT "name", MAX("score") AS "maxScore"
FROM "users"
INNER JOIN "grades"
ON "grades"."userId" = "users"."id"
GROUP BY "users"."id"
HAVING MAX("score") > 8;

INSERT INTO "users" ("age", "balance", "name")
VALUES
(22, 534, 'Nikita');

SELECT con.*
FROM pg_catalog.pg_constraint con
INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
WHERE  rel.relname = 'grades';

ALTER TABLE grades DROP CONSTRAINT "grades_userId_fkey";

INSERT INTO grades ("userId", "score")
VALUES
(6, 8),
(6, 9);

SELECT "name", MAX("score") AS "maxScore"
FROM "users"
INNER JOIN "grades"
--RIGHT JOIN "grades"
--LEFT JOIN "grades"
--FULL JOIN "grades"
ON "grades"."userId" = "users"."id"
GROUP BY "users"."id";

SELECT *
FROM "users"
CROSS JOIN "grades";

SELECT
AVG("score") AS "average",
SUM("score") AS "sum"
FROM "grades";

SELECT
"userId", string_agg("score"::varchar, ',') "marksArr",
AVG("score") AS "average",
SUM("score") AS "sum"
FROM "grades"
GROUP BY "userId";