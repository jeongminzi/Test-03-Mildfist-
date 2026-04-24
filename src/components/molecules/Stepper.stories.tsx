import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Molecules/Stepper",
  component: Stepper,
  argTypes: {
    currentIndex: { control: { type: "number", min: 0, max: 2 } },
  },
  args: {
    steps: [
      { key: "upload", label: "사진 업로드" },
      { key: "items", label: "아이템 선택" },
      { key: "fit", label: "피팅" },
    ],
    currentIndex: 1,
  },
};
export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[480px]">
      <Stepper {...args} />
    </div>
  ),
};

export const FirstStep: Story = { args: { currentIndex: 0 } };
export const LastStep: Story = { args: { currentIndex: 2 } };
