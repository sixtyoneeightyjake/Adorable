# Requirements Document

## Introduction

This feature involves migrating the AI provider from Anthropic's Claude models (currently using claude-3-7-sonnet and claude-4-sonnet) through Vercel's AI SDK to OpenRouter's unified API gateway using the horizon-beta model. The migration should maintain all existing functionality while switching to the new provider and model, updating dependencies, environment variables, and configuration accordingly.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to migrate from Anthropic's direct API to OpenRouter's unified gateway, so that I can access multiple AI providers through a single API and potentially reduce costs.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL use OpenRouter's API instead of Anthropic's direct API
2. WHEN making AI model calls THEN the system SHALL use the horizon-beta model through OpenRouter
3. WHEN the migration is complete THEN all existing AI functionality SHALL work exactly as before
4. WHEN using the new provider THEN the system SHALL require only an OpenRouter API key instead of an Anthropic API key

### Requirement 2

**User Story:** As a developer, I want to update all dependencies and imports, so that the codebase uses the correct OpenRouter provider package.

#### Acceptance Criteria

1. WHEN reviewing package.json THEN the system SHALL include @openrouter/ai-sdk-provider dependency
2. WHEN reviewing package.json THEN the system SHALL remove @ai-sdk/anthropic and @anthropic-ai/sdk dependencies
3. WHEN examining import statements THEN all files SHALL import from @openrouter/ai-sdk-provider instead of @ai-sdk/anthropic
4. WHEN running the application THEN there SHALL be no dependency-related errors

### Requirement 3

**User Story:** As a developer, I want to update environment configuration, so that the application uses OpenRouter credentials instead of Anthropic credentials.

#### Acceptance Criteria

1. WHEN reviewing environment variables THEN the system SHALL use OPENROUTER_API_KEY instead of ANTHROPIC_API_KEY
2. WHEN checking .env.example THEN it SHALL reference the OpenRouter API key
3. WHEN reading documentation THEN it SHALL provide instructions for obtaining OpenRouter API keys
4. WHEN the application initializes THEN it SHALL authenticate with OpenRouter using the provided API key

### Requirement 4

**User Story:** As a developer, I want all AI model references updated to use horizon-beta, so that the application uses the specified model consistently.

#### Acceptance Criteria

1. WHEN examining src/mastra/agents/builder.ts THEN the model SHALL be horizon-beta through OpenRouter
2. WHEN examining src/lib/model.ts THEN the exported model SHALL be horizon-beta through OpenRouter
3. WHEN the AI agent makes requests THEN it SHALL use the horizon-beta model
4. WHEN model calls are made THEN they SHALL maintain the same interface and functionality as before

### Requirement 5

**User Story:** As a developer, I want the update scripts modified, so that future updates use the correct OpenRouter packages.

#### Acceptance Criteria

1. WHEN reviewing scripts/update-ai-sdk.bash THEN it SHALL reference @openrouter/ai-sdk-provider instead of @ai-sdk/anthropic
2. WHEN running update scripts THEN they SHALL install the correct OpenRouter dependencies
3. WHEN updating packages THEN the script SHALL not attempt to install deprecated Anthropic packages
4. WHEN the script completes THEN all dependencies SHALL be compatible with OpenRouter integration

### Requirement 6

**User Story:** As a developer, I want comprehensive testing of the migration, so that I can ensure all functionality works correctly with the new provider.

#### Acceptance Criteria

1. WHEN the migration is complete THEN all existing AI-powered features SHALL function identically
2. WHEN making AI requests THEN response format and structure SHALL remain consistent
3. WHEN errors occur THEN error handling SHALL work as expected with OpenRouter
4. WHEN the application runs THEN there SHALL be no console errors related to the AI provider change