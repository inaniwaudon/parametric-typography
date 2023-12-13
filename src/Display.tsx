import styled from "@emotion/styled";
import { onValue, ref } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { MdClose, MdSmartphone } from "react-icons/md";

import Sample from "./components/Display/Sample";
import Selection from "./components/Display/Selection";
import { keyColor } from "./const/color";
import { db } from "./lib/firebase";
import { makeFont } from "./lib/opentype";
import { Typo } from "./lib/typo";
import { displayDateTime } from "./lib/utils";

const Wrapper = styled.div`
  width: 100vw;
  height: 100svh;
  line-height: 1.8;
  font-size: 20px;
  font-family: "Montserrat", sans-serif;
  padding: 0 80px 56px 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  @media (width < 600px) {
    padding: 0 40px 32px 40px;
  }
`;

const Navigation = styled.nav`
  text-shadow: 0 0 8px #fff, 0 0 16px #fff, 0 0 32px #fff;
  padding: 56px 0 32px 0;
  position: relative;
  z-index: 1;

  @media (width < 600px) {
    padding: 32px 0 24px 0;
  }
`;

const Title = styled.h3`
  line-height: 1.4;
  font-size: 28px;
  margin: 0;
`;

const Link = styled.a`
  color: ${keyColor};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #999;
    text-decoration-color: #ccc;
  }
`;

const LinkText = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Text = styled.div`
  width: ${140 * 5 + 10}px;
  text-shadow: 0 0 8px #fff, 0 0 16px #fff, 0 0 32px #fff;
  position: relative;
  z-index: 1;
`;

const Time = styled.time`
  letter-spacing: 2px;
  display: block;
`;

const Close = styled.div`
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #999;
  }
`;

export type FirebaseTypo = {
  created_at: string;
  new: boolean;
} & Typo;

const Display = () => {
  const [typos, setTypos] = useState<Record<string, FirebaseTypo>>({});
  const [selectedTypo, setSelectedTypo] = useState<string | null>(null);
  const typosRef = useRef<Record<string, FirebaseTypo>>({});
  typosRef.current = typos;

  const downloadFont = useCallback(() => {
    if (selectedTypo) {
      makeFont(typos[selectedTypo]);
    }
  }, [typos, selectedTypo]);

  useEffect(() => {
    // 新たなデータが追加された際の処理
    const dbTyposRef = ref(db, "typos/");

    onValue(dbTyposRef, (snapshot) => {
      const dict = snapshot.val() as Record<string, FirebaseTypo>;
      const isFirst = Object.values(typosRef.current).length === 0;
      for (const item in dict) {
        dict[item].new = !typosRef.current[item] && !isFirst;
      }
      setTypos((typos) => ({
        ...typos,
        ...dict,
      }));
    });
  }, []);

  return (
    <Wrapper>
      <Navigation>
        <Title>parametric-typography</Title>
        <Link href="/controller">
          <LinkText>
            <MdSmartphone />
            Make your typeface
          </LinkText>
        </Link>
      </Navigation>
      <Selection
        typos={typos}
        selectedTypo={selectedTypo}
        setSelectedTypo={setSelectedTypo}
      />
      {selectedTypo && (
        <Text id="abstract">
          <Time>
            <Sample typo={typos[selectedTypo]} />
            {displayDateTime(new Date(typos[selectedTypo].created_at))}
          </Time>
          <Link href="#" onClick={downloadFont}>
            <LinkText>
              <IoMdDownload />
              <div>Download this font</div>
            </LinkText>
          </Link>
          <Close>
            <MdClose onClick={() => setSelectedTypo(null)} />
          </Close>
        </Text>
      )}
    </Wrapper>
  );
};

export default Display;
