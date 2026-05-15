import api from './api';

export const getUserBookings = async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
};

export const downloadCertificate = async (eventId, userId) => {
    const response = await api.get(`/certificates/download/${eventId}/${userId}`, {
        responseType: 'blob'
    });
    
    // Create a link to download the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `certificate-${eventId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
