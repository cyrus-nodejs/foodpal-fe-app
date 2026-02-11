#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors');

const API_BASE_URL = 'https://jollofapi.onrender.com/api';

// Test configuration
const tests = [
  {
    name: 'Backend Health Check',
    method: 'GET',
    endpoint: '/health',
    expectedStatus: 200
  },
  {
    name: 'API Status Check',
    method: 'GET', 
    endpoint: '/status',
    expectedStatus: 200
  },
  {
    name: 'Get All Recipes',
    method: 'GET',
    endpoint: '/recipes',
    expectedStatus: 200
  },
  {
    name: 'Get All Ingredients',
    method: 'GET',
    endpoint: '/ingredients',
    expectedStatus: 200
  },
  {
    name: 'Ingredient Matching',
    method: 'POST',
    endpoint: '/recipes/match-ingredients',
    data: { ingredients: ['rice', 'tomato', 'onion'] },
    expectedStatus: 200
  }
];

class APITester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async runTest(test) {
    const testStartTime = Date.now();
    
    try {
      console.log(`🧪 Testing: ${test.name}...`.yellow);
      
      const config = {
        method: test.method,
        url: API_BASE_URL + test.endpoint,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (test.data) {
        config.data = test.data;
      }

      const response = await axios(config);
      const responseTime = Date.now() - testStartTime;
      
      const success = response.status === test.expectedStatus;
      
      this.results.push({
        name: test.name,
        success,
        status: response.status,
        responseTime,
        error: null
      });

      if (success) {
        console.log(`   ✅ PASS - ${response.status} (${responseTime}ms)`.green);
      } else {
        console.log(`   ❌ FAIL - Expected ${test.expectedStatus}, got ${response.status} (${responseTime}ms)`.red);
      }

    } catch (error) {
      const responseTime = Date.now() - testStartTime;
      
      this.results.push({
        name: test.name,
        success: false,
        status: error.response?.status || 'TIMEOUT',
        responseTime,
        error: error.response?.data?.message || error.message
      });

      console.log(`   ❌ FAIL - ${error.response?.status || 'TIMEOUT'} ${error.response?.data?.message || error.message} (${responseTime}ms)`.red);
    }
  }

  async runAllTests() {
    console.log('🚀 JollofAI Backend API Testing'.bold.cyan);
    console.log('====================================='.cyan);
    console.log(`Backend URL: ${API_BASE_URL}`.gray);
    console.log('');

    for (const test of tests) {
      await this.runTest(test);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }

    this.printSummary();
  }

  printSummary() {
    const totalTime = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const avgResponseTime = Math.round(
      this.results.reduce((sum, r) => sum + r.responseTime, 0) / this.results.length
    );

    console.log('');
    console.log('📊 Test Summary'.bold.cyan);
    console.log('====================================='.cyan);
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passed}`.green);
    console.log(`❌ Failed: ${failed}`.red);
    console.log(`⏱️  Average Response Time: ${avgResponseTime}ms`);
    console.log(`🕒 Total Time: ${totalTime}ms`);
    console.log('');

    if (failed > 0) {
      console.log('🔍 Failed Tests:'.red.bold);
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`   • ${result.name}: ${result.error || 'Status ' + result.status}`.red);
        });
      console.log('');
    }

    // Health assessment
    if (passed === this.results.length) {
      console.log('🎉 All tests passed! Your API is working correctly.'.green.bold);
    } else if (passed > this.results.length / 2) {
      console.log('⚠️  Some tests failed. Check your backend configuration.'.yellow.bold);
    } else {
      console.log('🚨 Many tests failed. Your backend may be down or misconfigured.'.red.bold);
    }

    console.log('');
    console.log('For more detailed testing, visit /api-tester in your web app.'.gray);
  }
}

// Run tests
async function main() {
  const tester = new APITester();
  await tester.runAllTests();
}

// Handle command line execution
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = APITester;