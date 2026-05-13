package com.event.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final ConcurrentHashMap<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();
    private final int MAX_REQUESTS_PER_MINUTE = 60;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = request.getRemoteAddr();
        long currentTime = System.currentTimeMillis();
        
        requestCounts.compute(clientIp, (ip, counter) -> {
            if (counter == null || currentTime - counter.startTime > TimeUnit.MINUTES.toMillis(1)) {
                return new RequestCounter(currentTime, new AtomicInteger(1));
            }
            counter.count.incrementAndGet();
            return counter;
        });

        if (requestCounts.get(clientIp).count.get() > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Rate limit exceeded. Try again in a minute.");
            return false;
        }

        return true;
    }

    private static class RequestCounter {
        long startTime;
        AtomicInteger count;

        RequestCounter(long startTime, AtomicInteger count) {
            this.startTime = startTime;
            this.count = count;
        }
    }
}
