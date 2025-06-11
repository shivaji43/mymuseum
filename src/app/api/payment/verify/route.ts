import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      is_test = false
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification parameters' },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    // For development, use a hardcoded test secret key if the environment variable is not available
    // In production, this should ALWAYS use environment variables
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Use the environment variable if available, otherwise use the test key in development
    const secret = process.env.RAZORPAY_KEY_SECRET || 
      (isDevelopment ? 'RazorpayTestSecretKey12345678901234' : '');
    
    // Debug logs
    console.log('Environment:', isDevelopment ? 'development' : 'production');
    console.log('Verification payload:', payload);
    console.log('Secret key source:', process.env.RAZORPAY_KEY_SECRET ? 'Environment variable' : 
      (isDevelopment ? 'Test key fallback' : 'Missing'));
      
    // Always log a warning if using the fallback key
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.warn('RAZORPAY_KEY_SECRET environment variable is not set');
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;

    // In development, if test flag is sent, allow the verification to pass
    //const isDevelopment = process.env.NODE_ENV === 'development';
    const allowTestPayment = isDevelopment && is_test;
    
    if (isAuthentic || allowTestPayment) {
      return NextResponse.json({ 
        success: true, 
        message: allowTestPayment ? 'Test payment accepted' : 'Payment verified successfully',
        debug: {
          isDevelopment,
          isTestPayment: is_test,
          signatureMatched: isAuthentic
        }
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Invalid payment signature',
          debug: {
            isDevelopment,
            isTestPayment: is_test,
            signatureMatched: isAuthentic
          } 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
