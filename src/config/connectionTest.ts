import axios from 'axios';
import { API_BASE_URL } from './api';

interface HealthCheckResponse {
  status: 'ok' | 'error';
  message: string;
  timestamp: string;
  version?: string;
  uptime?: number;
}

export class APIConnectionService {
  private static instance: APIConnectionService;
  private isConnected = false;
  private lastChecked: Date | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  static getInstance(): APIConnectionService {
    if (!APIConnectionService.instance) {
      APIConnectionService.instance = new APIConnectionService();
    }
    return APIConnectionService.instance;
  }

  async checkConnection(): Promise<boolean> {
    try {
      console.log(`🔌 Checking connection to backend: ${API_BASE_URL}`);
      
      const response = await axios.get<HealthCheckResponse>(`${API_BASE_URL}/health`, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data.status === 'ok') {
        this.isConnected = true;
        this.lastChecked = new Date();
        this.retryCount = 0;
        
        console.log('✅ Backend connection successful:', response.data);
        return true;
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error: any) {
      this.isConnected = false;
      this.retryCount++;
      
      console.error('❌ Backend connection failed:', {
        url: API_BASE_URL,
        error: error.message,
        retryCount: this.retryCount,
        maxRetries: this.maxRetries,
      });

      // Auto-retry logic
      if (this.retryCount < this.maxRetries) {
        console.log(`🔄 Retrying connection in 2 seconds... (${this.retryCount}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.checkConnection();
      }

      return false;
    }
  }

  async testAuthEndpoint(): Promise<boolean> {
    try {
      console.log('🔐 Testing authentication endpoint...');
      
      const response = await axios.post(`${API_BASE_URL}/auth/test`, {
        test: true
      }, {
        timeout: 5000,
      });

      console.log('✅ Auth endpoint test successful');
      return true;
    } catch (error: any) {
      console.error('❌ Auth endpoint test failed:', error.message);
      return false;
    }
  }

  async testRecipeEndpoint(): Promise<boolean> {
    try {
      console.log('🍳 Testing recipes endpoint...');
      
      const response = await axios.get(`${API_BASE_URL}/recipes?limit=1`, {
        timeout: 5000,
      });

      console.log('✅ Recipes endpoint test successful');
      return true;
    } catch (error: any) {
      console.error('❌ Recipes endpoint test failed:', error.message);
      return false;
    }
  }

  async runFullConnectionTest(): Promise<{
    overall: boolean;
    results: {
      health: boolean;
      auth: boolean;
      recipes: boolean;
    };
  }> {
    console.log('🚀 Starting full backend connection test...');
    console.log(`📍 Backend URL: ${API_BASE_URL}`);
    
    const results = {
      health: false,
      auth: false,
      recipes: false,
    };

    // Test health endpoint
    results.health = await this.checkConnection();
    
    // Test auth endpoint if health check passes
    if (results.health) {
      results.auth = await this.testAuthEndpoint();
      results.recipes = await this.testRecipeEndpoint();
    }

    const overall = results.health && results.auth && results.recipes;
    
    console.log('📊 Connection test results:', {
      overall: overall ? '✅ PASS' : '❌ FAIL',
      health: results.health ? '✅' : '❌',
      auth: results.auth ? '✅' : '❌',
      recipes: results.recipes ? '✅' : '❌',
    });

    return { overall, results };
  }

  getConnectionStatus(): {
    isConnected: boolean;
    lastChecked: Date | null;
    baseUrl: string;
  } {
    return {
      isConnected: this.isConnected,
      lastChecked: this.lastChecked,
      baseUrl: API_BASE_URL,
    };
  }

  resetRetries(): void {
    this.retryCount = 0;
  }
}

// Export singleton instance
export const apiConnection = APIConnectionService.getInstance();

// Test function to be called from console or component
export async function testBackendConnection(): Promise<void> {
  const result = await apiConnection.runFullConnectionTest();
  
  if (result.overall) {
    console.log('🎉 All backend tests passed! Your frontend is ready to connect.');
  } else {
    console.log('⚠️ Some backend tests failed. Please check your backend server.');
  }
}

export default APIConnectionService;