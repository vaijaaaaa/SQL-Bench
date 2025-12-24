import { executeSQLQuery } from "./sql-executor";

interface TestCase {
  id: string;
  input: string;
  expected: string;
  isHidden: boolean;
}

interface ValidationResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: TestCase[];
  executionTime: number;
}

export function compareResults(actual: any[], expected: any[]): boolean {

  if (actual.length !== expected.length) return false;
  

  const sortedActual = JSON.stringify(actual.sort());
  const sortedExpected = JSON.stringify(expected.sort());
  
  return sortedActual === sortedExpected;
}

export async function validateSubmission(
  query: string,
  testCases: TestCase[],
  problemSchema: string
): Promise<ValidationResult> {
  let passedTests = 0;
  const failedTests: TestCase[] = [];
  let totalExecutionTime = 0;

  for (const testCase of testCases) {
    try {
      const expected = JSON.parse(testCase.expected);
      
      const result = await executeSQLQuery(
        query,
        problemSchema,
        testCase.input,
        5000
      );

      totalExecutionTime += result.executionTime;

      if (result.success && compareResults(result.rows || [], expected)) {
        passedTests++;
      } else {
        failedTests.push(testCase);
      }
    } catch (error) {
      failedTests.push(testCase);
    }
  }

  return {
    passed: failedTests.length === 0,
    totalTests: testCases.length,
    passedTests,
    failedTests,
    executionTime: totalExecutionTime,
  };
}