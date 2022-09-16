export type ChecksResponse = {
  id: string;
  priority: number;
  description: string;
};

type ErrorObject = {
  success: false;
};

export function fetchChecks(): Promise<ChecksResponse[]> {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        Math.random() <= 0.8
          ? resolve([
              {
                id: "aaa",
                priority: 10,
                description: "Face on the picture matches face on the document",
              },
              {
                id: "bbb",
                priority: 5,
                description: "Veriff supports presented document",
              },
              {
                id: "ccc",
                priority: 7,
                description: "Face is clearly visible",
              },
              {
                id: "ddd",
                priority: 3,
                description: "Document data is clearly visible",
              },
            ])
          : reject({ success: false } as ErrorObject),
      500
    )
  );
}

export type Results = {
  checkId: string;
  result: string;
};

export function submitCheckResults(results: Results[]) {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        Math.random() <= 0.8 ? resolve(results) : reject({ success: false }),
      500
    )
  );
}
