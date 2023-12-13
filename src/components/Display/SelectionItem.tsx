import styled from "@emotion/styled";
import Drawer from "../Drawer";
import { FirebaseTypo } from "../../Display";
import Revelation from "./Revelation";
import { useEffect, useState } from "react";

const Item = styled.div<{ selected: boolean }>`
  width: 64px;
  height: 64px;
  cursor: pointer;
  flex: 0;
  filter: ${({ selected }) => (selected ? "none" : "blur(12px)")};
  position: relative;
  transition: transform 0.2s ease, filter 0.4s ease-out;

  &:hover {
    transform: scale(1.2);
  }
`;

const DrawerWrapper = styled.div<{ size: number }>`
  transform: scale(${({ size }) => size});
  transition: transform 0.4s ease;
`;

interface SelectionItemProps {
  typo: FirebaseTypo;
  id: string;
  selectedTypo: string | null;
  setSelectedTypo: (value: string | null) => void;
}

const SelectionItem = ({
  typo,
  id,
  selectedTypo,
  setSelectedTypo,
}: SelectionItemProps) => {
  const [size, setSize] = useState(0);

  const baseHue = 210;
  const newHue = 340;
  const hue = baseHue + (Math.random() - 0.5) * 40;
  const color = `hsl(${typo.new ? newHue : hue}deg, 80%, 60%)`;

  useEffect(() => {
    if (typo.new) {
      setTimeout(() => setSize(1.0), 300);
    } else {
      setSize(1.0);
    }
  }, [typo.new]);

  return (
    <Item
      selected={!selectedTypo || id === selectedTypo}
      onClick={() => setSelectedTypo(id)}
    >
      {typo.new && <Revelation />}
      <DrawerWrapper size={size}>
        <Drawer char="あ" typo={typo} color={color} />
      </DrawerWrapper>
    </Item>
  );
};

export default SelectionItem;
