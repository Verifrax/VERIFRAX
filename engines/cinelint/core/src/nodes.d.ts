declare module "@verifrax/nodes" {
  export interface CineLintNode {
    id: string;
    execute(ctx: {
      artifactPath: string;
      metadata: Record<string, unknown>;
    }): Promise<any[]>;
  }
}

declare module "@verifrax/nodes/src/abi/node.abi" {
  export interface CineLintNode {
    id: string;
    execute(ctx: {
      artifactPath: string;
      metadata: Record<string, unknown>;
    }): Promise<any[]>;
  }
}

declare module "@verifrax/nodes/src/abi/node.meta" {
  export interface NodeMeta {
    id: string;
    requires?: Record<string, unknown>;
  }
}

