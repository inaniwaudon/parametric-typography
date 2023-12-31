import styled from "@emotion/styled";
import { useCallback, useState } from "react";

import Drawer from "./components/Drawer";
import Navigation from "./components/Controller/Navigation";
import { useRatio } from "./lib/useRatio";

const Wrapper = styled.div`
  width: 100dvw;
  height: 100dvh;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
`;

const DrawerWrapper = styled.div<{ ratio: number }>`
  width: 60%;
  max-height: 60%;
  display: flex;
  justify-content: center;
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

const Controller = () => {
  const [starts, setStarts] = useState(false);
  const [distance, setDistance] = useState(0);

  const onSubmit = () => {
    const easeInQuad = (x: number) => x * x;

    const loop = (x: number) => {
      const newValue = easeInQuad(x + 0.05);
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
          <Drawer
            char="あ"
            typo={typo}
            color={`hsl(${ratio.z * 360}deg, 80%, 60%)`}
          />
        </DrawerWrapper>
        {!supportsMotion && (
          <Navigation
            alternativeRatio={alternativeRatio}
            setAlternativeRatio={setAlternativeRatio}
            submit={() => {
              submit();
              onSubmit();
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

export default Controller;
