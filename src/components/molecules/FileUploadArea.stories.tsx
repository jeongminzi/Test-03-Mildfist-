import type { Meta, StoryObj } from "@storybook/react";
import { FileUploadArea } from "./FileUploadArea";

const meta: Meta<typeof FileUploadArea> = {
  title: "Molecules/FileUploadArea",
  component: FileUploadArea,
  args: { hint: "JPG, PNG · 최대 10MB", onSelect: () => {} },
};
export default meta;

type Story = StoryObj<typeof FileUploadArea>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[480px]">
      <FileUploadArea {...args} />
    </div>
  ),
};
export const Disabled: Story = {
  render: (args) => (
    <div className="w-[480px]">
      <FileUploadArea {...args} disabled />
    </div>
  ),
};
