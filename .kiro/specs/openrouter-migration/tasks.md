# Implementation Plan

- [x] 1. Update package dependencies
  - Remove @ai-sdk/anthropic and @anthropic-ai/sdk from package.json
  - Add @openrouter/ai-sdk-provider to package.json dependencies
  - Run npm install to update package-lock.json
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 2. Update environment configuration files
  - Replace ANTHROPIC_API_KEY with OPENROUTER_API_KEY in .env.example
  - Update README.md to reference OpenRouter API key instead of Anthropic
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Migrate builder agent to OpenRouter
  - Update import statement in src/mastra/agents/builder.ts from @ai-sdk/anthropic to @openrouter/ai-sdk-provider
  - Replace anthropic model configuration with OpenRouter createOpenRouter and horizon-beta model
  - Ensure environment variable reference uses OPENROUTER_API_KEY
  - _Requirements: 1.1, 1.2, 4.1, 4.3_

- [ ] 4. Migrate model configuration to OpenRouter
  - Update import statement in src/lib/model.ts from @ai-sdk/anthropic to @openrouter/ai-sdk-provider
  - Replace anthropic model with OpenRouter horizon-beta model configuration
  - Maintain identical export interface for backward compatibility
  - _Requirements: 1.1, 1.2, 4.2, 4.3_

- [ ] 5. Update build and update scripts
  - Modify scripts/update-ai-sdk.bash to reference @openrouter/ai-sdk-provider instead of @ai-sdk/anthropic
  - Remove references to @anthropic-ai/sdk from update script
  - Test script execution to ensure correct packages are installed
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 6. Validate migration functionality
  - Test that application starts without dependency errors
  - Verify AI model calls work correctly with horizon-beta model
  - Confirm all existing AI-powered features function identically
  - Test error handling with invalid or missing OpenRouter API key
  - _Requirements: 1.3, 2.4, 6.1, 6.2, 6.3, 6.4_