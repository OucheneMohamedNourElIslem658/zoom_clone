import React, { useEffect, useState } from "react";

type PromiseBuilderProps<T> = {
  promise: () => Promise<T>; // function returning a Promise
  builder: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
};

export function PromiseBuilder<T>({ promise, builder }: PromiseBuilderProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    promise()
      .then((result) => {
        if (isMounted) {
          setData(result);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [promise]);

  return <>{builder(data, loading, error)}</>;
}
