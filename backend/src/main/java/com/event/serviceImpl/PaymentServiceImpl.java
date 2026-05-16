package com.event.serviceImpl;

import com.event.entity.Booking;
import com.event.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public Order createRazorpayOrder(Double amount) throws RazorpayException {
        if (razorpayKeyId == null || razorpayKeyId.isEmpty() || razorpayKeyId.contains("your_key")) {
            throw new RuntimeException("Razorpay keys are not configured. Please add them to application.properties.");
        }
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int)(amount * 100)); // Amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
        
        JSONObject notes = new JSONObject();
        notes.put("app_name", "EventPulse");
        notes.put("payment_purpose", "Event Ticket Booking");
        orderRequest.put("notes", notes);
        
        return razorpayClient.orders.create(orderRequest);
    }

    @Override
    public Session createStripeSession(Booking booking, String successUrl, String cancelUrl) throws StripeException {
        if (Stripe.apiKey == null || Stripe.apiKey.isEmpty()) {
            throw new RuntimeException("Stripe API key is not configured. Please add it to application.properties.");
        }
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount((long)(booking.getAmount() * 100))
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(booking.getEvent().getTitle())
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        return Session.create(params);
    }

    @Override
    public boolean verifyRazorpayPayment(String orderId, String paymentId, String signature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);
            return Utils.verifyPaymentSignature(options, razorpayKeySecret);
        } catch (RazorpayException e) {
            return false;
        }
    }
}
