// Test actual API endpoints
const urls = [
  'https://jollofapi.onrender.com/auth/login',
  'https://jollofapi.onrender.com/users',
  'https://jollofapi.onrender.com/recipes',
  'https://jollofapi.onrender.com/ingredients'
];

async function testEndpoints() {
  console.log('🧪 Testing Real API Endpoints...\n');
  
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'GET', 
        headers: {'Accept': 'application/json'}
      });
      console.log(`✅ ${url} - ${res.status} ${res.statusText}`);
      
      if (res.status === 200) {
        try {
          const data = await res.json();
          console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
        } catch {
          console.log('   (Not JSON response)');
        }
      }
    } catch (e) {
      console.log(`❌ ${url} - ${e.message}`);
    }
    console.log('');
  }
}

testEndpoints();