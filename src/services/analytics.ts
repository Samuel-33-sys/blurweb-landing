/**
 * Lightweight, non-blocking analytics service for high-scale SaaS.
 */
export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  // Use requestIdleCallback or setTimeout to offload from main thread
  const sender = window.requestIdleCallback || ((cb: any) => setTimeout(cb, 50));

  sender(() => {
    // In a real high-scale app, we would send this to a collector
    // console.log(`[Track] ${eventName}`, properties);
    
    // Example: tracking without blocking
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify({ event: eventName, ...properties, ts: Date.now() }),
    //   keepalive: true // Important for ensuring the request completes
    // }).catch(() => {});
  });
};

export const trackPageView = (page: string) => {
  trackEvent('page_view', { page });
};
