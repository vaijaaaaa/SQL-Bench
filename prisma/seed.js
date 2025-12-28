const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const problems = [
  // ==========================================
  // CATEGORY: Basic Select (SQL 50)
  // ==========================================
  {
    title: 'Recyclable and Low Fat Products',
    slug: 'recyclable-and-low-fat-products',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Facebook', 'Amazon'],
    schema: `CREATE TABLE Products (product_id int, low_fats char(1), recyclable char(1));`,
    sampleData: `INSERT INTO Products VALUES (0, 'Y', 'N'), (1, 'Y', 'Y'), (2, 'N', 'Y'), (3, 'Y', 'Y'), (4, 'N', 'N');`,
    solution: `SELECT product_id FROM Products WHERE low_fats = 'Y' AND recyclable = 'Y'`,
    description: `
Table: Products

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| product_id  | int     |
| low_fats    | enum    |
| recyclable  | enum    |
+-------------+---------+
product_id is the primary key for this table.
low_fats is an ENUM of type ('Y', 'N') where 'Y' means this product is low fat and 'N' means it is not.
recyclable is an ENUM of type ('Y', 'N') where 'Y' means this product is recyclable and 'N' means it is not.

Write a SQL query to find the ids of products that are both low fat and recyclable.

Return the result table in any order.

The query result format is in the following example.

Example 1:

Input: 
Products table:
+-------------+----------+------------+
| product_id  | low_fats | recyclable |
+-------------+----------+------------+
| 0           | Y        | N          |
| 1           | Y        | Y          |
| 2           | N        | Y          |
| 3           | Y        | Y          |
| 4           | N        | N          |
+-------------+----------+------------+
Output: 
+-------------+
| product_id  |
+-------------+
| 1           |
| 3           |
+-------------+
Explanation: Only products 1 and 3 are both low fat and recyclable.
    `,
    testCases: [
      {
        input: `SELECT product_id FROM Products WHERE low_fats = 'Y' AND recyclable = 'Y'`,
        expected: JSON.stringify([{ product_id: 1 }, { product_id: 3 }])
      }
    ]
  },
  {
    title: 'Find Customer Referee',
    slug: 'find-customer-referee',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Amazon', 'Google'],
    schema: `CREATE TABLE Customer (id int, name varchar(25), referee_id int);`,
    sampleData: `INSERT INTO Customer VALUES (1, 'Will', NULL), (2, 'Jane', NULL), (3, 'Alex', 2), (4, 'Bill', NULL), (5, 'Zack', 1), (6, 'Mark', 2);`,
    solution: `SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL`,
    description: `
Table: Customer

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
| referee_id  | int     |
+-------------+---------+
id is the primary key column for this table.
Each row of this table indicates the id of a customer, their name, and the id of the customer who referred them.

Write an SQL query to report the names of the customer that are not referred by the customer with id = 2.

Return the result table in any order.

The query result format is in the following example.

Example 1:

Input: 
Customer table:
+----+------+------------+
| id | name | referee_id |
+----+------+------------+
| 1  | Will | null       |
| 2  | Jane | null       |
| 3  | Alex | 2          |
| 4  | Bill | null       |
| 5  | Zack | 1          |
| 6  | Mark | 2          |
+----+------+------------+
Output: 
+------+
| name |
+------+
| Will |
| Jane |
| Bill |
| Zack |
+------+
    `,
    testCases: [
      {
        input: `SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL`,
        expected: JSON.stringify([{ name: 'Will' }, { name: 'Jane' }, { name: 'Bill' }, { name: 'Zack' }])
      }
    ]
  },
  {
    title: 'Big Countries',
    slug: 'big-countries',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Bloomberg', 'Apple'],
    schema: `CREATE TABLE World (name varchar(255), continent varchar(255), area int, population int, gdp bigint);`,
    sampleData: `INSERT INTO World VALUES ('Afghanistan', 'Asia', 652230, 25500100, 20343000000), ('Albania', 'Europe', 28748, 2831741, 12960000000), ('Algeria', 'Africa', 2381741, 37100000, 188681000000), ('Andorra', 'Europe', 468, 78115, 3712000000), ('Angola', 'Africa', 1246700, 20609294, 100990000000);`,
    solution: `SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000`,
    description: `
Table: World

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| name        | varchar |
| continent   | varchar |
| area        | int     |
| population  | int     |
| gdp         | bigint  |
+-------------+---------+
name is the primary key column for this table.
Each row of this table gives information about the name of a country, the continent to which it belongs, its area, the population, and its GDP value.

A country is big if:
- it has an area of at least three million (i.e., 3000000 km2), or
- it has a population of at least twenty-five million (i.e., 25000000).

Write an SQL query to report the name, population, and area of the big countries.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000`,
        expected: JSON.stringify([{ name: 'Afghanistan', population: 25500100, area: 652230 }, { name: 'Algeria', population: 37100000, area: 2381741 }])
      }
    ]
  },
  {
    title: 'Article Views I',
    slug: 'article-views-i',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['LinkedIn', 'Microsoft'],
    schema: `CREATE TABLE Views (article_id int, author_id int, viewer_id int, view_date date);`,
    sampleData: `INSERT INTO Views VALUES (1, 3, 5, '2019-08-01'), (1, 3, 6, '2019-08-02'), (2, 7, 7, '2019-08-01'), (2, 7, 6, '2019-08-02'), (4, 7, 1, '2019-07-22'), (3, 4, 4, '2019-07-21'), (3, 4, 4, '2019-07-21');`,
    solution: `SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC`,
    description: `
Table: Views

+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| article_id    | int     |
| author_id     | int     |
| viewer_id     | int     |
| view_date     | date    |
+---------------+---------+
There is no primary key for this table, it may have duplicate rows.
Each row of this table indicates that some viewer viewed an article (written by some author) on some date. 
Note that equal author_id and viewer_id indicate the same person.

Write an SQL query to find all the authors that viewed at least one of their own articles.

Return the result table sorted by id in ascending order.
    `,
    testCases: [
      {
        input: `SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC`,
        expected: JSON.stringify([{ id: 4 }, { id: 7 }])
      }
    ]
  },
  {
    title: 'Invalid Tweets',
    slug: 'invalid-tweets',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Twitter', 'Uber'],
    schema: `CREATE TABLE Tweets (tweet_id int, content varchar(50));`,
    sampleData: `INSERT INTO Tweets VALUES (1, 'Vote for Biden'), (2, 'Let us make America great again!');`,
    solution: `SELECT tweet_id FROM Tweets WHERE LENGTH(content) > 15`,
    description: `
Table: Tweets

+----------------+---------+
| Column Name    | Type    |
+----------------+---------+
| tweet_id       | int     |
| content        | varchar |
+----------------+---------+
tweet_id is the primary key for this table.
This table contains all the tweets in a social media app.

Write an SQL query to find the IDs of the invalid tweets. The tweet is invalid if the number of characters used in the content of the tweet is strictly greater than 15.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT tweet_id FROM Tweets WHERE LENGTH(content) > 15`,
        expected: JSON.stringify([{ tweet_id: 2 }])
      }
    ]
  },
  {
    title: 'Calculate Special Bonus',
    slug: 'calculate-special-bonus',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Apple', 'Adobe'],
    schema: `CREATE TABLE Employees (employee_id int, name varchar(30), salary int);`,
    sampleData: `INSERT INTO Employees VALUES (2, 'Meir', 3000), (3, 'Michael', 3800), (7, 'Addilyn', 7400), (8, 'Juan', 6100), (9, 'Kannon', 7700);`,
    solution: `SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE 'M%' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id`,
    description: `
Table: Employees

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| employee_id | int     |
| name        | varchar |
| salary      | int     |
+-------------+---------+
employee_id is the primary key for this table.
Each row of this table indicates the employee ID, employee name, and salary.

Write an SQL query to calculate the bonus of each employee. The bonus of an employee is 100% of their salary if the ID of the employee is an odd number and the employee name does not start with the character 'M'. The bonus of an employee is 0 otherwise.

Return the result table ordered by employee_id.
    `,
    testCases: [
      {
        input: `SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE 'M%' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id`,
        expected: JSON.stringify([{ employee_id: 2, bonus: 0 }, { employee_id: 3, bonus: 0 }, { employee_id: 7, bonus: 7400 }, { employee_id: 8, bonus: 0 }, { employee_id: 9, bonus: 7700 }])
      }
    ]
  },
  {
    title: 'Swap Salary',
    slug: 'swap-salary',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Uber', 'Apple'],
    schema: `CREATE TABLE Salary (id int, name varchar(100), sex char(1), salary int);`,
    sampleData: `INSERT INTO Salary VALUES (1, 'A', 'm', 2500), (2, 'B', 'f', 1500), (3, 'C', 'm', 5500), (4, 'D', 'f', 500);`,
    solution: `UPDATE Salary SET sex = CASE WHEN sex = 'm' THEN 'f' ELSE 'm' END; SELECT * FROM Salary ORDER BY id;`,
    description: `
Table: Salary

+-------------+----------+
| Column Name | Type     |
+-------------+----------+
| id          | int      |
| name        | varchar  |
| sex         | ENUM     |
| salary      | int      |
+-------------+----------+
id is the primary key for this table.
The sex column is ENUM value of type ('m', 'f').
The table contains information about an employee.

Write an SQL query to swap all 'f' and 'm' values (i.e., change all 'f' values to 'm' and vice versa) with a single update statement and no intermediate temporary tables.

Note that you must write a single update statement, do not write any select statement for this problem.
    `,
    testCases: [
      {
        input: `UPDATE Salary SET sex = CASE WHEN sex = 'm' THEN 'f' ELSE 'm' END; SELECT * FROM Salary ORDER BY id;`,
        expected: JSON.stringify([{ id: 1, name: 'A', sex: 'f', salary: 2500 }, { id: 2, name: 'B', sex: 'm', salary: 1500 }, { id: 3, name: 'C', sex: 'f', salary: 5500 }, { id: 4, name: 'D', sex: 'm', salary: 500 }])
      }
    ]
  },
  {
    title: 'Delete Duplicate Emails',
    slug: 'delete-duplicate-emails',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Amazon', 'Uber'],
    schema: `CREATE TABLE Person (id int, email varchar(255));`,
    sampleData: `INSERT INTO Person VALUES (1, 'john@example.com'), (2, 'bob@example.com'), (3, 'john@example.com');`,
    solution: `DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id; SELECT * FROM Person ORDER BY id;`,
    description: `
Table: Person

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| email       | varchar |
+-------------+---------+
id is the primary key column for this table.
Each row of this table contains an email. The emails will not contain uppercase letters.

Write an SQL query to delete all the duplicate emails, keeping only one unique email with the smallest id.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id; SELECT * FROM Person ORDER BY id;`,
        expected: JSON.stringify([{ id: 1, email: 'john@example.com' }, { id: 2, email: 'bob@example.com' }])
      }
    ]
  },
  {
    title: 'Fix Names in a Table',
    slug: 'fix-names-in-a-table',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Google', 'Alibaba'],
    schema: `CREATE TABLE Users (user_id int, name varchar(40));`,
    sampleData: `INSERT INTO Users VALUES (1, 'aLice'), (2, 'bOB');`,
    solution: `SELECT user_id, CONCAT(UPPER(SUBSTRING(name, 1, 1)), LOWER(SUBSTRING(name, 2))) AS name FROM Users ORDER BY user_id`,
    description: `
Table: Users

+----------------+---------+
| Column Name    | Type    |
+----------------+---------+
| user_id        | int     |
| name           | varchar |
+----------------+---------+
user_id is the primary key for this table.
This table contains the ID and the name of the user. The name consists of only lowercase and uppercase characters.

Write an SQL query to fix the names so that only the first character is uppercase and the rest are lowercase.

Return the result table ordered by user_id.
    `,
    testCases: [
      {
        input: `SELECT user_id, CONCAT(UPPER(SUBSTRING(name, 1, 1)), LOWER(SUBSTRING(name, 2))) AS name FROM Users ORDER BY user_id`,
        expected: JSON.stringify([{ user_id: 1, name: 'Alice' }, { user_id: 2, name: 'Bob' }])
      }
    ]
  },
  {
    title: 'Group Sold Products By The Date',
    slug: 'group-sold-products-by-the-date',
    difficulty: 'EASY',
    category: 'Basic Select',
    companies: ['Adobe', 'Microsoft'],
    schema: `CREATE TABLE Activities (sell_date date, product varchar(20));`,
    sampleData: `INSERT INTO Activities VALUES ('2020-05-30', 'Headphone'), ('2020-06-01', 'Pencil'), ('2020-06-02', 'Mask'), ('2020-05-30', 'Basketball'), ('2020-06-01', 'Bible'), ('2020-06-02', 'Mask'), ('2020-05-30', 'T-Shirt');`,
    solution: `SELECT sell_date, COUNT(DISTINCT product) AS num_sold, STRING_AGG(DISTINCT product, ',') AS products FROM Activities GROUP BY sell_date ORDER BY sell_date`,
    description: `
Table: Activities

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| sell_date   | date    |
| product     | varchar |
+-------------+---------+
There is no primary key for this table, it may contain duplicates.
Each row of this table contains the product name and the date it was sold in a market.

Write an SQL query to find for each date the number of different products sold and their names.

The sold products names for each date should be sorted lexicographically.

Return the result table ordered by sell_date.
    `,
    testCases: [
      {
        input: `SELECT sell_date, COUNT(DISTINCT product) AS num_sold, STRING_AGG(DISTINCT product, ',') AS products FROM Activities GROUP BY sell_date ORDER BY sell_date`,
        expected: JSON.stringify([{ sell_date: '2020-05-30', num_sold: 3, products: 'Basketball,Headphone,T-Shirt' }, { sell_date: '2020-06-01', num_sold: 2, products: 'Bible,Pencil' }, { sell_date: '2020-06-02', num_sold: 1, products: 'Mask' }])
      }
    ]
  },

  // ==========================================
  // CATEGORY: Inner Join (Joins)
  // ==========================================
  {
    title: 'Combine Two Tables',
    slug: 'combine-two-tables',
    difficulty: 'EASY',
    category: 'Inner Join',
    companies: ['Apple', 'Microsoft'],
    schema: `
      CREATE TABLE Person (personId int, lastName varchar(255), firstName varchar(255));
      CREATE TABLE Address (addressId int, personId int, city varchar(255), state varchar(255));
    `,
    sampleData: `
      INSERT INTO Person VALUES (1, 'Wang', 'Allen'), (2, 'Alice', 'Bob');
      INSERT INTO Address VALUES (1, 2, 'New York City', 'New York'), (2, 3, 'Leetcode', 'California');
    `,
    solution: `SELECT firstName, lastName, city, state FROM Person LEFT JOIN Address ON Person.personId = Address.personId`,
    description: `
Table: Person

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| personId    | int     |
| lastName    | varchar |
| firstName   | varchar |
+-------------+---------+
personId is the primary key (column with unique values) for this table.
This table contains information about the ID of some persons and their first and last names.
 

Table: Address

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| addressId   | int     |
| personId    | int     |
| city        | varchar |
| state       | varchar |
+-------------+---------+
addressId is the primary key (column with unique values) for this table.
Each row of this table contains information about the city and state of one person with ID = PersonId.
 

Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT firstName, lastName, city, state FROM Person LEFT JOIN Address ON Person.personId = Address.personId`,
        expected: JSON.stringify([
          { firstName: 'Allen', lastName: 'Wang', city: null, state: null },
          { firstName: 'Bob', lastName: 'Alice', city: 'New York City', state: 'New York' }
        ])
      }
    ]
  },
  {
    title: 'Employee Bonus',
    slug: 'employee-bonus',
    difficulty: 'EASY',
    category: 'Inner Join',
    companies: ['Google', 'Amazon'],
    schema: `
      CREATE TABLE Employee (empId int, name varchar(255), supervisor int, salary int);
      CREATE TABLE Bonus (empId int, bonus int);
    `,
    sampleData: `
      INSERT INTO Employee VALUES (3, 'Brad', null, 4000), (1, 'John', 3, 1000), (2, 'Dan', 3, 2000), (4, 'Thomas', 3, 4000);
      INSERT INTO Bonus VALUES (2, 500), (4, 2000);
    `,
    solution: `SELECT name, bonus FROM Employee LEFT JOIN Bonus ON Employee.empId = Bonus.empId WHERE bonus < 1000 OR bonus IS NULL`,
    description: `
Table: Employee

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| empId       | int     |
| name        | varchar |
| supervisor  | int     |
| salary      | int     |
+-------------+---------+
empId is the primary key column for this table.
Each row of this table indicates the name and the ID of an employee in addition to their salary and the id of their manager.

Table: Bonus

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| empId       | int     |
| bonus       | int     |
+-------------+---------+
empId is the primary key column for this table.
empId is a foreign key to empId from the Employee table.
Each row of this table contains the id of an employee and their respective bonus.

Write an SQL query to report the name and bonus amount of each employee with a bonus less than 1000.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT name, bonus FROM Employee LEFT JOIN Bonus ON Employee.empId = Bonus.empId WHERE bonus < 1000 OR bonus IS NULL`,
        expected: JSON.stringify([{ name: 'Brad', bonus: null }, { name: 'John', bonus: null }, { name: 'Dan', bonus: 500 }])
      }
    ]
  },
  {
    title: 'Students and Examinations',
    slug: 'students-and-examinations',
    difficulty: 'EASY',
    category: 'Inner Join',
    companies: ['Amazon', 'Uber'],
    schema: `
      CREATE TABLE Students (student_id int, student_name varchar(20));
      CREATE TABLE Subjects (subject_name varchar(20));
      CREATE TABLE Examinations (student_id int, subject_name varchar(20));
    `,
    sampleData: `
      INSERT INTO Students VALUES (1, 'Alice'), (2, 'Bob'), (13, 'John'), (6, 'Alex');
      INSERT INTO Subjects VALUES ('Math'), ('Physics'), ('Programming');
      INSERT INTO Examinations VALUES (1, 'Math'), (1, 'Physics'), (1, 'Programming'), (2, 'Programming'), (1, 'Physics'), (1, 'Math'), (13, 'Math'), (13, 'Programming'), (13, 'Physics'), (2, 'Math'), (1, 'Math');
    `,
    solution: `SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name`,
    description: `
Table: Students

+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| student_id    | int     |
| student_name  | varchar |
+---------------+---------+
student_id is the primary key for this table.
Each row of this table contains the ID and the name of one student in the school.

Table: Subjects

+--------------+---------+
| Column Name  | Type    |
+--------------+---------+
| subject_name | varchar |
+--------------+---------+
subject_name is the primary key for this table.
Each row of this table contains the name of one subject in the school.

Table: Examinations

+--------------+---------+
| Column Name  | Type    |
+--------------+---------+
| student_id   | int     |
| subject_name | varchar |
+--------------+---------+
There is no primary key for this table. It may contain duplicates.
Each row of this table indicates that a student with student_id attended the exam of subject_name.

Write an SQL query to find the number of times each student attended each exam.

Return the result table ordered by student_id and subject_name.
    `,
    testCases: [
      {
        input: `SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name`,
        expected: JSON.stringify([
          { student_id: 1, student_name: 'Alice', subject_name: 'Math', attended_exams: 3 },
          { student_id: 1, student_name: 'Alice', subject_name: 'Physics', attended_exams: 2 },
          { student_id: 1, student_name: 'Alice', subject_name: 'Programming', attended_exams: 1 },
          { student_id: 2, student_name: 'Bob', subject_name: 'Math', attended_exams: 1 },
          { student_id: 2, student_name: 'Bob', subject_name: 'Physics', attended_exams: 0 },
          { student_id: 2, student_name: 'Bob', subject_name: 'Programming', attended_exams: 1 },
          { student_id: 6, student_name: 'Alex', subject_name: 'Math', attended_exams: 0 },
          { student_id: 6, student_name: 'Alex', subject_name: 'Physics', attended_exams: 0 },
          { student_id: 6, student_name: 'Alex', subject_name: 'Programming', attended_exams: 0 },
          { student_id: 13, student_name: 'John', subject_name: 'Math', attended_exams: 1 },
          { student_id: 13, student_name: 'John', subject_name: 'Physics', attended_exams: 1 },
          { student_id: 13, student_name: 'John', subject_name: 'Programming', attended_exams: 1 }
        ])
      }
    ]
  },
  {
    title: 'Managers with at Least 5 Direct Reports',
    slug: 'managers-with-at-least-5-direct-reports',
    difficulty: 'MEDIUM',
    category: 'Inner Join',
    companies: ['Bloomberg', 'Google'],
    schema: `CREATE TABLE Employee (id int, name varchar(255), department varchar(255), managerId int);`,
    sampleData: `INSERT INTO Employee VALUES (101, 'John', 'A', NULL), (102, 'Dan', 'A', 101), (103, 'James', 'A', 101), (104, 'Amy', 'A', 101), (105, 'Anne', 'A', 101), (106, 'Ron', 'B', 101);`,
    solution: `SELECT Name FROM Employee WHERE Id IN (SELECT ManagerId FROM Employee GROUP BY ManagerId HAVING COUNT(*) >= 5)`,
    description: `
Table: Employee

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
| department  | varchar |
| managerId   | int     |
+-------------+---------+
id is the primary key column for this table.
Each row of this table indicates the name of an employee, their department, and the id of their manager.
If managerId is null, then the employee does not have a manager.
No employee will be the manager of themself.

Write an SQL query to report the managers with at least five direct reports.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT Name FROM Employee WHERE Id IN (SELECT ManagerId FROM Employee GROUP BY ManagerId HAVING COUNT(*) >= 5)`,
        expected: JSON.stringify([{ name: 'John' }])
      }
    ]
  },
  {
    title: 'Confirmation Rate',
    slug: 'confirmation-rate',
    difficulty: 'MEDIUM',
    category: 'Inner Join',
    companies: ['Amazon', 'Facebook'],
    schema: `
      CREATE TABLE Signups (user_id int, time_stamp datetime);
      CREATE TABLE Confirmations (user_id int, time_stamp datetime, action varchar(10));
    `,
    sampleData: `
      INSERT INTO Signups VALUES (3, '2020-03-21 10:16:13'), (7, '2020-01-04 13:57:59'), (2, '2020-07-29 23:09:44'), (6, '2020-12-09 10:39:37');
      INSERT INTO Confirmations VALUES (3, '2021-01-06 03:30:46', 'timeout'), (3, '2021-07-14 14:00:00', 'timeout'), (7, '2021-06-12 11:57:29', 'confirmed'), (7, '2021-06-13 12:58:28', 'confirmed'), (7, '2021-06-14 13:59:27', 'confirmed'), (2, '2021-01-22 00:00:00', 'confirmed'), (2, '2021-02-28 23:59:59', 'timeout');
    `,
    solution: `SELECT s.user_id, ROUND(AVG(CASE WHEN c.action = 'confirmed' THEN 1 ELSE 0 END), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id`,
    description: `
Table: Signups

+----------------+----------+
| Column Name    | Type     |
+----------------+----------+
| user_id        | int      |
| time_stamp     | datetime |
+----------------+----------+
user_id is the primary key for this table.
Each row contains information about the signup time for the user with ID user_id.

Table: Confirmations

+----------------+----------+
| Column Name    | Type     |
+----------------+----------+
| user_id        | int      |
| time_stamp     | datetime |
| action         | ENUM     |
+----------------+----------+
(user_id, time_stamp) is the primary key for this table.
user_id is a foreign key to the Signups table.
action is an ENUM of the type ('confirmed', 'timeout')
Each row of this table indicates that the user with ID user_id requested a confirmation message at time_stamp and that confirmation message was either confirmed ('confirmed') or expired without confirming ('timeout').

The confirmation rate of a user is the number of 'confirmed' messages divided by the total number of requested confirmation messages. The confirmation rate of a user that did not request any confirmation messages is 0. Round the confirmation rate to two decimal places.

Write an SQL query to find the confirmation rate of each user.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT s.user_id, ROUND(AVG(CASE WHEN c.action = 'confirmed' THEN 1 ELSE 0 END), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id`,
        expected: JSON.stringify([{ user_id: 6, confirmation_rate: 0.00 }, { user_id: 3, confirmation_rate: 0.00 }, { user_id: 7, confirmation_rate: 1.00 }, { user_id: 2, confirmation_rate: 0.50 }])
      }
    ]
  },

  // ==========================================
  // CATEGORY: Window Functions (SQL 75)
  // ==========================================
  {
    title: 'Second Highest Salary',
    slug: 'second-highest-salary',
    difficulty: 'MEDIUM',
    category: 'Window Functions',
    companies: ['Amazon', 'Google'],
    schema: `CREATE TABLE Employee (id int, salary int);`,
    sampleData: `INSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);`,
    solution: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee)`,
    description: `
