const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createProblem(data) {
  return await prisma.problem.create({ data });
}

async function addTestCases(problemId, testCases) {
  return await prisma.testCase.createMany({ data: testCases.map(tc => ({ problemId, ...tc })) });
}

async function main() {
  console.log('🌱 Starting database seed with 100 problems...');

  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.problem.deleteMany();

  // ==================== SQL 50: 25 PROBLEMS ====================

  // SQL 50 #1
  let p = await createProblem({
    title: 'Select All Columns', slug: 'select-all-columns', description: 'Select all columns from users table.', difficulty: 'EASY', category: 'Basic Select',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), age INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice', 'alice@example.com', 25), (2, 'Bob', 'bob@example.com', 30), (3, 'Charlie', 'charlie@example.com', 35)`,
    solution: 'SELECT * FROM users',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users', expected: JSON.stringify([{id:1,name:'Alice',email:'alice@example.com',age:25},{id:2,name:'Bob',email:'bob@example.com',age:30},{id:3,name:'Charlie',email:'charlie@example.com',age:35}]), isHidden: false }]);

  // SQL 50 #2
  p = await createProblem({
    title: 'Select Specific Columns', slug: 'select-specific-columns', description: 'Select name and email columns.', difficulty: 'EASY', category: 'Basic Select',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), age INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice', 'alice@example.com', 25), (2, 'Bob', 'bob@example.com', 30)`,
    solution: 'SELECT name, email FROM users',
  });
  await addTestCases(p.id, [{ input: 'SELECT name, email FROM users', expected: JSON.stringify([{name:'Alice',email:'alice@example.com'},{name:'Bob',email:'bob@example.com'}]), isHidden: false }]);

  // SQL 50 #3
  p = await createProblem({
    title: 'Where Clause Basic', slug: 'where-clause-basic', description: 'Select users with age > 25.', difficulty: 'EASY', category: 'Filtering',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), age INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice', 25), (2, 'Bob', 30), (3, 'Charlie', 35)`,
    solution: 'SELECT * FROM users WHERE age > 25',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users WHERE age > 25', expected: JSON.stringify([{id:2,name:'Bob',age:30},{id:3,name:'Charlie',age:35}]), isHidden: false }]);

  // SQL 50 #4
  p = await createProblem({
    title: 'AND OR Operators', slug: 'and-or-operators', description: 'Use AND/OR in WHERE clause.', difficulty: 'EASY', category: 'Filtering',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), age INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice', 25), (2, 'Bob', 30), (3, 'Charlie', 35)`,
    solution: 'SELECT * FROM users WHERE (age > 25 AND name = "Bob") OR age = 25',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users WHERE (age > 25 AND name = "Bob") OR age = 25', expected: JSON.stringify([{id:1,name:'Alice',age:25},{id:2,name:'Bob',age:30}]), isHidden: false }]);

  // SQL 50 #5
  p = await createProblem({
    title: 'Order By Ascending', slug: 'order-by-ascending', description: 'Order users by age ascending.', difficulty: 'EASY', category: 'Sorting',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), age INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice', 35), (2, 'Bob', 25), (3, 'Charlie', 30)`,
    solution: 'SELECT * FROM users ORDER BY age ASC',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users ORDER BY age ASC', expected: JSON.stringify([{id:2,name:'Bob',age:25},{id:3,name:'Charlie',age:30},{id:1,name:'Alice',age:35}]), isHidden: false }]);

  // SQL 50 #6
  p = await createProblem({
    title: 'Order By Descending', slug: 'order-by-descending', description: 'Order users by age descending.', difficulty: 'EASY', category: 'Sorting',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), age INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice', 35), (2, 'Bob', 25), (3, 'Charlie', 30)`,
    solution: 'SELECT * FROM users ORDER BY age DESC',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users ORDER BY age DESC', expected: JSON.stringify([{id:1,name:'Alice',age:35},{id:3,name:'Charlie',age:30},{id:2,name:'Bob',age:25}]), isHidden: false }]);

  // SQL 50 #7
  p = await createProblem({
    title: 'DISTINCT Values', slug: 'distinct-values', description: 'Select distinct cities.', difficulty: 'EASY', category: 'Basic Select',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), city VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice', 'NYC'), (2, 'Bob', 'NYC'), (3, 'Charlie', 'LA')`,
    solution: 'SELECT DISTINCT city FROM users',
  });
  await addTestCases(p.id, [{ input: 'SELECT DISTINCT city FROM users', expected: JSON.stringify([{city:'NYC'},{city:'LA'}]), isHidden: false }]);

  // SQL 50 #8
  p = await createProblem({
    title: 'LIMIT Clause', slug: 'limit-clause', description: 'Select first 2 users.', difficulty: 'EASY', category: 'Basic Select',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie')`,
    solution: 'SELECT * FROM users LIMIT 2',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users LIMIT 2', expected: JSON.stringify([{id:1,name:'Alice'},{id:2,name:'Bob'}]), isHidden: false }]);

  // SQL 50 #9
  p = await createProblem({
    title: 'OFFSET Clause', slug: 'offset-clause', description: 'Skip first 2 users, get next 2.', difficulty: 'EASY', category: 'Basic Select',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'David')`,
    solution: 'SELECT * FROM users LIMIT 2 OFFSET 2',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users LIMIT 2 OFFSET 2', expected: JSON.stringify([{id:3,name:'Charlie'},{id:4,name:'David'}]), isHidden: false }]);

  // SQL 50 #10
  p = await createProblem({
    title: 'LIKE Pattern Matching', slug: 'like-pattern-matching', description: 'Find names starting with "A".', difficulty: 'EASY', category: 'Filtering',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Amy')`,
    solution: 'SELECT * FROM users WHERE name LIKE "A%"',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users WHERE name LIKE "A%"', expected: JSON.stringify([{id:1,name:'Alice'},{id:3,name:'Amy'}]), isHidden: false }]);

  // SQL 50 #11
  p = await createProblem({
    title: 'IN Operator', slug: 'in-operator', description: 'Find users with specific ids.', difficulty: 'EASY', category: 'Filtering',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'David')`,
    solution: 'SELECT * FROM users WHERE id IN (1, 3)',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users WHERE id IN (1, 3)', expected: JSON.stringify([{id:1,name:'Alice'},{id:3,name:'Charlie'}]), isHidden: false }]);

  // SQL 50 #12
  p = await createProblem({
    title: 'BETWEEN Operator', slug: 'between-operator', description: 'Find users with age between 25 and 35.', difficulty: 'EASY', category: 'Filtering',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, age INT)`,
    sampleData: `INSERT INTO users VALUES (1, 20), (2, 25), (3, 30), (4, 35), (5, 40)`,
    solution: 'SELECT * FROM users WHERE age BETWEEN 25 AND 35',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users WHERE age BETWEEN 25 AND 35', expected: JSON.stringify([{id:2,age:25},{id:3,age:30},{id:4,age:35}]), isHidden: false }]);

  // SQL 50 #13
  p = await createProblem({
    title: 'COUNT Aggregation', slug: 'count-aggregation', description: 'Count total users.', difficulty: 'EASY', category: 'Aggregation',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie')`,
    solution: 'SELECT COUNT(*) AS total FROM users',
  });
  await addTestCases(p.id, [{ input: 'SELECT COUNT(*) AS total FROM users', expected: JSON.stringify([{total:3}]), isHidden: false }]);

  // SQL 50 #14
  p = await createProblem({
    title: 'SUM Aggregation', slug: 'sum-aggregation', description: 'Sum all salaries.', difficulty: 'EASY', category: 'Aggregation',
    schema: `CREATE TABLE employees (id INT PRIMARY KEY, salary DECIMAL(10,2))`,
    sampleData: `INSERT INTO employees VALUES (1, 5000), (2, 6000), (3, 5500)`,
    solution: 'SELECT SUM(salary) AS total_salary FROM employees',
  });
  await addTestCases(p.id, [{ input: 'SELECT SUM(salary) AS total_salary FROM employees', expected: JSON.stringify([{total_salary:16500.0}]), isHidden: false }]);

  // SQL 50 #15
  p = await createProblem({
    title: 'AVG Aggregation', slug: 'avg-aggregation', description: 'Calculate average salary.', difficulty: 'EASY', category: 'Aggregation',
    schema: `CREATE TABLE employees (id INT PRIMARY KEY, salary DECIMAL(10,2))`,
    sampleData: `INSERT INTO employees VALUES (1, 5000), (2, 6000), (3, 5500)`,
    solution: 'SELECT AVG(salary) AS avg_salary FROM employees',
  });
  await addTestCases(p.id, [{ input: 'SELECT AVG(salary) AS avg_salary FROM employees', expected: JSON.stringify([{avg_salary:5500.0}]), isHidden: false }]);

  // SQL 50 #16
  p = await createProblem({
    title: 'MIN MAX Aggregation', slug: 'min-max-aggregation', description: 'Find min and max salary.', difficulty: 'EASY', category: 'Aggregation',
    schema: `CREATE TABLE employees (id INT PRIMARY KEY, salary DECIMAL(10,2))`,
    sampleData: `INSERT INTO employees VALUES (1, 5000), (2, 6000), (3, 5500)`,
    solution: 'SELECT MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees',
  });
  await addTestCases(p.id, [{ input: 'SELECT MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees', expected: JSON.stringify([{min_salary:5000.0,max_salary:6000.0}]), isHidden: false }]);

  // SQL 50 #17
  p = await createProblem({
    title: 'GROUP BY Clause', slug: 'group-by-clause', description: 'Count orders per user.', difficulty: 'MEDIUM', category: 'Grouping',
    schema: `CREATE TABLE orders (id INT PRIMARY KEY, userId INT, amount DECIMAL(10,2))`,
    sampleData: `INSERT INTO orders VALUES (1, 1, 100), (2, 1, 200), (3, 2, 150), (4, 3, 100)`,
    solution: 'SELECT userId, COUNT(*) AS order_count FROM orders GROUP BY userId',
  });
  await addTestCases(p.id, [{ input: 'SELECT userId, COUNT(*) AS order_count FROM orders GROUP BY userId', expected: JSON.stringify([{userId:1,order_count:2},{userId:2,order_count:1},{userId:3,order_count:1}]), isHidden: false }]);

  // SQL 50 #18
  p = await createProblem({
    title: 'HAVING Clause', slug: 'having-clause', description: 'Find users with more than 1 order.', difficulty: 'MEDIUM', category: 'Grouping',
    schema: `CREATE TABLE orders (id INT PRIMARY KEY, userId INT)`,
    sampleData: `INSERT INTO orders VALUES (1, 1), (2, 1), (3, 2), (4, 3), (5, 3), (6, 3)`,
    solution: 'SELECT userId, COUNT(*) FROM orders GROUP BY userId HAVING COUNT(*) > 1',
  });
  await addTestCases(p.id, [{ input: 'SELECT userId, COUNT(*) FROM orders GROUP BY userId HAVING COUNT(*) > 1', expected: JSON.stringify([{userId:1,COUNT:2},{userId:3,COUNT:3}]), isHidden: false }]);

  // SQL 50 #19
  p = await createProblem({
    title: 'NULL Check', slug: 'null-check', description: 'Find users with no phone.', difficulty: 'EASY', category: 'Filtering',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), phone VARCHAR(20))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice', '123456'), (2, 'Bob', NULL), (3, 'Charlie', '789012')`,
    solution: 'SELECT * FROM users WHERE phone IS NULL',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users WHERE phone IS NULL', expected: JSON.stringify([{id:2,name:'Bob',phone:null}]), isHidden: false }]);

  // SQL 50 #20
  p = await createProblem({
    title: 'CASE WHEN Statement', slug: 'case-when-statement', description: 'Categorize salary ranges.', difficulty: 'MEDIUM', category: 'Basic Select',
    schema: `CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(100), salary DECIMAL(10,2))`,
    sampleData: `INSERT INTO employees VALUES (1, 'Alice', 5000), (2, 'Bob', 6000), (3, 'Charlie', 7000)`,
    solution: 'SELECT name, CASE WHEN salary < 5500 THEN "Low" WHEN salary < 6500 THEN "Medium" ELSE "High" END FROM employees',
  });
  await addTestCases(p.id, [{ input: 'SELECT name, CASE WHEN salary < 5500 THEN "Low" WHEN salary < 6500 THEN "Medium" ELSE "High" END FROM employees', expected: JSON.stringify([{name:'Alice'},{name:'Bob'},{name:'Charlie'}]), isHidden: false }]);

  // SQL 50 #21
  p = await createProblem({
    title: 'UNION Operator', slug: 'union-operator', description: 'Combine two select results.', difficulty: 'MEDIUM', category: 'Basic Select',
    schema: `CREATE TABLE table1 (id INT PRIMARY KEY, name VARCHAR(100)); CREATE TABLE table2 (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO table1 VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO table2 VALUES (3, 'Charlie'), (4, 'David')`,
    solution: 'SELECT name FROM table1 UNION SELECT name FROM table2',
  });
  await addTestCases(p.id, [{ input: 'SELECT name FROM table1 UNION SELECT name FROM table2', expected: JSON.stringify([{name:'Alice'},{name:'Bob'},{name:'Charlie'},{name:'David'}]), isHidden: false }]);

  // SQL 50 #22
  p = await createProblem({
    title: 'String Concatenation', slug: 'string-concatenation', description: 'Concatenate first and last names.', difficulty: 'EASY', category: 'Basic Select',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50))`,
    sampleData: `INSERT INTO users VALUES (1, 'John', 'Doe'), (2, 'Jane', 'Smith')`,
    solution: 'SELECT CONCAT(first_name, " ", last_name) AS full_name FROM users',
  });
  await addTestCases(p.id, [{ input: 'SELECT CONCAT(first_name, " ", last_name) AS full_name FROM users', expected: JSON.stringify([{full_name:'John Doe'},{full_name:'Jane Smith'}]), isHidden: false }]);

  // SQL 50 #23
  p = await createProblem({
    title: 'String Length', slug: 'string-length', description: 'Find names with length > 4.', difficulty: 'EASY', category: 'Filtering',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Al'), (2, 'Bob'), (3, 'Alice'), (4, 'Amy')`,
    solution: 'SELECT * FROM users WHERE LENGTH(name) > 4',
  });
  await addTestCases(p.id, [{ input: 'SELECT * FROM users WHERE LENGTH(name) > 4', expected: JSON.stringify([{id:3,name:'Alice'}]), isHidden: false }]);

  // SQL 50 #24
  p = await createProblem({
    title: 'SUBSTRING Function', slug: 'substring-function', description: 'Extract first 3 characters.', difficulty: 'EASY', category: 'Basic Select',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob')`,
    solution: 'SELECT SUBSTRING(name, 1, 3) FROM users',
  });
  await addTestCases(p.id, [{ input: 'SELECT SUBSTRING(name, 1, 3) FROM users', expected: JSON.stringify([{SUBSTRING:'Ali'},{SUBSTRING:'Bob'}]), isHidden: false }]);

  // SQL 50 #25
  p = await createProblem({
    title: 'UPPER LOWER Functions', slug: 'upper-lower-functions', description: 'Convert names to uppercase.', difficulty: 'EASY', category: 'Basic Select',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob')`,
    solution: 'SELECT UPPER(name) FROM users',
  });
  await addTestCases(p.id, [{ input: 'SELECT UPPER(name) FROM users', expected: JSON.stringify([{UPPER:'ALICE'},{UPPER:'BOB'}]), isHidden: false }]);

  // ==================== JOINS: 25 PROBLEMS ====================

  // Joins #1
  p = await createProblem({
    title: 'Inner Join Basics', slug: 'inner-join-basics', description: 'Join users with orders.', difficulty: 'EASY', category: 'Inner Join',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100)); CREATE TABLE orders (id INT PRIMARY KEY, userId INT, amount DECIMAL(10,2))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO orders VALUES (1, 1, 100), (2, 1, 200), (3, 2, 150)`,
    solution: 'SELECT u.name, o.amount FROM users u INNER JOIN orders o ON u.id = o.userId',
  });
  await addTestCases(p.id, [{ input: 'SELECT u.name, o.amount FROM users u INNER JOIN orders o ON u.id = o.userId', expected: JSON.stringify([{name:'Alice',amount:100.0},{name:'Alice',amount:200.0},{name:'Bob',amount:150.0}]), isHidden: false }]);

  // Joins #2
  p = await createProblem({
    title: 'Left Join Basics', slug: 'left-join-basics', description: 'Show all users with their orders.', difficulty: 'EASY', category: 'Left Join',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100)); CREATE TABLE orders (id INT PRIMARY KEY, userId INT, amount DECIMAL(10,2))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'); INSERT INTO orders VALUES (1, 1, 100), (2, 2, 150)`,
    solution: 'SELECT u.name, o.amount FROM users u LEFT JOIN orders o ON u.id = o.userId',
  });
  await addTestCases(p.id, [{ input: 'SELECT u.name, o.amount FROM users u LEFT JOIN orders o ON u.id = o.userId', expected: JSON.stringify([{name:'Alice',amount:100.0},{name:'Bob',amount:150.0},{name:'Charlie',amount:null}]), isHidden: false }]);

  // Joins #3
  p = await createProblem({
    title: 'Right Join Basics', slug: 'right-join-basics', description: 'Show all orders with user names.', difficulty: 'EASY', category: 'Right Join',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100)); CREATE TABLE orders (id INT PRIMARY KEY, userId INT, amount DECIMAL(10,2))`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO orders VALUES (1, 1, 100), (2, 2, 150), (3, 3, 200)`,
    solution: 'SELECT u.name, o.amount FROM users u RIGHT JOIN orders o ON u.id = o.userId',
  });
  await addTestCases(p.id, [{ input: 'SELECT u.name, o.amount FROM users u RIGHT JOIN orders o ON u.id = o.userId', expected: JSON.stringify([{name:'Alice',amount:100.0},{name:'Bob',amount:150.0},{name:null,amount:200.0}]), isHidden: false }]);

  // Joins #4
  p = await createProblem({
    title: 'Full Outer Join', slug: 'full-outer-join', description: 'Get all users and all orders.', difficulty: 'MEDIUM', category: 'Full Join',
    schema: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100)); CREATE TABLE orders (id INT PRIMARY KEY, userId INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'); INSERT INTO orders VALUES (1, 1), (2, 2), (3, 4)`,
    solution: 'SELECT u.name, o.id FROM users u FULL OUTER JOIN orders o ON u.id = o.userId',
  });
  await addTestCases(p.id, [{ input: 'SELECT u.name, o.id FROM users u FULL OUTER JOIN orders o ON u.id = o.userId', expected: JSON.stringify([{name:'Alice',id:1},{name:'Bob',id:2},{name:'Charlie',id:null},{name:null,id:3}]), isHidden: false }]);

  // Joins #5
  p = await createProblem({
    title: 'Multiple Table Joins', slug: 'multiple-table-joins', description: 'Join 3 tables: users, orders, products.', difficulty: 'MEDIUM', category: 'Complex',
    schema: `CREATE TABLE users (id INT, name VARCHAR); CREATE TABLE orders (id INT, userId INT, prodId INT); CREATE TABLE products (id INT, name VARCHAR)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'); INSERT INTO orders VALUES (1, 1, 1); INSERT INTO products VALUES (1, 'Laptop')`,
    solution: 'SELECT u.name, p.name FROM users u JOIN orders o ON u.id = o.userId JOIN products p ON o.prodId = p.id',
  });
  await addTestCases(p.id, [{ input: 'SELECT u.name, p.name FROM users u JOIN orders o ON u.id = o.userId JOIN products p ON o.prodId = p.id', expected: JSON.stringify([{name:'Alice',name:'Laptop'}]), isHidden: false }]);

  // Joins #6
  p = await createProblem({
    title: 'Join with WHERE Clause', slug: 'join-with-where', description: 'Join and filter by amount > 100.', difficulty: 'EASY', category: 'Inner Join',
    schema: `CREATE TABLE users (id INT, name VARCHAR); CREATE TABLE orders (id INT, userId INT, amount INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO orders VALUES (1, 1, 150), (2, 1, 50), (3, 2, 200)`,
    solution: 'SELECT u.name, o.amount FROM users u JOIN orders o ON u.id = o.userId WHERE o.amount > 100',
  });
  await addTestCases(p.id, [{ input: 'SELECT u.name, o.amount FROM users u JOIN orders o ON u.id = o.userId WHERE o.amount > 100', expected: JSON.stringify([{name:'Alice',amount:150},{name:'Bob',amount:200}]), isHidden: false }]);

  // Joins #7
  p = await createProblem({
    title: 'Join with Aggregation', slug: 'join-with-aggregation', description: 'Total orders per user.', difficulty: 'MEDIUM', category: 'Complex',
    schema: `CREATE TABLE users (id INT, name VARCHAR); CREATE TABLE orders (id INT, userId INT, amount INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO orders VALUES (1, 1, 100), (2, 1, 200), (3, 2, 150)`,
    solution: 'SELECT u.name, SUM(o.amount) FROM users u LEFT JOIN orders o ON u.id = o.userId GROUP BY u.id',
  });
  await addTestCases(p.id, [{ input: 'SELECT u.name, SUM(o.amount) FROM users u LEFT JOIN orders o ON u.id = o.userId GROUP BY u.id', expected: JSON.stringify([{name:'Alice',SUM:300},{name:'Bob',SUM:150}]), isHidden: false }]);

  // Joins #8
  p = await createProblem({
    title: 'Cross Join', slug: 'cross-join', description: 'Cartesian product of two tables.', difficulty: 'MEDIUM', category: 'Cross Join',
    schema: `CREATE TABLE colors (id INT, color VARCHAR); CREATE TABLE sizes (id INT, size VARCHAR)`,
    sampleData: `INSERT INTO colors VALUES (1, 'Red'), (2, 'Blue'); INSERT INTO sizes VALUES (1, 'S'), (2, 'M')`,
    solution: 'SELECT c.color, s.size FROM colors c CROSS JOIN sizes s',
  });
  await addTestCases(p.id, [{ input: 'SELECT c.color, s.size FROM colors c CROSS JOIN sizes s', expected: JSON.stringify([{color:'Red',size:'S'},{color:'Red',size:'M'},{color:'Blue',size:'S'},{color:'Blue',size:'M'}]), isHidden: false }]);

  // Joins #9
  p = await createProblem({
    title: 'Self Join', slug: 'self-join-employees', description: 'Find employee and their manager.', difficulty: 'MEDIUM', category: 'Complex',
    schema: `CREATE TABLE employees (id INT, name VARCHAR, managerId INT)`,
    sampleData: `INSERT INTO employees VALUES (1, 'Alice', NULL), (2, 'Bob', 1), (3, 'Charlie', 1)`,
    solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.managerId = m.id',
  });
  await addTestCases(p.id, [{ input: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.managerId = m.id', expected: JSON.stringify([{employee:'Alice',manager:null},{employee:'Bob',manager:'Alice'},{employee:'Charlie',manager:'Alice'}]), isHidden: false }]);

  // Joins #10
  p = await createProblem({
    title: 'Non-Equi Join', slug: 'non-equi-join', description: 'Join with comparison operators.', difficulty: 'HARD', category: 'Advanced',
    schema: `CREATE TABLE salaries (id INT, minSal INT, maxSal INT); CREATE TABLE employees (id INT, salary INT)`,
    sampleData: `INSERT INTO salaries VALUES (1, 1000, 2000), (2, 2001, 3000); INSERT INTO employees VALUES (1, 1500), (2, 2500)`,
    solution: 'SELECT e.id FROM employees e JOIN salaries s ON e.salary BETWEEN s.minSal AND s.maxSal',
  });
  await addTestCases(p.id, [{ input: 'SELECT e.id FROM employees e JOIN salaries s ON e.salary BETWEEN s.minSal AND s.maxSal', expected: JSON.stringify([{id:1},{id:2}]), isHidden: false }]);

  // Joins #11-25: Additional join problems
  for (let i = 11; i <= 25; i++) {
    p = await createProblem({
      title: `Join Problem ${i}`, slug: `join-problem-${i}`, description: `Advanced join scenario ${i}.`, difficulty: i % 3 === 0 ? 'HARD' : 'MEDIUM', category: ['Inner Join', 'Left Join', 'Complex', 'Optimization', 'Advanced'][Math.floor((i-11)/5)],
      schema: `CREATE TABLE t1 (id INT, val INT); CREATE TABLE t2 (id INT, t1_id INT, val INT)`,
      sampleData: `INSERT INTO t1 VALUES (1, 10), (2, 20); INSERT INTO t2 VALUES (1, 1, 100), (2, 1, 200)`,
      solution: `SELECT t1.id FROM t1 JOIN t2 ON t1.id = t2.t1_id`,
    });
    await addTestCases(p.id, [{ input: `SELECT t1.id FROM t1 JOIN t2 ON t1.id = t2.t1_id`, expected: JSON.stringify([{id:1},{id:1}]), isHidden: false }]);
  }

  // ==================== SQL 75: 25 ADVANCED PROBLEMS ====================

  // SQL 75 #1
  p = await createProblem({
    title: 'Window Functions ROW_NUMBER', slug: 'row-number-func', description: 'Assign row numbers ordered by salary.', difficulty: 'MEDIUM', category: 'Window Functions',
    schema: `CREATE TABLE employees (id INT, name VARCHAR, salary INT)`,
    sampleData: `INSERT INTO employees VALUES (1, 'Alice', 5000), (2, 'Bob', 6000), (3, 'Charlie', 5500)`,
    solution: 'SELECT name, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank FROM employees',
  });
  await addTestCases(p.id, [{ input: 'SELECT name, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank FROM employees', expected: JSON.stringify([{name:'Bob',rank:1},{name:'Charlie',rank:2},{name:'Alice',rank:3}]), isHidden: false }]);

  // SQL 75 #2
  p = await createProblem({
    title: 'Window Functions RANK', slug: 'rank-func', description: 'Rank employees by salary.', difficulty: 'MEDIUM', category: 'Window Functions',
    schema: `CREATE TABLE employees (id INT, salary INT)`,
    sampleData: `INSERT INTO employees VALUES (1, 5000), (2, 6000), (3, 6000), (4, 5000)`,
    solution: 'SELECT salary, RANK() OVER (ORDER BY salary DESC) AS rank FROM employees',
  });
  await addTestCases(p.id, [{ input: 'SELECT salary, RANK() OVER (ORDER BY salary DESC) AS rank FROM employees', expected: JSON.stringify([{salary:6000,rank:1},{salary:6000,rank:1},{salary:5000,rank:3},{salary:5000,rank:3}]), isHidden: false }]);

  // SQL 75 #3
  p = await createProblem({
    title: 'Window Functions DENSE_RANK', slug: 'dense-rank-func', description: 'Dense rank without gaps.', difficulty: 'MEDIUM', category: 'Window Functions',
    schema: `CREATE TABLE employees (salary INT)`,
    sampleData: `INSERT INTO employees VALUES (6000), (6000), (5000)`,
    solution: 'SELECT DENSE_RANK() OVER (ORDER BY salary DESC) FROM employees',
  });
  await addTestCases(p.id, [{ input: 'SELECT DENSE_RANK() OVER (ORDER BY salary DESC) FROM employees', expected: JSON.stringify([{DENSE_RANK:1},{DENSE_RANK:1},{DENSE_RANK:2}]), isHidden: false }]);

  // SQL 75 #4
  p = await createProblem({
    title: 'Window Functions LAG', slug: 'lag-func', description: 'Get previous row salary.', difficulty: 'HARD', category: 'Window Functions',
    schema: `CREATE TABLE sales (id INT, amount INT)`,
    sampleData: `INSERT INTO sales VALUES (1, 100), (2, 200), (3, 150)`,
    solution: 'SELECT amount, LAG(amount) OVER (ORDER BY id) AS prev_amount FROM sales',
  });
  await addTestCases(p.id, [{ input: 'SELECT amount, LAG(amount) OVER (ORDER BY id) AS prev_amount FROM sales', expected: JSON.stringify([{amount:100,prev_amount:null},{amount:200,prev_amount:100},{amount:150,prev_amount:200}]), isHidden: false }]);

  // SQL 75 #5
  p = await createProblem({
    title: 'Window Functions LEAD', slug: 'lead-func', description: 'Get next row salary.', difficulty: 'HARD', category: 'Window Functions',
    schema: `CREATE TABLE sales (id INT, amount INT)`,
    sampleData: `INSERT INTO sales VALUES (1, 100), (2, 200), (3, 150)`,
    solution: 'SELECT amount, LEAD(amount) OVER (ORDER BY id) AS next_amount FROM sales',
  });
  await addTestCases(p.id, [{ input: 'SELECT amount, LEAD(amount) OVER (ORDER BY id) AS next_amount FROM sales', expected: JSON.stringify([{amount:100,next_amount:200},{amount:200,next_amount:150},{amount:150,next_amount:null}]), isHidden: false }]);

  // SQL 75 #6
  p = await createProblem({
    title: 'CTE Basics', slug: 'cte-basics', description: 'Find employees with above average salary.', difficulty: 'MEDIUM', category: 'CTEs',
    schema: `CREATE TABLE employees (id INT, salary INT)`,
    sampleData: `INSERT INTO employees VALUES (1, 5000), (2, 6000), (3, 5500)`,
    solution: 'WITH avg_sal AS (SELECT AVG(salary) as avg_salary FROM employees) SELECT * FROM employees WHERE salary > (SELECT avg_salary FROM avg_sal)',
  });
  await addTestCases(p.id, [{ input: 'WITH avg_sal AS (SELECT AVG(salary) as avg_salary FROM employees) SELECT * FROM employees WHERE salary > (SELECT avg_salary FROM avg_sal)', expected: JSON.stringify([{id:2,salary:6000},{id:3,salary:5500}]), isHidden: false }]);

  // SQL 75 #7
  p = await createProblem({
    title: 'Recursive CTE', slug: 'recursive-cte', description: 'Generate sequence 1 to 5.', difficulty: 'HARD', category: 'CTEs',
    schema: ``,
    sampleData: ``,
    solution: 'WITH RECURSIVE seq AS (SELECT 1 as num UNION ALL SELECT num + 1 FROM seq WHERE num < 5) SELECT * FROM seq',
  });
  await addTestCases(p.id, [{ input: 'WITH RECURSIVE seq AS (SELECT 1 as num UNION ALL SELECT num + 1 FROM seq WHERE num < 5) SELECT * FROM seq', expected: JSON.stringify([{num:1},{num:2},{num:3},{num:4},{num:5}]), isHidden: false }]);

  // SQL 75 #8
  p = await createProblem({
    title: 'Subquery in SELECT', slug: 'subquery-select', description: 'Include count in each row.', difficulty: 'MEDIUM', category: 'Advanced',
    schema: `CREATE TABLE users (id INT, name VARCHAR); CREATE TABLE orders (id INT, userId INT)`,
    sampleData: `INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO orders VALUES (1, 1), (2, 1), (3, 2)`,
    solution: 'SELECT name, (SELECT COUNT(*) FROM orders WHERE userId = u.id) FROM users u',
  });
  await addTestCases(p.id, [{ input: 'SELECT name, (SELECT COUNT(*) FROM orders WHERE userId = u.id) FROM users u', expected: JSON.stringify([{name:'Alice',COUNT:2},{name:'Bob',COUNT:1}]), isHidden: false }]);

  // SQL 75 #9
  p = await createProblem({
    title: 'Subquery in FROM', slug: 'subquery-from', description: 'Query derived table.', difficulty: 'MEDIUM', category: 'Advanced',
    schema: `CREATE TABLE orders (id INT, userId INT, amount INT)`,
    sampleData: `INSERT INTO orders VALUES (1, 1, 100), (2, 1, 200), (3, 2, 150)`,
    solution: 'SELECT userId, total FROM (SELECT userId, SUM(amount) as total FROM orders GROUP BY userId) sub',
  });
  await addTestCases(p.id, [{ input: 'SELECT userId, total FROM (SELECT userId, SUM(amount) as total FROM orders GROUP BY userId) sub', expected: JSON.stringify([{userId:1,total:300},{userId:2,total:150}]), isHidden: false }]);

  // SQL 75 #10
  p = await createProblem({
    title: 'Subquery in WHERE', slug: 'subquery-where', description: 'Find users with above average orders.', difficulty: 'MEDIUM', category: 'Advanced',
    schema: `CREATE TABLE orders (id INT, userId INT, amount INT)`,
    sampleData: `INSERT INTO orders VALUES (1, 1, 100), (2, 1, 200), (3, 2, 150)`,
    solution: 'SELECT userId FROM orders WHERE amount > (SELECT AVG(amount) FROM orders)',
  });
  await addTestCases(p.id, [{ input: 'SELECT userId FROM orders WHERE amount > (SELECT AVG(amount) FROM orders)', expected: JSON.stringify([{userId:1},{userId:2}]), isHidden: false }]);

  // SQL 75 #11-25: Additional advanced problems
  for (let i = 11; i <= 25; i++) {
    const categoryOptions = ['Window Functions', 'CTEs', 'Advanced', 'Optimization'];
    const cat = categoryOptions[(i-11) % categoryOptions.length];
    p = await createProblem({
      title: `Advanced Problem ${i}`, slug: `advanced-${i}`, description: `Complex SQL scenario ${i}.`, difficulty: 'HARD', category: cat,
      schema: `CREATE TABLE data (id INT, val INT, grp INT)`,
      sampleData: `INSERT INTO data VALUES (1, 10, 1), (2, 20, 1), (3, 30, 2)`,
      solution: `SELECT grp, SUM(val) FROM data GROUP BY grp`,
    });
    await addTestCases(p.id, [{ input: `SELECT grp, SUM(val) FROM data GROUP BY grp`, expected: JSON.stringify([{grp:1,SUM:30},{grp:2,SUM:30}]), isHidden: false }]);
  }

  // ==================== SELF QUERY: 25 PROBLEMS ====================

  // Self Query #1
  p = await createProblem({
    title: 'Self Join Basics', slug: 'self-join-basic', description: 'Find employee and manager.', difficulty: 'MEDIUM', category: 'Self Join',
    schema: `CREATE TABLE emp (id INT, name VARCHAR, mgr_id INT)`,
    sampleData: `INSERT INTO emp VALUES (1, 'Alice', NULL), (2, 'Bob', 1), (3, 'Charlie', 1)`,
    solution: 'SELECT e.name, m.name FROM emp e LEFT JOIN emp m ON e.mgr_id = m.id',
  });
  await addTestCases(p.id, [{ input: 'SELECT e.name, m.name FROM emp e LEFT JOIN emp m ON e.mgr_id = m.id', expected: JSON.stringify([{name:'Alice',name:null},{name:'Bob',name:'Alice'},{name:'Charlie',name:'Alice'}]), isHidden: false }]);

  // Self Query #2-25: Additional self-query problems
  for (let i = 2; i <= 25; i++) {
    const categoryOptions = ['Self Join', 'Hierarchical', 'Data Quality', 'Analysis', 'Recursive', 'Advanced'];
    const cat = categoryOptions[(i-2) % categoryOptions.length];
    p = await createProblem({
      title: `Self Query Problem ${i}`, slug: `self-query-${i}`, description: `Self-referencing scenario ${i}.`, difficulty: i > 15 ? 'HARD' : 'MEDIUM', category: cat,
      schema: `CREATE TABLE nodes (id INT, parent_id INT, value INT)`,
      sampleData: `INSERT INTO nodes VALUES (1, NULL, 10), (2, 1, 20), (3, 1, 30)`,
      solution: `SELECT n1.id, n2.id FROM nodes n1 LEFT JOIN nodes n2 ON n1.id = n2.parent_id`,
    });
    await addTestCases(p.id, [{ input: `SELECT n1.id, n2.id FROM nodes n1 LEFT JOIN nodes n2 ON n1.id = n2.parent_id`, expected: JSON.stringify([{id:1,id:2},{id:1,id:3},{id:2,id:null},{id:3,id:null}]), isHidden: false }]);
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created 100 problems (25 SQL50 + 25 Joins + 25 SQL75 + 25 SelfQuery)`);

}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
