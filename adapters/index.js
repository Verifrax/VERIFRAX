"use strict";

module.exports = {
  spdx: require("./sbom_spdx"),
  cyclonedx: require("./sbom_cyclonedx"),
  slsa: require("./provenance_slsa"),
  intoto: require("./attestation_intoto"),
  sigstore: require("./sigstore_verify"),
};
