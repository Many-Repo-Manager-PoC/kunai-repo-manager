# GitHub Webhook Management System

This document describes the GitHub webhook management system implemented for the Kunai Repository Manager.

## Overview

The system automatically manages GitHub webhooks for organizations that are onboarded to the application. It ensures that webhooks are created when organizations are first added and recreates them if they are deleted or become inactive.

## Features

- **Automatic Organization Onboarding**: When a user authenticates, their organizations are automatically onboarded with webhooks
- **Webhook Health Monitoring**: Regular health checks to ensure webhooks are active and properly configured
- **Automatic Recreation**: Webhooks are automatically recreated if they are deleted or become inactive
- **Admin Controls**: Manual webhook management endpoints for administrators

## Architecture

### Database Schema

The `Organization` type has been extended with webhook tracking fields:

```gel
type Organization extending Timestamped {
  // ... existing fields ...
  webhook_id: int64;      // GitHub webhook ID
  webhook_url: str;       // Webhook URL
}
```

### Services

#### `webhook.service.ts`

Core webhook management functions:

- `createOrganizationWebhook()` - Creates a new webhook
- `updateOrganizationWebhook()` - Updates an existing webhook
- `deleteOrganizationWebhook()` - Deletes a webhook
- `checkWebhookHealth()` - Checks if a webhook exists and is active
- `ensureOrganizationWebhook()` - Ensures a webhook exists, creating or updating as needed

#### `organization.service.ts`

Organization management functions:

- `upsertOrganization()` - Inserts or updates organization data
- `onboardOrganization()` - Complete onboarding process including webhook creation
- `checkAndRecreateWebhooks()` - Checks and recreates webhooks for all organizations

#### `webhook-health.service.ts`

Health monitoring functions:

- `performWebhookHealthCheck()` - Comprehensive health check for all webhooks
- `generateHealthCheckSummary()` - Generates summary statistics
- `logHealthCheckResults()` - Logs health check results

## Configuration

### Environment Variables

```bash
# Required: The URL where webhooks should be sent
WEBHOOK_URL=https://your-app.com/webhooks

# Optional: Secret for webhook verification
WEBHOOK_SECRET=your-webhook-secret
```

### GitHub OAuth Scopes

The application requires the following GitHub OAuth scopes:

- `read:org` - Read organization information
- `admin:org_hook` - Manage organization webhooks

## API Endpoints

### Authentication Integration

The webhook management is integrated into the authentication flow. When a user authenticates:

1. Their organizations are fetched from GitHub
2. Each organization is onboarded with a webhook
3. Organization data is stored in the database

### Admin Endpoints

#### `POST /admin/webhooks`

Manually trigger webhook health check and recreation for all organizations.

**Authentication**: Requires GitHub OAuth with `admin:org_hook` scope.

**Response**:

```json
{
  "message": "Webhook health check completed",
  "summary": {
    "total": 5,
    "successful": 4,
    "failed": 1,
    "results": [...]
  }
}
```

#### `GET /admin/webhooks`

Get information about the webhook management endpoint.

### Cron Endpoints

#### `GET /cron/webhook-health-check`

Scheduled webhook health check endpoint. Can be called by a cron job or scheduler.

**Authentication**: Requires GitHub OAuth with `admin:org_hook` scope.

## Webhook Events

The system listens for the following GitHub webhook events:

- `push` - Repository push events
- `repository` - Repository creation, deletion, and updates
- `package` - Package-related events

## Webhook Handler

The webhook handler at `/webhooks` processes incoming webhook events and includes logic to detect webhook deletions:

```typescript
// Handle webhook deletion events
if ("hook" in data && data.action === "deleted") {
  console.warn(
    `Webhook deleted for organization ${orgLogin}. Manual recreation required.`,
  );
}
```

## Monitoring and Maintenance

### Health Checks

The system provides comprehensive health checking:

1. **Existence Check**: Verifies the webhook exists in GitHub
2. **Activity Check**: Ensures the webhook is active
3. **Configuration Check**: Validates the webhook URL matches expected configuration
4. **Automatic Recreation**: Recreates webhooks that are missing or misconfigured

### Logging

The system provides detailed logging for:

- Organization onboarding
- Webhook creation, updates, and deletions
- Health check results
- Error conditions

### Error Handling

The system is designed to be resilient:

- Individual organization failures don't affect others
- Authentication failures don't break the entire process
- Webhook recreation is attempted automatically
- Detailed error logging for troubleshooting

## Usage Examples

### Manual Webhook Recreation

```bash
# Trigger webhook health check and recreation
curl -X POST https://your-app.com/admin/webhooks \
  -H "Authorization: Bearer YOUR_GITHUB_TOKEN"
```

### Scheduled Health Checks

Set up a cron job to run health checks periodically:

```bash
# Run every hour
0 * * * * curl -X GET https://your-app.com/cron/webhook-health-check
```

## Troubleshooting

### Common Issues

1. **Webhook Creation Fails**

   - Check GitHub OAuth scopes include `admin:org_hook`
   - Verify the user has admin access to the organization
   - Check webhook URL is accessible

2. **Webhooks Not Receiving Events**

   - Verify webhook URL is correct and accessible
   - Check webhook secret configuration
   - Ensure webhook is active in GitHub

3. **Database Migration Issues**
   - Apply the migration: `pnpm gel migration apply`
   - Regenerate queries: `pnpm generate queries`

### Debugging

Enable debug logging by checking the console output for:

- Organization onboarding messages
- Webhook creation/update logs
- Health check results
- Error messages with stack traces

## Security Considerations

- Webhook secrets should be stored securely in environment variables
- GitHub OAuth tokens should have minimal required scopes
- Webhook endpoints should be protected with proper authentication
- Regular rotation of webhook secrets is recommended

## Future Enhancements

- Webhook event filtering and customization
- Webhook delivery status monitoring
- Integration with external monitoring systems
- Webhook retry logic for failed deliveries
- Organization-specific webhook configurations
