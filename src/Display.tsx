import styled from "@emotion/styled";
import { onValue, ref } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { MdSmartphone } from "react-icons/md";

import Sample from "./components/Display/Sample";
import Selection from "./components/Display/Selection";
import { db } from "./lib/firebase";
import { makeFont } from "./lib/opentype";
import { Typo } from "./lib/typo";
import { displayDateTime } from "./lib/utils";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  line-height: 1.8;
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

const LinkText = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Text = styled.div`
  width: ${140 * 5 + 10}px;
`;

const Time = styled.time`
  letter-spacing: 2px;
  display: block;
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

  const sampleColor = "#666";

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
        <Link href="/">
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
            <Sample typo={typos[selectedTypo]} color={sampleColor} />
            {displayDateTime(new Date(typos[selectedTypo].created_at))}
          </Time>
          <Link href="#" onClick={downloadFont}>
            <LinkText>
              <IoMdDownload />
              <div>Download this font</div>
            </LinkText>
          </Link>
        </Text>
      )}
    </Wrapper>
  );
};

export default Display;
