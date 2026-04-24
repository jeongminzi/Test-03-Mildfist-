import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  argTypes: {
    inputSize: { control: "select", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { placeholder: "이메일을 입력하세요" },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, defaultValue: "잘못된 형식" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "수정 불가" } };

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
  ),
};
