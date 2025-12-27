package verifrax.engine
deny[msg] {
  input.zero_trust == true
  not input.all_nodes_signed
  msg := "unsigned nodes forbidden"
}
