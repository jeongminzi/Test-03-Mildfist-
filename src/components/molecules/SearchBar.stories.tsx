import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Molecules/SearchBar",
  component: SearchBar,
  args: { placeholder: "스타일 검색..." },
};
export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <SearchBar {...args} />
    </div>
  ),
};
