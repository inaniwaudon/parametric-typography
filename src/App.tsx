import styled from "@emotion/styled";
import { useCallback, useRef, useState } from "react";
import { Point3D, calculateMovingAverage } from "./lib/utils";
import Drawer from "./Drawer";
import Navigation from "./Navigation";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
`;

const Overlay = styled.div<{ displays: boolean }>`
  width: 100vw;
  height: 100vh;
  line-height: 2;
  font-size: 32px;
  font-family: "Montserrat", sans-serif;
  background-color: rgba(255, 255, 255, 0.8);
  justify-content: center;
  align-items: center;
  display: ${({ displays }) => (displays ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;

const windowSize = 10;

const App = () => {
  const [starts, setStarts] = useState(false);
  const [supportsMotion, setSupportsMotion] = useState(false);
  const [stopped, setStopped] = useState(false);

  // 加速度センサ
  const [calculated, setCalculated] = useState<Point3D[]>([]);
  const [smoothed, setSmoothed] = useState<Point3D>({ x: 0, y: 0, z: 0 });
  const [gammaOrientation, setGammaOrientation] = useState(0);
  const [alternativeRatio, setAlternativeRatio] = useState<Point3D>({
    x: 0,
    y: 0,
    z: 0,
  });

  const stoppedRef = useRef<boolean>();
  stoppedRef.current = stopped;

  // 送信処理
  const submit = useCallback(() => {
    //
  }, []);

  const onDeviceMotion = useCallback(
    (e: DeviceMotionEvent) => {
      const x = e.accelerationIncludingGravity?.x ?? 0;
      const y = e.accelerationIncludingGravity?.y ?? 0;
      const z = e.accelerationIncludingGravity?.z ?? 0;

      const x0 = e.acceleration?.x ?? 0;
      const y0 = e.acceleration?.y ?? 0;
      const z0 = e.acceleration?.z ?? 0;

      // スマホを振っている
      if (stoppedRef.current) {
        if (Math.max(Math.abs(x0), Math.abs(y0), Math.abs(z0)) > 8) {
          submit();
        }
      } else {
        const tempSmoothed = calculateMovingAverage(
          calculated,
          { x, y, z },
          windowSize
        );
        setSmoothed(tempSmoothed);
        setCalculated([...calculated, tempSmoothed].slice(-windowSize));
      }
    },
    [calculated, submit]
  );

  const onDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
    setGammaOrientation(e.gamma ?? 0);
  }, []);

  // タップされたらセンサを起動する
  const onClick = useCallback(() => {
    if (DeviceMotionEvent && (DeviceMotionEvent as any).requestPermission) {
      (DeviceMotionEvent as any).requestPermission();
      window.addEventListener("devicemotion", onDeviceMotion, true);
      window.addEventListener("deviceorientation", onDeviceOrientation, true);
      setSupportsMotion(true);
    }
    // 非サポート環境ではナビゲーションを表示する
    else {
      setSupportsMotion(false);
    }
    setStarts(true);
  }, [onDeviceMotion, onDeviceOrientation]);

  // 一時的にタップしたらセンサの値を固定する
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setStopped(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setStopped(false);
  };

  const ratio = supportsMotion
    ? {
        x: Math.round(((smoothed.x + 5) / 10) * 50) / 50,
        y: Math.round(((smoothed.y + 5) / 10) * 50) / 50,
        z: Math.round(((gammaOrientation + 80) / 160) * 50) / 50,
      }
    : alternativeRatio;

  return (
    <>
      <Wrapper onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Drawer ratio0={ratio.x} ratio1={ratio.y} ratio2={ratio.z} />
        {!supportsMotion && (
          <Navigation
            alternativeRatio={alternativeRatio}
            setAlternativeRatio={setAlternativeRatio}
            submit={submit}
          />
        )}
      </Wrapper>
      <Overlay displays={!starts} onClick={onClick}>
        Tap the screen
      </Overlay>
    </>
  );
};

export default App;
