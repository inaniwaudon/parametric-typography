import styled from "@emotion/styled";
import { useCallback, useState } from "react";

import Drawer from "./components/Drawer";
import Navigation from "./components/Navigation";
import { useRatio } from "./lib/useRatio";

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

const DrawerWrapper = styled.div<{ ratio: number }>`
  width: 60%;
  opacity: ${({ ratio }) => 1.0 - ratio};
  filter: blur(${({ ratio }) => ratio * 20}px);
  transform: scale(${({ ratio }) => 1.0 + ratio * 3});
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

const Operator = () => {
  const [starts, setStarts] = useState(false);
  const [distance, setDistance] = useState(0);

  const onSubmit = (x: number, y: number, z: number) => {
    x;
    y;
    z;

    const easeInQuad = (x: number) => x * x;

    const loop = (x: number) => {
      const newValue = easeInQuad(x + 0.05);
      console.log(x + 0.1, newValue);
      setDistance(newValue);
      if (x + 0.1 < 1) {
        setTimeout(() => loop(x + 0.1), 20);
      }
    };
    loop(0);
  };

  const {
    ratio,
    alternativeRatio,
    supportsMotion,
    startMotion,
    submit,
    stop,
    setAlternativeRatio,
  } = useRatio(onSubmit);

  const onClick = useCallback(() => {
    startMotion(
      DeviceMotionEvent && (DeviceMotionEvent as any).requestPermission
    );
    setStarts(true);
  }, [startMotion]);

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    stop(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    stop(false);
  };

  const typo = {
    ratio0: ratio.x,
    ratio1: ratio.y,
    ratio2: ratio.z,
  };

  return (
    <>
      <Wrapper onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <DrawerWrapper ratio={distance}>
          <Drawer char="あ" typo={typo} hue={ratio.z * 360} />
        </DrawerWrapper>
        {!supportsMotion && (
          <Navigation
            alternativeRatio={alternativeRatio}
            setAlternativeRatio={setAlternativeRatio}
            submit={() => {
              submit();
              onSubmit(0, 0, 0);
            }}
          />
        )}
      </Wrapper>
      <Overlay displays={!starts} onClick={onClick}>
        Tap the screen
      </Overlay>
    </>
  );
};

export default Operator;
