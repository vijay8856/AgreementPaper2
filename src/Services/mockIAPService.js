// services/mockIAPService.js
export class MockIAPService {
  static async requestPurchase(subscriptionId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return different test scenarios based on a parameter
    const testScenario = await AsyncStorage.getItem('TEST_IAP_SCENARIO') || 'success';
    
    switch (testScenario) {
      case 'success':
        return this.mockSuccessResponse(subscriptionId);
      case 'failed':
        return this.mockFailedResponse();
      case 'pending':
        return this.mockPendingResponse();
      case 'cancelled':
        return this.mockCancelledResponse();
      default:
        return this.mockSuccessResponse(subscriptionId);
    }
  }

  static mockSuccessResponse(subscriptionId) {
    return {
      transactionId: `mock_txn_${Date.now()}`,
      productId: subscriptionId,
      purchaseTime: Date.now(),
      purchaseToken: 'mock_purchase_token',
      orderId: `mock_order_${Date.now()}`,
      purchaseState: 0, // 0 = purchased
      acknowledged: false,
      packageName: 'com.agreementpaperapp2',
      signature: 'mock_signature',
      originalJson: JSON.stringify({
        orderId: `mock_order_${Date.now()}`,
        packageName: 'com.agreementpaperapp2',
        productId: subscriptionId,
        purchaseTime: Date.now(),
        purchaseState: 0,
        purchaseToken: 'mock_purchase_token'
      })
    };
  }

  static mockFailedResponse() {
    throw new Error('Payment failed: Insufficient funds');
  }

  static mockPendingResponse() {
    return {
      ...this.mockSuccessResponse('agreement_subscription_1'),
      purchaseState: 1, // 1 = pending
    };
  }

  static mockCancelledResponse() {
    throw { code: 'USER_CANCELLED', message: 'Purchase was cancelled' };
  }

  static async getAvailablePurchases() {
    return [this.mockSuccessResponse('agreement_subscription_1')];
  }

  static async getActiveSubscriptions() {
    return ['agreement_subscription_1'];
  }

  static async hasActiveSubscriptions() {
    return true;
  }
}