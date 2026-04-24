import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Atoms/Select",
  component: Select,
  argTypes: {
    inputSize: { control: "select", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

const Options = () => (
  <>
    <option value="latest">최신순</option>
    <option value="popular">인기순</option>
    <option value="liked">좋아요순</option>
  </>
);

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <Select defaultValue="latest" {...args}>
        <Options />
      </Select>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <Select inputSize="sm" defaultValue="latest"><Options /></Select>
      <Select inputSize="md" defaultValue="latest"><Options /></Select>
      <Select inputSize="lg" defaultValue="latest"><Options /></Select>
    </div>
  ),
};
