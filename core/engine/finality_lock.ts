/**
 * Verifier Verdict Lock
 * 
 * Rule: Once verdict is computed, no later stage may change it.
 * Enforce via assertion.
 * Panic on mutation attempt.
 * 
 * CRITICAL: Finality is scoped to ONE epistemic evaluation, not process lifetime.
 * Each verification must have its own lock instance.
 */
export class FinalityLock {
  private verdict: any | null = null;
  private locked: boolean = false;
  
  /**
   * Set verdict (first time only)
   */
  setVerdict(verdict: any): void {
    if (this.locked) {
      throw new Error('FINALITY_LOCK_VIOLATION: Attempted to change verdict after lock');
    }
    
    this.verdict = JSON.parse(JSON.stringify(verdict)); // Deep clone
    this.locked = true;
  }
  
  /**
   * Get verdict (read-only)
   */
  getVerdict(): any | null {
    return this.verdict ? JSON.parse(JSON.stringify(this.verdict)) : null; // Return clone
  }
  
  /**
   * Check if locked
   */
  isLocked(): boolean {
    return this.locked;
  }
  
  /**
   * Assert verdict is locked (panic if not)
   */
  assertLocked(): void {
    if (!this.locked) {
      throw new Error('FINALITY_LOCK_VIOLATION: Verdict not locked');
    }
  }
  
  /**
   * Attempt to mutate verdict (will panic)
   */
  mutateVerdict(mutator: (verdict: any) => void): never {
    this.assertLocked();
    
    // This should never execute if locked properly
    throw new Error('FINALITY_LOCK_VIOLATION: Attempted to mutate locked verdict');
  }
}

