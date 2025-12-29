import express from "express"
import { CineLintEngine } from "@verifrax/core"
import { resolveArtifact } from "@verifrax/core/src/artifacts/resolve"

const app = express()
app.use(express.json())

const engine = new CineLintEngine()

app.post("/run", async (req, res) => {
  const artifact = resolveArtifact(req.body.path)
  const result = await engine.run({
    artifact,
    profilePath: req.body.profile
  })
  res.json(result)
})

app.listen(3333)
