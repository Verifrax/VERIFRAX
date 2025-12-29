---- MODULE CineLintEngine ----
VARIABLES state
Init == state = "IDLE"
Next ==
  \/ state = "IDLE" /\ state' = "PLANNED"
  \/ state = "PLANNED" /\ state' = "RUNNING"
  \/ state = "RUNNING" /\ state' \in {"COMPLETED","FAILED"}
====
