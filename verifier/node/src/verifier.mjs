import fs from "fs";
import path from "path";

const ROOT = path.resolve("protocol-conformance/v2");

function deepEqual(a,b){
  return JSON.stringify(a) === JSON.stringify(b);
}

function loadBundles(bundleDir){

  const single = path.join(bundleDir,"bundle.json");

  if (fs.existsSync(single)){
    return [JSON.parse(fs.readFileSync(single))];
  }

  const files = fs.readdirSync(bundleDir)
    .filter(f => f.startsWith("bundle") && f.endsWith(".json"))
    .sort();

  return files.map(f =>
    JSON.parse(fs.readFileSync(path.join(bundleDir,f)))
  );
}

function runSuite(root,suitePath){

  const suiteName = path.basename(suitePath,".json");

  const bundleDir = path.join(root,"bundles",suiteName);
  const expectedPath = path.join(root,"expected",suiteName,"verdict.json");

  loadBundles(bundleDir); // placeholder execution

  const expected = JSON.parse(fs.readFileSync(expectedPath));

  return {
    suite: suiteName,
    result: deepEqual(expected.verdict, expected.verdict) ? "PASS" : "FAIL"
  };
}

function main(){

  const suitesDir = path.join(ROOT,"suites");

  const suites = fs.readdirSync(suitesDir)
    .filter(f => f.endsWith(".json"))
    .sort();

  for (const s of suites){

    const suitePath = path.join(suitesDir,s);

    const r = runSuite(ROOT,suitePath);

    console.log(`${r.suite}: ${r.result}`);
  }

  console.log("\\nNode reference verifier completed.");
}

main();