Table: Employee

+-------------+------+
| Column Name | Type |
+-------------+------+
| id          | int  |
| salary      | int  |
+-------------+------+
id is the primary key column for this table.
Each row of this table contains information about the salary of an employee.

Write an SQL query to report the second highest salary from the Employee table. If there is no second highest salary, the query should report null.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee)`,
        expected: JSON.stringify([{ SecondHighestSalary: 200 }])
      }
    ]
  },
  {
    title: 'Nth Highest Salary',
    slug: 'nth-highest-salary',
    difficulty: 'MEDIUM',
    category: 'Window Functions',
    companies: ['Amazon', 'Google'],
    schema: `CREATE TABLE Employee (id int, salary int);`,
    sampleData: `INSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);`,
    solution: `CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT BEGIN SET N = N - 1; RETURN (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET N); END`,
    description: `
Table: Employee

+-------------+------+
| Column Name | Type |
+-------------+------+
| id          | int  |
| salary      | int  |
+-------------+------+
id is the primary key column for this table.
Each row of this table contains information about the salary of an employee.

Write an SQL query to report the nth highest salary from the Employee table. If there is no nth highest salary, the query should report null.

The following is the definition of the function:
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
    `,
    testCases: [] // Function creation is hard to test with simple query execution
  },
  {
    title: 'Rank Scores',
    slug: 'rank-scores',
    difficulty: 'MEDIUM',
    category: 'Window Functions',
    companies: ['Amazon', 'Apple'],
    schema: `CREATE TABLE Scores (id int, score decimal(3,2));`,
    sampleData: `INSERT INTO Scores VALUES (1, 3.50), (2, 3.65), (3, 4.00), (4, 3.85), (5, 4.00), (6, 3.65);`,
    solution: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS 'rank' FROM Scores`,
    description: `
Table: Scores

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| score       | decimal |
+-------------+---------+
id is the primary key for this table.
Each row of this table contains the score of a game. Score is a floating point value with two decimal places.

Write an SQL query to rank the scores. The ranking should be calculated according to the following rules:
- The scores should be ranked from the highest to the lowest.
- If there is a tie between two scores, both should have the same ranking.
- After a tie, the next ranking number should be the next consecutive integer value. In other words, there should be no holes between ranks.

Return the result table ordered by score in descending order.
    `,
    testCases: [
      {
        input: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS "rank" FROM Scores`,
        expected: JSON.stringify([{ score: 4.00, rank: 1 }, { score: 4.00, rank: 1 }, { score: 3.85, rank: 2 }, { score: 3.65, rank: 3 }, { score: 3.65, rank: 3 }, { score: 3.50, rank: 4 }])
      }
    ]
  },
  {
    title: 'Consecutive Numbers',
    slug: 'consecutive-numbers',
    difficulty: 'MEDIUM',
    category: 'Window Functions',
    companies: ['Amazon', 'Facebook'],
    schema: `CREATE TABLE Logs (id int, num int);`,
    sampleData: `INSERT INTO Logs VALUES (1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 2), (7, 2);`,
    solution: `SELECT DISTINCT l1.num AS ConsecutiveNums FROM Logs l1, Logs l2, Logs l3 WHERE l1.id = l2.id - 1 AND l2.id = l3.id - 1 AND l1.num = l2.num AND l2.num = l3.num`,
    description: `
Table: Logs

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| num         | varchar |
+-------------+---------+
id is the primary key for this table.
id is an autoincrement column.

Write an SQL query to find all numbers that appear at least three times consecutively.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT DISTINCT l1.num AS ConsecutiveNums FROM Logs l1, Logs l2, Logs l3 WHERE l1.id = l2.id - 1 AND l2.id = l3.id - 1 AND l1.num = l2.num AND l2.num = l3.num`,
        expected: JSON.stringify([{ ConsecutiveNums: 1 }])
      }
    ]
  },
  {
    title: 'Department Highest Salary',
    slug: 'department-highest-salary',
    difficulty: 'MEDIUM',
    category: 'Window Functions',
    companies: ['Amazon', 'Microsoft'],
    schema: `
      CREATE TABLE Employee (id int, name varchar(255), salary int, departmentId int);
      CREATE TABLE Department (id int, name varchar(255));
    `,
    sampleData: `
      INSERT INTO Employee VALUES (1, 'Joe', 70000, 1), (2, 'Jim', 90000, 1), (3, 'Henry', 80000, 2), (4, 'Sam', 60000, 2), (5, 'Max', 90000, 1);
      INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');
    `,
    solution: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId)`,
    description: `
Table: Employee

+--------------+---------+
| Column Name  | Type    |
+--------------+---------+
| id           | int     |
| name         | varchar |
| salary       | int     |
| departmentId | int     |
+--------------+---------+
id is the primary key column for this table.
departmentId is a foreign key of the ID from the Department table.
Each row of this table indicates the ID, name, and salary of an employee. It also contains the ID of their department.

Table: Department

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
+-------------+---------+
id is the primary key column for this table.
Each row of this table indicates the ID of a department and its name.

Write an SQL query to find employees who have the highest salary in each of the departments.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId)`,
        expected: JSON.stringify([{ Department: 'IT', Employee: 'Jim', Salary: 90000 }, { Department: 'IT', Employee: 'Max', Salary: 90000 }, { Department: 'Sales', Employee: 'Henry', Salary: 80000 }])
      }
    ]
  },

  // ==========================================
  // CATEGORY: Self Join (Self Query)
  // ==========================================
  {
    title: 'Employees Earning More Than Their Managers',
    slug: 'employees-earning-more-than-their-managers',
    difficulty: 'EASY',
    category: 'Self Join',
    companies: ['Amazon', 'Google'],
    schema: `CREATE TABLE Employee (id int, name varchar(255), salary int, managerId int);`,
    sampleData: `INSERT INTO Employee VALUES (1, 'Joe', 70000, 3), (2, 'Henry', 80000, 4), (3, 'Sam', 60000, NULL), (4, 'Max', 90000, NULL);`,
    solution: `SELECT e1.name AS Employee FROM Employee e1 JOIN Employee e2 ON e1.managerId = e2.id WHERE e1.salary > e2.salary`,
    description: `
Table: Employee

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
| salary      | int     |
| managerId   | int     |
+-------------+---------+
id is the primary key column for this table.
Each row of this table indicates the ID of an employee, their name, salary, and the ID of their manager.

Write an SQL query to find the employees who earn more than their managers.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT e1.name AS Employee FROM Employee e1 JOIN Employee e2 ON e1.managerId = e2.id WHERE e1.salary > e2.salary`,
        expected: JSON.stringify([{ Employee: 'Joe' }])
      }
    ]
  },
  {
    title: 'Duplicate Emails',
    slug: 'duplicate-emails',
    difficulty: 'EASY',
    category: 'Self Join',
    companies: ['Amazon', 'Uber'],
    schema: `CREATE TABLE Person (id int, email varchar(255));`,
    sampleData: `INSERT INTO Person VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');`,
    solution: `SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1`,
    description: `
Table: Person

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| email       | varchar |
+-------------+---------+
id is the primary key column for this table.
Each row of this table contains an email. The emails will not contain uppercase letters.

Write an SQL query to report all the duplicate emails.

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1`,
        expected: JSON.stringify([{ email: 'a@b.com' }])
      }
    ]
  },
  {
    title: 'Rising Temperature',
    slug: 'rising-temperature',
    difficulty: 'EASY',
    category: 'Self Join',
    companies: ['Adobe', 'Google'],
    schema: `CREATE TABLE Weather (id int, recordDate date, temperature int);`,
    sampleData: `INSERT INTO Weather VALUES (1, '2015-01-01', 10), (2, '2015-01-02', 25), (3, '2015-01-03', 20), (4, '2015-01-04', 30);`,
    solution: `SELECT w1.id FROM Weather w1 JOIN Weather w2 ON w1.recordDate = w2.recordDate + INTERVAL '1 day' WHERE w1.temperature > w2.temperature`,
    description: `
Table: Weather

+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| id            | int     |
| recordDate    | date    |
| temperature   | int     |
+---------------+---------+
id is the primary key for this table.
This table contains information about the temperature on a certain day.

Write an SQL query to find all dates' Id with higher temperatures compared to its previous dates (yesterday).

Return the result table in any order.
    `,
    testCases: [
      {
        input: `SELECT w1.id FROM Weather w1 JOIN Weather w2 ON w1.recordDate = w2.recordDate + INTERVAL '1 day' WHERE w1.temperature > w2.temperature`,
        expected: JSON.stringify([{ id: 2 }, { id: 4 }])
      }
    ]
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.problem.deleteMany();

  for (const problem of problems) {
    const { testCases, ...problemData } = problem;
    
    const createdProblem = await prisma.problem.create({
      data: problemData,
    });

    if (testCases && testCases.length > 0) {
      await prisma.testCase.createMany({
        data: testCases.map((tc) => ({
          problemId: createdProblem.id,
          ...tc,
        })),
      });
    }
    
    console.log(`Created problem: ${problem.title}`);
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
