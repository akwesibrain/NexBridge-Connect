import { useEffect, useState } from "react";

// Demo helper: returns `true` briefly on mount so screens can show their
// loading skeletons before the mock data "arrives". Real screens would key
// this off an actual request's pending state.
export function useMockLoad(ms = 750) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
