import styled from "@emotion/styled";
import { onValue, ref } from "firebase/database";
import { useCallback, useEffect, useMemo, useState } from "react";

import Drawer from "./components/Drawer";
import { db } from "./lib/firebase";
import { makeFont } from "./lib/opentype";
import { Typo } from "./lib/typo";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  line-height: 1.6;
  font-size: 20px;
  font-family: "Montserrat", sans-serif;
  padding: 56px 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
`;

const Navigation = styled.nav``;

const Title = styled.h3`
  font-size: 28px;
  margin: 0;
`;

const Link = styled.a`
  color: #23ab99;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #999;
    text-decoration-color: #ccc;
  }
`;

const DrawerWrapper = styled.div`
  height: 120vh;
  display: flex;
  gap: 36px;
  transform: rotate(12deg);
  position: absolute;
  top: -10px;
  right: 90px;
`;

const DrawerLine = styled.div`
  width: 64px;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 20px;
`;

const DrawerItem = styled.div`
  width: 100%;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const Text = styled.div`
  display: block;
`;

const Sample = styled.div`
  line-height: 1.2;
  color: #777;
  font-size: 140px;
  margin-bottom: 24px;
`;

const SampleLine = styled.div`
  display: flex;
`;

const SampleItem = styled.div`
  width: 100px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const Display = () => {
  const [typos, setTypos] = useState<Record<string, Typo>>({});
  const [typo, setTypo] = useState<Typo>();

  const baseHue = 260;
  const sampleColor = "#666";

  const filledTypos = useMemo(() => {
    const values = Object.values(typos);
    if (values.length === 0) {
      return [];
    }
    return [...Array(Math.ceil(24 / values.length))]
      .flatMap(() => values)
      .slice(0, 24);
  }, [typos]);

  const downloadFont = useCallback(() => {
    if (typo) {
      makeFont(typo);
    }
  }, [typo]);

  useEffect(() => {
    // 新たなデータが追加された際の処理
    const typosRef = ref(db, "typos/");

    onValue(typosRef, (snapshot) => {
      setTypos((typos) => ({
        ...typos,
        ...(snapshot.val() as Record<string, Typo>),
      }));
    });
  }, []);

  return (
    <Wrapper>
      <Navigation>
        <Title>parametric-typography</Title>
        <Link href="/">Make your typography</Link>
      </Navigation>
      <DrawerWrapper>
        {[...Array(3)].map((_, lineI) => (
          <DrawerLine key={lineI}>
            {filledTypos
              .slice(8 * lineI, 8 * (lineI + 1))
              .map((typo, itemI) => (
                <DrawerItem key={itemI} onClick={() => setTypo(typo)}>
                  <Drawer
                    char="あ"
                    typo={typo}
                    color={`hsl(${
                      baseHue + (Math.random() - 0.5) * 100
                    }deg, 80%, 60%)`}
                  />
                </DrawerItem>
              ))}
          </DrawerLine>
        ))}
      </DrawerWrapper>
      <Text>
        <Sample>
          {typo && (
            <SampleLine>
              <SampleItem>
                <Drawer char="か" typo={typo} color={sampleColor} />
              </SampleItem>
              <SampleItem>
                <Drawer char="ん" typo={typo} color={sampleColor} />
              </SampleItem>
              <SampleItem>
                <Drawer char="ど" typo={typo} color={sampleColor} />
              </SampleItem>
              <SampleItem>
                <Drawer char="う" typo={typo} color={sampleColor} />
              </SampleItem>
            </SampleLine>
          )}
          きょうえん
        </Sample>
        2023/12/14 0:55 / 0.93, 0.12, 0.45
        <br />
        <Link href="#" onClick={downloadFont}>
          Download this font
        </Link>
      </Text>
    </Wrapper>
  );
};

export default Display;
