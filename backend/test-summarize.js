import fetch from 'node-fetch';

const simpleText = "This is a simple test text for summarization. It contains basic content that should be easy to process.";

const complexText = "Welfare benefits or Temporary Assistance for Needy Families (TANF) If you or your family are experiencing financial hardship, find out how you can get help paying for food, housing, and more. What is TANF?Temporary Assistance for Needy Families (TANF) is a federally funded, state-run program. Also known as welfare, TANF helps families pay for:FoodHousingHome energyChild careIn addition to cash assistance for living expenses, many states offer job training and help with tuition payments for work-related education.Each state or tribal government runs its TANF program differently and has a different name.Find out if you are eligible for TANF benefits and applyEvery state or tribal territory has its own TANF requirements for who can get financial help, services, or other benefits. You must be a resident of the state where you are applying.Find your local TANF officeCheck your TANF balanceEvery state issues TANF benefits electronically on a debit card or through direct deposit. But some also issue benefits with paper checks. If you receive your benefits electronically:Check the receipt from the store where you made your purchase using a TANF card. Many stores will print the amount of money left on your card.Find out if your state offers a mobile app to help manage your benefits and check your available balance.Look for a phone number on the back of your card. The number may be for your local TANF office, which can tell you your balance.Report TANF fraud, ask a question, or file a complaintIf you suspect possible welfare fraud or have a question or complaint about TANF:Find your local TANF officeFile a complaint online with the Department of Health and Human Services (HHS) Office of Inspector General Image Find more government programs to help during pregnancy and early childhood. LAST UPDATED: January 3, 2025 SHARE THIS PAGE: Have a question? Ask a real person any government-related question for free. They will get you the answer or let you know where to find it. Call USAGov Chat with USAGov Top";

async function testSummarize(text, description) {
  try {
    console.log(`\n=== Testing ${description} ===`);
    console.log('Text length:', text.length);
    
    const response = await fetch('http://localhost:3001/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        targetLang: 'en'
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('Success:', data.data.summary.substring(0, 100) + '...');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function runTests() {
  await testSummarize(simpleText, 'simple text');
  await testSummarize(complexText, 'complex text');
}

runTests(); 