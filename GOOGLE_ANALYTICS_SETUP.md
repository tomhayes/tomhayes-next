# Google Analytics Setup Guide

This project includes Google Analytics 4 (GA4) integration for tracking website analytics.

## Setup Instructions

### 1. Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. In your property settings, go to "Data Streams"
4. Select your web stream or create a new one
5. Copy your **Measurement ID** (it looks like `G-XXXXXXXXXX`)

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Measurement ID to `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### 3. Features Included

- **Automatic Page View Tracking**: Tracks page views on route changes
- **Custom Event Tracking**: Use the `useTrackEvent` hook for custom events
- **Privacy Compliant**: Only loads when a valid Measurement ID is provided
- **TypeScript Support**: Fully typed implementation

### 4. Usage Examples

#### Track Custom Events

```tsx
import { useTrackEvent } from '@/components/analytics';

function ContactForm() {
  const trackEvent = useTrackEvent();

  const handleSubmit = () => {
    // Track form submission
    trackEvent('form_submit', 'contact', 'contact_form');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form */}
    </form>
  );
}
```

#### Track Downloads

```tsx
const handleDownload = (fileName: string) => {
  trackEvent('download', 'file', fileName);
};
```

#### Track Outbound Links

```tsx
const handleExternalLink = (url: string) => {
  trackEvent('click', 'outbound_link', url);
};
```

### 5. Privacy Considerations

- Analytics only load in production when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- Consider adding a cookie consent banner for GDPR compliance
- The implementation respects user privacy settings

### 6. Testing

- **Development**: Analytics won't load without the environment variable
- **Production**: Verify tracking in Google Analytics Real-time reports
- **Debug**: Use browser dev tools to check for gtag events

## Compliance Notes

This implementation:
- Uses Google Analytics 4 (the latest version)
- Loads scripts with `afterInteractive` strategy for performance
- Automatically tracks page views on route changes
- Provides hooks for custom event tracking
- Is fully TypeScript compatible
