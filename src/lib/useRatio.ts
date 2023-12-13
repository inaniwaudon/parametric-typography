import { ref, set } from "firebase/database";
import { useCallback, useMemo, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import { db } from "./firebase";
import { Point3D, calculateMovingAverage, withinRange } from "./utils";

const WINDOW_SIZE = 10;

export const useRatio = (
  onSubmit: (x: number, y: number, z: number) => void
) => {
  const [supportsMotion, setSupportsMotion] = useState(false);
  const [state, setState] = useState<"move" | "stop" | "submitted">("move");
  const [uuid] = useState(uuidV4());

  // センサ類
  const [calculated, setCalculated] = useState<Point3D[]>([]);
  const [smoothed, setSmoothed] = useState<Point3D>({ x: 0, y: 0, z: 0 });
  const [gammaOrientation, setGammaOrientation] = useState(0);
  const [alternativeRatio, setAlternativeRatio] = useState<Point3D>({
    x: 0,
    y: 0,
    z: 0,
  });

  const ratio = useMemo(
    () =>
      supportsMotion
        ? {
            x: withinRange(Math.round(((smoothed.x + 5) / 10) * 50) / 50, 0, 1),
            y: withinRange(Math.round(((smoothed.y + 5) / 10) * 50) / 50, 0, 1),
            z: withinRange(
              Math.round(((gammaOrientation + 80) / 160) * 50) / 50,
              0,
              1.0
            ),
          }
        : alternativeRatio,
    [supportsMotion, smoothed, gammaOrientation, alternativeRatio]
  );

  // ref
  const stateRef = useRef<"move" | "stop" | "submitted">();
  const ratioRef = useRef<Point3D>();
  stateRef.current = state;
  ratioRef.current = ratio;

  const submit = useCallback(async () => {
    if (ratioRef.current) {
      await set(ref(db, `typos/${uuid}`), {
        ratio0: ratioRef.current.x,
        ratio1: ratioRef.current.y,
        ratio2: ratioRef.current.z,
        created_at: new Date().toISOString(),
      });
    }
  }, [uuid, ratioRef]);

  const onDeviceMotion = useCallback(
    async (e: DeviceMotionEvent) => {
      const x = e.accelerationIncludingGravity?.x ?? 0;
      const y = e.accelerationIncludingGravity?.y ?? 0;
      const z = e.accelerationIncludingGravity?.z ?? 0;

      const x0 = e.acceleration?.x ?? 0;
      const y0 = e.acceleration?.y ?? 0;
      const z0 = e.acceleration?.z ?? 0;

      if (stateRef.current === "move") {
        const tempSmoothed = calculateMovingAverage(
          calculated,
          { x, y, z },
          WINDOW_SIZE
        );
        setSmoothed(tempSmoothed);
        setCalculated([...calculated, tempSmoothed].slice(-WINDOW_SIZE));
      }

      if (stateRef.current === "stop") {
        // 振動を検知
        if (Math.max(Math.abs(x0), Math.abs(y0), Math.abs(z0)) > 8) {
          setState("submitted");
          onSubmit(x0, y0, z0);
          await submit();
        }
      }
    },
    [calculated, submit, onSubmit]
  );

  const onDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (stateRef.current === "move") {
      setGammaOrientation(e.gamma ?? 0);
    }
  }, []);

  const startMotion = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        (DeviceMotionEvent as any).requestPermission();
        window.addEventListener("devicemotion", onDeviceMotion, true);
        window.addEventListener("deviceorientation", onDeviceOrientation, true);
      }
      setSupportsMotion(enabled);
    },
    [onDeviceMotion, onDeviceOrientation]
  );

  const stop = (enabled: boolean) => {
    if (state === "move" && enabled) {
      setState("stop");
    }
    if (state === "stop" && !enabled) {
      setState("move");
    }
  };

  return {
    ratio,
    alternativeRatio,
    supportsMotion,
    startMotion,
    submit,
    stop,
    setAlternativeRatio,
  };
};
