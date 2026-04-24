import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Atoms/Textarea",
  component: Textarea,
  argTypes: { invalid: { control: "boolean" }, disabled: { control: "boolean" } },
  args: { placeholder: "신고 사유를 자세히 적어주세요." },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "10자 미만이라 유효하지 않습니다" },
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
};
