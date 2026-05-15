package com.event.service;

import com.event.entity.Event;
import com.event.entity.User;
import java.io.ByteArrayInputStream;

public interface CertificateService {
    ByteArrayInputStream generateCertificate(User user, Event event);
}
