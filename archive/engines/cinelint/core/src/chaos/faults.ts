export const maybeFail = (p = 0.01) => {
  if (Math.random() < p) throw new Error("Injected fault")
}
