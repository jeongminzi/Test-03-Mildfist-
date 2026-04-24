import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Chip } from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Atoms/Chip",
  component: Chip,
  args: { children: "👗 원피스" },
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Unselected: Story = { args: { selected: false } };
export const Selected: Story = { args: { selected: true } };

export const Group: Story = {
  render: () => {
    const Items = () => {
      const [picked, setPicked] = useState<string>("dress");
      const items = [
        { key: "top", label: "👕 상의" },
        { key: "dress", label: "👗 원피스" },
        { key: "pants", label: "👖 하의" },
        { key: "shoes", label: "👟 신발" },
      ];
      return (
        <div className="flex flex-wrap gap-2">
          {items.map((it) => (
            <Chip key={it.key} selected={picked === it.key} onClick={() => setPicked(it.key)}>
              {it.label}
            </Chip>
          ))}
        </div>
      );
    };
    return <Items />;
  },
};
