const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.problem.deleteMany();

  // ==================== SQL 50 PROBLEMS ====================

  // 1. Select All Columns (EASY)
  const problem1 = await prisma.problem.create({
    data: {
      title: 'Select All Columns',
      slug: 'select-all-columns',
      description: 'Write a query to select all columns and all rows from the users table.',
      difficulty: 'EASY',
      category: 'Basic Select',
      schema: `CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        age INT
      )`,
      sampleData: `INSERT INTO users (id, name, email, age) VALUES
        (1, 'Alice', 'alice@example.com', 25),
        (2, 'Bob', 'bob@example.com', 30),
        (3, 'Charlie', 'charlie@example.com', 35)`,
      solution: 'SELECT * FROM users',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem1.id,
        input: 'SELECT * FROM users',
        expected: JSON.stringify([
          { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
          { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
          { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
        ]),
        isHidden: false,
      },
    ],
  });

  // 2. Select Specific Columns (EASY)
  const problem2 = await prisma.problem.create({
    data: {
      title: 'Select Specific Columns',
      slug: 'select-specific-columns',
      description: 'Select only the name and email columns from the users table.',
      difficulty: 'EASY',
      category: 'Basic Select',
      schema: `CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        age INT
      )`,
      sampleData: `INSERT INTO users (id, name, email, age) VALUES
        (1, 'Alice', 'alice@example.com', 25),
        (2, 'Bob', 'bob@example.com', 30)`,
      solution: 'SELECT name, email FROM users',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem2.id,
        input: 'SELECT name, email FROM users',
        expected: JSON.stringify([
          { name: 'Alice', email: 'alice@example.com' },
          { name: 'Bob', email: 'bob@example.com' },
        ]),
        isHidden: false,
      },
    ],
  });

  // 3. Where Clause Filtering (EASY)
  const problem3 = await prisma.problem.create({
    data: {
      title: 'Where Clause Filtering',
      slug: 'where-clause-filtering',
      description: 'Select all users with age greater than 25.',
      difficulty: 'EASY',
      category: 'Filtering',
      schema: `CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        age INT
      )`,
      sampleData: `INSERT INTO users (id, name, age) VALUES
        (1, 'Alice', 25),
        (2, 'Bob', 30),
        (3, 'Charlie', 35)`,
      solution: 'SELECT * FROM users WHERE age > 25',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem3.id,
        input: 'SELECT * FROM users WHERE age > 25',
        expected: JSON.stringify([
          { id: 2, name: 'Bob', age: 30 },
          { id: 3, name: 'Charlie', age: 35 },
        ]),
        isHidden: false,
      },
    ],
  });

  // 4. AND OR Operators (EASY)
  const problem4 = await prisma.problem.create({
    data: {
      title: 'AND OR Operators',
      slug: 'and-or-operators',
      description: 'Select users with age > 25 AND name = "Bob" OR age = 25.',
      difficulty: 'EASY',
      category: 'Filtering',
      schema: `CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        age INT
      )`,
      sampleData: `INSERT INTO users (id, name, age) VALUES
        (1, 'Alice', 25),
        (2, 'Bob', 30),
        (3, 'Charlie', 35)`,
      solution: 'SELECT * FROM users WHERE (age > 25 AND name = "Bob") OR age = 25',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem4.id,
        input: 'SELECT * FROM users WHERE (age > 25 AND name = "Bob") OR age = 25',
        expected: JSON.stringify([
          { id: 1, name: 'Alice', age: 25 },
          { id: 2, name: 'Bob', age: 30 },
        ]),
        isHidden: false,
      },
    ],
  });

  // 5. Order By Clause (EASY)
  const problem5 = await prisma.problem.create({
    data: {
      title: 'Order By Clause',
      slug: 'order-by-clause',
      description: 'Select all users and order them by age in descending order.',
      difficulty: 'EASY',
      category: 'Sorting',
      schema: `CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        age INT
      )`,
      sampleData: `INSERT INTO users (id, name, age) VALUES
        (1, 'Alice', 25),
        (2, 'Bob', 30),
        (3, 'Charlie', 35)`,
      solution: 'SELECT * FROM users ORDER BY age DESC',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem5.id,
        input: 'SELECT * FROM users ORDER BY age DESC',
        expected: JSON.stringify([
          { id: 3, name: 'Charlie', age: 35 },
          { id: 2, name: 'Bob', age: 30 },
          { id: 1, name: 'Alice', age: 25 },
        ]),
        isHidden: false,
      },
    ],
  });

  // ==================== JOINS PROBLEMS ====================

  // 6. Inner Join Basics (EASY - JOINS)
  const problem6 = await prisma.problem.create({
    data: {
      title: 'Inner Join Basics',
      slug: 'inner-join-basics',
      description: 'Join users with their orders. Return user name and order amount.',
      difficulty: 'EASY',
      category: 'Inner Join',
      schema: `CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100)
      );
      CREATE TABLE orders (
        id INT PRIMARY KEY,
        userId INT,
        amount DECIMAL(10, 2),
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,
      sampleData: `INSERT INTO users (id, name) VALUES
        (1, 'Alice'),
        (2, 'Bob'),
        (3, 'Charlie');
      INSERT INTO orders (id, userId, amount) VALUES
        (1, 1, 100.00),
        (2, 1, 200.00),
        (3, 2, 150.00)`,
      solution: 'SELECT u.name, o.amount FROM users u INNER JOIN orders o ON u.id = o.userId',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem6.id,
        input: 'SELECT u.name, o.amount FROM users u INNER JOIN orders o ON u.id = o.userId',
        expected: JSON.stringify([
          { name: 'Alice', amount: 100.0 },
          { name: 'Alice', amount: 200.0 },
          { name: 'Bob', amount: 150.0 },
        ]),
        isHidden: false,
      },
    ],
  });

  // 7. Left Join Basics (EASY - JOINS)
  const problem7 = await prisma.problem.create({
    data: {
      title: 'Left Join Basics',
      slug: 'left-join-basics',
      description: 'Join users with their orders using LEFT JOIN. Show all users, with orders if they exist.',
      difficulty: 'EASY',
      category: 'Left Join',
      schema: `CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100)
      );
      CREATE TABLE orders (
        id INT PRIMARY KEY,
        userId INT,
        amount DECIMAL(10, 2),
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,
      sampleData: `INSERT INTO users (id, name) VALUES
        (1, 'Alice'),
        (2, 'Bob'),
        (3, 'Charlie');
      INSERT INTO orders (id, userId, amount) VALUES
        (1, 1, 100.00),
        (2, 2, 150.00)`,
      solution: 'SELECT u.name, o.amount FROM users u LEFT JOIN orders o ON u.id = o.userId',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem7.id,
        input: 'SELECT u.name, o.amount FROM users u LEFT JOIN orders o ON u.id = o.userId',
        expected: JSON.stringify([
          { name: 'Alice', amount: 100.0 },
          { name: 'Bob', amount: 150.0 },
          { name: 'Charlie', amount: null },
        ]),
        isHidden: false,
      },
    ],
  });

  // ==================== SELF QUERY PROBLEMS ====================

  // 8. Self Join Basics (MEDIUM - SELF QUERIES)
  const problem8 = await prisma.problem.create({
    data: {
      title: 'Self Join Basics',
      slug: 'self-join-basics',
      description: 'Find employees and their managers. Table has id, name, and managerId.',
      difficulty: 'MEDIUM',
      category: 'Self Join',
      schema: `CREATE TABLE employees (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        managerId INT,
        FOREIGN KEY (managerId) REFERENCES employees(id)
      )`,
      sampleData: `INSERT INTO employees (id, name, managerId) VALUES
        (1, 'Alice', NULL),
        (2, 'Bob', 1),
        (3, 'Charlie', 1),
        (4, 'David', 2)`,
      solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.managerId = m.id',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem8.id,
        input: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.managerId = m.id',
        expected: JSON.stringify([
          { employee: 'Alice', manager: null },
          { employee: 'Bob', manager: 'Alice' },
          { employee: 'Charlie', manager: 'Alice' },
          { employee: 'David', manager: 'Bob' },
        ]),
        isHidden: false,
      },
    ],
  });

  // ==================== SQL 75 PROBLEMS (Advanced) ====================

  // 9. Window Functions Basics (MEDIUM)
  const problem9 = await prisma.problem.create({
    data: {
      title: 'Window Functions Basics',
      slug: 'window-functions-basics',
      description: 'Use ROW_NUMBER to assign row numbers to employees ordered by salary.',
      difficulty: 'MEDIUM',
      category: 'Window Functions',
      schema: `CREATE TABLE employees (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        salary DECIMAL(10, 2)
      )`,
      sampleData: `INSERT INTO employees (id, name, salary) VALUES
        (1, 'Alice', 5000),
        (2, 'Bob', 6000),
        (3, 'Charlie', 5500)`,
      solution: 'SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank FROM employees',
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem9.id,
        input: 'SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank FROM employees',
        expected: JSON.stringify([
          { name: 'Bob', salary: 6000.0, rank: 1 },
          { name: 'Charlie', salary: 5500.0, rank: 2 },
          { name: 'Alice', salary: 5000.0, rank: 3 },
        ]),
        isHidden: false,
      },
    ],
  });

  // 10. CTE Basics (MEDIUM)
  const problem10 = await prisma.problem.create({
    data: {
      title: 'CTE Basics',
      slug: 'cte-basics',
      description: 'Use a CTE to find employees with above average salary.',
      difficulty: 'MEDIUM',
      category: 'CTEs',
      schema: `CREATE TABLE employees (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        salary DECIMAL(10, 2)
      )`,
      sampleData: `INSERT INTO employees (id, name, salary) VALUES
        (1, 'Alice', 5000),
        (2, 'Bob', 6000),
        (3, 'Charlie', 5500)`,
      solution: `WITH avg_salary AS (
        SELECT AVG(salary) as avg_sal FROM employees
      )
      SELECT e.name, e.salary FROM employees e, avg_salary
      WHERE e.salary > avg_salary.avg_sal`,
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        problemId: problem10.id,
        input: `WITH avg_salary AS (
          SELECT AVG(salary) as avg_sal FROM employees
        )
        SELECT e.name, e.salary FROM employees e, avg_salary
        WHERE e.salary > avg_salary.avg_sal`,
        expected: JSON.stringify([
          { name: 'Bob', salary: 6000.0 },
          { name: 'Charlie', salary: 5500.0 },
        ]),
        isHidden: false,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${10} problems with test cases`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
