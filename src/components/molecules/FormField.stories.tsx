import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField";
import { Input } from "../atoms/Input";

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <FormField id="email" label="이메일" required helpText="로그인에 사용됩니다.">
        <Input id="email" type="email" placeholder="email@example.com" />
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <FormField id="email" label="이메일" required errorText="이메일 형식이 올바르지 않습니다.">
        <Input id="email" defaultValue="잘못된형식" invalid />
      </FormField>
    </div>
  ),
};
