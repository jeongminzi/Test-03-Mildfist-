import type { Meta, StoryObj } from "@storybook/react";
import { Label, HelpText, ErrorText } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Atoms/Label",
  component: Label,
  args: { children: "이메일", htmlFor: "email" },
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const WithHelpAndError: Story = {
  render: () => (
    <div className="space-y-1">
      <Label htmlFor="email" required>이메일</Label>
      <HelpText>로그인에 사용됩니다.</HelpText>
      <ErrorText>이메일 형식이 올바르지 않습니다.</ErrorText>
    </div>
  ),
};
