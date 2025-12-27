import { Engine, RunInput, RunResult } from "../contracts/run.contract"
import { NodeRegistry } from "../runtime/registry"
import { Executor } from "../runtime/executor"

export class CineLintEngine implements Engine {
  private registry = new NodeRegistry()
  private executor = new Executor(this.registry)

  register(node: any) {
    this.registry.register(node)
  }

  async run(input: RunInput): Promise<RunResult> {
    return this.executor.execute(input)
  }
}
