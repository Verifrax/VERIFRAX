export interface CineLintNode {
  id: string;
  execute(ctx: {
    artifactPath: string;
    metadata: Record<string, unknown>;
  }): Promise<any[]>;
}
