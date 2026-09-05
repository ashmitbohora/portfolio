#!/usr/bin/env python3
"""Copy the private 100 Bites map into public/bohobites-map/ with the home pin scrubbed.

Source of truth: ~/SecondBrain/BohoBites/austin-100-bites-map.html (has Ashmit's home anchor).
Output:          public/bohobites-map/index.html (no home pin, no apartment address, no 'home' labels).

Run after every edit to the source map, then `npm run build` and deploy with
XDG_CONFIG_HOME=~/.wrangler-personal npx wrangler pages deploy dist --project-name=ashmitbohora
"""
import os, re, sys

SRC = os.path.expanduser("~/SecondBrain/BohoBites/austin-100-bites-map.html")
DST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "bohobites-map", "index.html")

s = open(SRC).read()
keys_before = s.count("walk_sparq")

# 1. drop the home marker (three chained lines starting at L.marker([ANCHORS.home...)
s = re.sub(r"\n  L\.marker\(\[ANCHORS\.home\.lat, ANCHORS\.home\.lng\].*?\.bindPopup\(`.*?`\);",
           "", s, count=1, flags=re.S)
# 2. strip the home anchor coords + address
s = re.sub(r"home:\s*\{[^}]*\},", 'home:  { name: "West Campus" },', s, count=1)
# 3. prose + labels
s = s.replace("${s.walk_sparq} min walk, ${s.walk_tower} from the Tower",
              "${s.walk_sparq} min walk from West Campus, ${s.walk_tower} from the Tower")
s = s.replace("right next to the dorm, only a few doors from 2502 Rio Grande.", "a few doors up Rio Grande.")
s = s.replace("Sparq on Rio (home)", "West Campus").replace("Sparq on Rio", "West Campus")
s = s.replace("Sparq, home", "West Campus")
s = re.sub(r"\bSparq\b", "West Campus", s)
s = s.replace(">home and Tower<", ">UT Tower<").replace(">From home<", ">From West Campus<")

# guards: data keys intact, nothing private left
assert s.count("walk_sparq") == keys_before, "walk_sparq keys changed"
for bad in ("Sparq", "2502", "ANCHORS.home.lat", "the dorm", "home and Tower", "From home"):
    assert bad not in s, f"private string still present: {bad}"

os.makedirs(os.path.dirname(DST), exist_ok=True)
open(DST, "w").write(s)
print(f"wrote {DST} ({len(s)} bytes), {keys_before} spots-with-walk keys kept")
