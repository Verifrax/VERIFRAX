let published = false;

export const PUBLICATION_RECEIPT = ["FINALITY_PUBLISHED"] as const;
export type PublicationReceipt = typeof PUBLICATION_RECEIPT[number];

export const publishFinality = async (entry): Promise<PublicationReceipt> => {
  if (published) throw new Error("FINALITY_ALREADY_PUBLISHED");
  if (!entry) throw new Error("EMPTY_FINALITY_ENTRY");
  published = true;
  return "FINALITY_PUBLISHED";
};
