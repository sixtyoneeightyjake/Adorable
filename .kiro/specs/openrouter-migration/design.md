# Design Document

## Overview

This design outlines the migration from Anthropic's Claude models to OpenRouter's unified API gateway using the horizon-beta model. The migration involves updating dependencies, changing import statements, modifying model configurations, updating environment variables, and ensuring all existing functionality remains intact.

The migration leverages OpenRouter's `@openrouter/ai-sdk-provider` package which provides seamless integration with Vercel's AI SDK while offering access to hundreds of models through a single API key.

## Architecture

### Current Architecture
- **Provider**: Direct Anthropic API through `@ai-sdk/anthropic`
- **Models**: claude-3-7-sonnet-20250219 (builder agent), claude-4-sonnet-20250514 (model.ts)
- **Authentication**: ANTHROPIC_API_KEY environment variable
- **Integration**: Vercel AI SDK with Anthropic provider

### Target Architecture
- **Provider**: OpenRouter unified gateway through `@openrouter/ai-sdk-provider`
- **Model**: horizon-beta (consistent across all usage)
- **Authentication**: OPENROUTER_API_KEY environment variable
- **Integration**: Vercel AI SDK with OpenRouter provider

### Migration Strategy
The migration follows a systematic approach:
1. Update package dependencies
2. Replace import statements
3. Update model configurations
4. Change environment variables
5. Update documentation and scripts
6. Test functionality

## Components and Interfaces

### Package Dependencies

**Remove:**
```json
"@ai-sdk/anthropic": "^2.0.0-beta.8",
"@anthropic-ai/sdk": "^0.40.1"
```

**Add:**
```json
"@openrouter/ai-sdk-provider": "latest"
```

### Provider Configuration

**Current Implementation:**
```typescript
import { anthropic } from "@ai-sdk/anthropic";
const model = anthropic("claude-3-7-sonnet-20250219");
```

**Target Implementation:**
```typescript
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const model = openrouter.chat('horizon-beta');
```

**Key Point:** Since both providers implement Vercel's AI SDK interface, the model object will have identical methods and behavior. The Agent, tools, memory, and all other components remain completely unchanged - only the model provider is swapped.

### File-Specific Changes

#### src/mastra/agents/builder.ts
- Replace anthropic import with createOpenRouter
- Update model configuration to use horizon-beta
- **No changes needed** to Agent configuration, tools, memory, or instructions - these remain identical

#### src/lib/model.ts
- Replace anthropic import with createOpenRouter
- Update exported model to use horizon-beta
- **Interface remains identical** - the exported model will have the same AI SDK interface

#### Environment Configuration
- Update .env.example to reference OPENROUTER_API_KEY
- Update README.md documentation
- Update any deployment scripts or documentation

#### Update Scripts
- Modify scripts/update-ai-sdk.bash to reference OpenRouter packages
- Remove Anthropic package references

## Data Models

### Environment Variables
```typescript
// Current
ANTHROPIC_API_KEY: string

// Target
OPENROUTER_API_KEY: string
```

### Model Configuration
```typescript
// Current interface maintained
interface ModelConfig {
  provider: 'anthropic' | 'openrouter';
  model: string;
  apiKey: string;
}

// Implementation changes but interface remains consistent
```

## Error Handling

### API Key Validation
- Implement validation for OPENROUTER_API_KEY presence
- Provide clear error messages if API key is missing or invalid
- Maintain existing error handling patterns for model calls

### Model Availability
- Handle cases where horizon-beta model might be temporarily unavailable
- Implement appropriate fallback or retry mechanisms
- Ensure error messages are informative for debugging

### Migration Validation
- Verify OpenRouter provider initialization
- Test model response format compatibility
- Validate that all existing functionality works with new provider

## Testing Strategy

### Unit Testing
- Test OpenRouter provider initialization
- Verify model configuration with horizon-beta
- Test error handling for invalid API keys
- Validate environment variable loading

### Integration Testing
- Test AI agent functionality with new provider
- Verify chat streaming still works correctly
- Test memory and tool integration with new model
- Validate response format consistency

### Functional Testing
- Test all existing AI-powered features
- Verify builder agent functionality
- Test model exports and imports
- Validate environment configuration loading

### Migration Validation
- Compare responses between old and new providers (if possible)
- Test performance characteristics
- Verify cost and usage tracking works with OpenRouter
- Ensure no functionality regression

## Implementation Considerations

### Backward Compatibility
- **Perfect compatibility guaranteed** - Vercel's AI SDK provides a standardized interface
- All existing code using the model will work without any changes
- Agent tools, memory, and instructions remain completely unchanged
- Response format and streaming behavior identical across providers

### Performance
- OpenRouter may have different latency characteristics
- Monitor response times during migration
- Consider any rate limiting differences
- Evaluate cost implications of model change

### Security
- Secure handling of OPENROUTER_API_KEY
- Ensure API key is not logged or exposed
- Validate API key format and permissions
- Follow OpenRouter security best practices

### Deployment
- Update deployment environment variables
- Ensure staging and production environments are updated
- Plan rollback strategy if issues arise
- Monitor application health post-migration