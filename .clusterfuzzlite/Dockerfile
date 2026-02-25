FROM gcr.io/oss-fuzz-base/base-builder-python:v1
COPY . $SRC/VERIFRAX
WORKDIR $SRC/VERIFRAX
# ClusterFuzzLite expects /src/build.sh for python projects
RUN ln -sf "$SRC/VERIFRAX/build.sh" /src/build.sh
