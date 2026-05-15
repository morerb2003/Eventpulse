package com.event.service;

import com.event.entity.Booking;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import java.util.Map;

public interface PaymentService {
    Order createRazorpayOrder(Double amount) throws RazorpayException;
    Session createStripeSession(Booking booking, String successUrl, String cancelUrl) throws StripeException;
    boolean verifyRazorpayPayment(String orderId, String paymentId, String signature);
}
