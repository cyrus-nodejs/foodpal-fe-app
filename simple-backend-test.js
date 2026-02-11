// Simple Backend API Test (No Dependencies)
console.log('🚀 Testing Backend API Endpoints...\n');

// Test configurations
const configs = [
  { name: 'Direct API Root', url: 'https://jollofapi.onrender.com' },
  { name: 'API with /api path', url: 'https://jollofapi.onrender.com/api' },
  { name: 'Health endpoint', url: 'https://jollofapi.onrender.com/health' },
  { name: 'API Health endpoint', url: 'https://jollofapi.onrender.com/api/health' },
  { name: 'Status endpoint', url: 'https://jollofapi.onrender.com/status' },
  { name: 'API Status endpoint', url: 'https://jollofapi.onrender.com/api/status' },
  { name: 'Recipes endpoint', url: 'https://jollofai.onrender.com/api/recipes' }
];

async function testEndpoint(config) {
  try {
    console.log(`🔍 Testing: ${config.name}`);
    console.log(`   URL: ${config.url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(config.url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
    
    const contentType = response.headers.get('content-type');
    console.log(`   📄 Content-Type: ${contentType}`);
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        console.log(`   📦 Response: ${JSON.stringify(data).substring(0, 200)}...`);
      } catch {
        console.log(`   📦 Response: JSON parsing failed`);
      }
    } else {
      const text = await response.text();
      console.log(`   📦 Response: ${text.substring(0, 200)}...`);
    }
    
    return { success: true, status: response.status, config };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message, config };
  }
  console.log(''); // Empty line for spacing
}

async function runTests() {
  const results = [];
  
  for (const config of configs) {
    const result = await testEndpoint(config);
    results.push(result);
    console.log(''); // Spacing between tests
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('=' .repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('\n✅ WORKING ENDPOINTS:');
    successful.forEach(r => {
      console.log(`   ${r.config.name}: ${r.config.url} (Status: ${r.status})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED ENDPOINTS:');
    failed.forEach(r => {
      console.log(`   ${r.config.name}: ${r.config.url} - ${r.error}`);
    });
  }
  
  if (successful.length > 0) {
    console.log('\n🎯 RECOMMENDED ACTIONS:');
    const bestEndpoint = successful[0];
    console.log(`1. Use this working endpoint: ${bestEndpoint.config.url}`);
    console.log(`2. Update your src/config/api.ts file:`);
    console.log(`   export const API_BASE_URL = '${bestEndpoint.config.url}';`);
  } else {
    console.log('\n⚠️  NO WORKING ENDPOINTS FOUND!');
    console.log('   The backend server might be down or misconfigured.');
    console.log('   Check with your backend team or deployment logs.');
  }
}

runTests().catch(console.error);