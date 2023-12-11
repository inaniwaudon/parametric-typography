import { useCallback, useRef, useState } from "react";
import Drawer from "./Drawer";
import { Pos, calculateMovingAverage } from "./lib/utils";
import styled from "@emotion/styled";

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
  font-size: 32px;
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
  const [calculated, setCalculated] = useState<Pos[]>([]);
  const [tapped, setTapped] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [smoothed, setSmoothed] = useState<Pos>({ x: 0, y: 0, z: 0 });
  const [gammaOrientation, setGammaOrientation] = useState(0);

  const stoppedRef = useRef<boolean>();
  stoppedRef.current = stopped;

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
          alert("スマホを振っている");
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
    [calculated]
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
    } else {
      alert("非対応の端末です");
    }
    setTapped(true);
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

  const ratio0 = Math.round(((smoothed.x + 5) / 10) * 50) / 50;
  const ratio1 = Math.round(((smoothed.y + 5) / 10) * 50) / 50;
  const ratio2 = Math.round(((gammaOrientation + 80) / 160) * 50) / 50;

  return (
    <>
      <Wrapper onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Drawer ratio0={ratio0} ratio1={ratio1} ratio2={ratio2} />
      </Wrapper>
      <Overlay displays={!tapped} onClick={onClick}>
        Tap the screen!
      </Overlay>
    </>
  );
};

export default App;
