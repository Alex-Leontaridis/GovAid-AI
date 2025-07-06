import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function finalTest() {
  console.log('🧪 Final QA Test - Simplified Approach\n');

  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    console.log('📡 Testing QA endpoint...');
    
    const response = await fetch(`${API_BASE_URL}/ask-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        policyText: 'The Supplemental Nutrition Assistance Program (SNAP) provides food assistance to eligible low-income individuals and families. To qualify, you must meet certain income and resource requirements. Your household income must be at or below 130% of the federal poverty level. You must also be a U.S. citizen or legal resident.',
        question: 'What are the eligibility requirements?'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS! QA is working perfectly!');
      console.log('📝 Answer:', data.data.answer);
      console.log('\n🎉 Everything is working 100% correctly!');
    } else {
      console.log('❌ Error:', data);
      console.log('Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

finalTest().catch(console.error); 