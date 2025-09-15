import { useEffect, useMemo, useState } from "react";
import * as tf from "@tensorflow/tfjs";

/**
 * React hook to safely create and manage a TensorFlow.js tensor.
 * - Waits for tf.ready() before creating the tensor
 * - Ensures disposal on unmount or dependency changes
 *
 * @param factory - Function that returns a tf.Tensor
 * @param deps - Dependency array (like in useMemo)
 * @returns The tf.Tensor once ready, or null while waiting
 */
export default function useTensor<T extends tf.Tensor>(
  factory: () => T,
  deps: React.DependencyList
): T | null {
  const [ready, setReady] = useState(false);

  // Wait for tf.ready() once
  useEffect(() => {
    let mounted = true;
    tf.ready().then(() => {
      if (mounted) setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const tensor = useMemo(() => {
    if (!ready) return null;
    return factory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps]);

  useEffect(() => {
    return () => {
      tensor?.dispose();
    };
  }, [tensor]);

  return tensor;
}
