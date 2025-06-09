self.addEventListener('push', function(event) {
  const payload = event.data?.json();
  const title = payload?.notification?.title || 'Thông báo';
  const options = {
    body: payload?.notification?.body || '',
    data: payload?.data || {},
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
