import { AbstractNode } from "../base/abstract.node"
import fs from "fs"

export class FileExistsNode extends AbstractNode {
  id = "file.exists"

  async execute(ctx: any) {
    return fs.existsSync(ctx.artifactPath)
      ? []
      : [{
          code: "FILE_MISSING",
          severity: "ERROR",
          message: "Artifact file does not exist"
        }]
  }
}
