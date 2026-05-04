/**
 * Synthia™ Onboarding Flow Types & Utilities
 *
 * Guided flows for:
 * 1. Data Import (ChatGPT, Claude, Notion)
 * 2. BYOT Setup (API keys for OpenAI, Anthropic, etc.)
 * 3. Second Brain Initialization
 */

export type OnboardingStep = 'import' | 'tools' | 'brain' | 'complete';

export interface OnboardingState {
  current_step: OnboardingStep;
  completed_steps: OnboardingStep[];
  data_imported: boolean;
  tools_configured: boolean;
  brain_initialized: boolean;
  user_email?: string;
  preferences?: {
    language: 'es' | 'en' | 'pt';
    timezone: string;
    marketing_consent: boolean;
  };
}

export interface ImportProgress {
  status: 'pending' | 'processing' | 'complete' | 'error';
  file_name: string;
  file_size: number;
  entries_imported: number;
  error?: string;
  progress_percent: number;
}

export interface ToolSetupStatus {
  provider: string;
  configured: boolean;
  verified: boolean;
  error?: string;
  models_available: string[];
}

export class OnboardingManager {
  private state: OnboardingState;

  constructor() {
    this.state = {
      current_step: 'import',
      completed_steps: [],
      data_imported: false,
      tools_configured: false,
      brain_initialized: false,
    };
  }

  /**
   * Start data import flow
   */
  async startImport(file: File): Promise<ImportProgress> {
    const { parseMarkdownEntry, autoParseExport } = await import('../data-import/index');
    const { getSecondBrainStore } = await import('../second-brain/store');

    try {
      const content = await file.text();
      const parsed = autoParseExport(content, file.name);

      // If it's a ConversationEntry, extract brain entries
      if ('messages' in parsed) {
        const { extractBrainEntriesFromConversation } = await import('../data-import/index');
        const entries = extractBrainEntriesFromConversation(parsed);

        const store = await getSecondBrainStore();
        await store.saveEntries(entries);

        this.state.data_imported = true;

        return {
          status: 'complete',
          file_name: file.name,
          file_size: file.size,
          entries_imported: entries.length,
          progress_percent: 100,
        };
      } else if (Array.isArray(parsed)) {
        // Notion-like array
        const store = await getSecondBrainStore();
        await store.saveEntries(parsed);

        this.state.data_imported = true;

        return {
          status: 'complete',
          file_name: file.name,
          file_size: file.size,
          entries_imported: parsed.length,
          progress_percent: 100,
        };
      } else {
        // Single entry
        const store = await getSecondBrainStore();
        await store.saveEntry(parsed);

        this.state.data_imported = true;

        return {
          status: 'complete',
          file_name: file.name,
          file_size: file.size,
          entries_imported: 1,
          progress_percent: 100,
        };
      }
    } catch (error) {
      return {
        status: 'error',
        file_name: file.name,
        file_size: file.size,
        entries_imported: 0,
        error: error instanceof Error ? error.message : 'Import failed',
        progress_percent: 0,
      };
    }
  }

  /**
   * Setup provider API key
   */
  async setupTool(provider: string, apiKey: string): Promise<ToolSetupStatus> {
    const { getKeyManager } = await import('../key-manager');

    try {
      const manager = getKeyManager();
      await manager.saveKey(provider as any, apiKey);

      this.state.tools_configured = manager.getAllConfiguredProviders().length > 0;

      return {
        provider,
        configured: true,
        verified: true,
        models_available: [],
      };
    } catch (error) {
      return {
        provider,
        configured: false,
        verified: false,
        error: error instanceof Error ? error.message : 'Setup failed',
        models_available: [],
      };
    }
  }

  /**
   * Initialize second brain
   */
  async initializeBrain(): Promise<void> {
    const { getSecondBrainStore } = await import('../second-brain/store');
    const store = await getSecondBrainStore();
    await store.initialize();
    this.state.brain_initialized = true;
  }

  /**
   * Move to next step
   */
  moveToNextStep(): OnboardingStep {
    const steps: OnboardingStep[] = ['import', 'tools', 'brain', 'complete'];
    const currentIndex = steps.indexOf(this.state.current_step);

    if (currentIndex < steps.length - 1) {
      this.state.current_step = steps[currentIndex + 1];
      if (!this.state.completed_steps.includes(steps[currentIndex])) {
        this.state.completed_steps.push(steps[currentIndex]);
      }
    }

    return this.state.current_step;
  }

  /**
   * Get current state
   */
  getState(): OnboardingState {
    return { ...this.state };
  }

  /**
   * Complete onboarding
   */
  completeOnboarding(): void {
    this.state.current_step = 'complete';
    this.state.completed_steps = ['import', 'tools', 'brain'];
  }

  /**
   * Check if onboarding is complete
   */
  isComplete(): boolean {
    return this.state.current_step === 'complete';
  }

  /**
   * Can skip to next step?
   */
  canSkipStep(step: OnboardingStep): boolean {
    // Allow skipping import and tools, but not brain init
    return step !== 'brain';
  }
}

/**
 * Singleton instance
 */
let onboardingManager: OnboardingManager | null = null;

export function getOnboardingManager(): OnboardingManager {
  if (!onboardingManager) {
    onboardingManager = new OnboardingManager();
  }
  return onboardingManager;
}

export function resetOnboardingManager(): void {
  onboardingManager = null;
}
