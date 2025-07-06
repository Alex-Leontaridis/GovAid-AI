import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testUrl = 'https://www.ssa.gov/benefits/retirement/planner/retirechart.html';
const testText = `The Social Security retirement program provides monthly benefits to eligible workers and their families. To qualify for retirement benefits, you must have worked and paid Social Security taxes for at least 10 years. The amount of your benefit depends on your earnings history and the age at which you choose to start receiving benefits. You can start receiving benefits as early as age 62, but your monthly benefit will be reduced if you start before your full retirement age. 

Additionally, there are specific requirements for disability benefits. To qualify for Social Security Disability Insurance (SSDI), you must have a medical condition that prevents you from working for at least 12 months or is expected to result in death. You must also have earned enough work credits through your employment history. The number of work credits needed depends on your age when you become disabled.

For Supplemental Security Income (SSI), which is a needs-based program, you must have limited income and resources. The income limits are quite strict, and most of your income counts toward the limit. Resources include things like cash, bank accounts, stocks, and bonds. The resource limit is $2,000 for individuals and $3,000 for couples.`;

async function testEndpoint(name, method, endpoint, data = null) {
  try {
    console.log(`🧪 Testing ${name}...`);
    
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    console.log(`✅ ${name} - SUCCESS`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    console.log('');
    
    return true;
  } catch (error) {
    console.log(`❌ ${name} - FAILED`);
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
    console.log('');
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting GovAid-AI Backend API Tests\n');
  
  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      endpoint: '/health'
    },
    {
      name: 'List Endpoints',
      method: 'GET',
      endpoint: '/endpoints'
    },
    {
      name: 'Summarize Text (LangChain)',
      method: 'POST',
      endpoint: '/summarize',
      data: { text: testText }
    },
    {
      name: 'Generate Checklist (LangChain)',
      method: 'POST',
      endpoint: '/checklist',
      data: { text: testText }
    },
    {
      name: 'Ask Question (LangChain RetrievalQA)',
      method: 'POST',
      endpoint: '/ask-question',
      data: { 
        policyText: testText,
        question: 'What are the income limits for SSI benefits?'
      }
    },
    {
      name: 'Process Document (Advanced LangChain)',
      method: 'POST',
      endpoint: '/process-document',
      data: { text: testText }
    }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const success = await testEndpoint(
      test.name, 
      test.method, 
      test.endpoint, 
      test.data
    );
    if (success) passed++;
  }
  
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the server logs for details.');
  }
  
  console.log('\n💡 Note: URL extraction tests require a running server with OpenAI API key configured.');
  console.log('   To test URL extraction, use:');
  console.log(`   curl -X POST ${BASE_URL}/extract-text -H "Content-Type: application/json" -d '{"url":"${testUrl}"}'`);
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests }; 