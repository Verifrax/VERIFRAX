"use strict";

function die(msg){ const e=new Error(msg); e.code="E_YAML"; throw e; }

function parseScalar(s){
  if (s === "true") return true;
  if (s === "false") return false;
  if (s === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  // quoted
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1,-1);
  // inline list: ["a","b"] or [a,b]
  if (s.startsWith("[") && s.endsWith("]")) {
    const inner = s.slice(1,-1).trim();
    if (!inner) return [];
    return inner.split(",").map(x=>parseScalar(x.trim()));
  }
  return s; // bare string
}

function parse(text){
  if (/\t/.test(text)) die("tabs not allowed");
  const lines = text.split(/\r?\n/).map(l=>l.replace(/#.*$/,"")).filter(l=>l.trim().length>0);
  let i=0;

  function indentOf(line){ return line.match(/^ */)[0].length; }

  function parseBlock(baseIndent){
    let obj = null;
    let arr = null;

    while (i < lines.length) {
      const line = lines[i];
      const ind = indentOf(line);
      if (ind < baseIndent) break;
      if (ind !== baseIndent) die("bad indent");

      const trimmed = line.trim();

      // array item
      if (trimmed.startsWith("- ")) {
        if (!arr) { arr=[]; if (obj) die("mix map+array"); }
        const rest = trimmed.slice(2).trim();
        i++;
        if (!rest) {
          arr.push(parseBlock(baseIndent+2));
        } else if (rest.includes(":")) {
          // inline map start: - k: v
          const [k, ...vv] = rest.split(":");
          const vstr = vv.join(":").trim();
          const entry = {};
          if (vstr) entry[k.trim()] = parseScalar(vstr);
          else entry[k.trim()] = parseBlock(baseIndent+4);
          // consume further indented pairs
          const saveI=i;
          if (i<lines.length && indentOf(lines[i])===baseIndent+2) {
            // next sibling array item, keep
          } else if (i<lines.length && indentOf(lines[i])===baseIndent+4) {
            // additional keys under this map
            const sub = parseBlock(baseIndent+4);
            if (sub && typeof sub === "object" && !Array.isArray(sub)) Object.assign(entry, sub);
          } else {
            // no more
          }
          arr.push(entry);
        } else {
          arr.push(parseScalar(rest));
        }
        continue;
      }

      // map entry
      const m = trimmed.match(/^([^:]+):(.*)$/);
      if (!m) die("expected key:");
      if (!obj) { obj={}; if (arr) die("mix array+map"); }
      const key = m[1].trim();
      const rest = m[2].trim();
      i++;
      if (!rest) obj[key] = parseBlock(baseIndent+2);
      else obj[key] = parseScalar(rest);
    }

    return arr || obj || {};
  }

  return parseBlock(0);
}

module.exports = { parse };
