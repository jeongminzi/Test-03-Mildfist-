import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Atoms/Icon",
  component: Icon,
  argTypes: {
    name: { control: "text" },
    size: { control: { type: "number", min: 12, max: 48 } },
    weight: { control: "select", options: [300, 400, 500, 600, 700] },
    filled: { control: "boolean" },
  },
  args: { name: "favorite", size: 24, weight: 400, filled: false },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const Filled: Story = { args: { filled: true } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4 text-text-neutral">
      <Icon name="favorite" size={16} />
      <Icon name="favorite" size={20} />
      <Icon name="favorite" size={24} />
      <Icon name="favorite" size={32} />
      <Icon name="favorite" size={40} />
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-text-neutral">
      <Icon name="favorite" weight={300} size={32} />
      <Icon name="favorite" weight={400} size={32} />
      <Icon name="favorite" weight={500} size={32} />
      <Icon name="favorite" weight={600} size={32} />
      <Icon name="favorite" weight={700} size={32} />
    </div>
  ),
};

export const CommonGlyphs: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 text-text-neutral">
      {[
        "search", "favorite", "close", "arrow_back", "arrow_forward", "menu",
        "person", "settings", "notifications", "logout", "add", "delete",
        "edit", "check", "visibility", "visibility_off", "image", "shopping_bag",
        "checkroom", "diamond", "content_cut", "directions_walk", "info", "warning",
      ].map((n) => (
        <div key={n} className="flex flex-col items-center gap-1 p-2">
          <Icon name={n} size={28} />
          <span className="text-[10px] font-mono text-text-neutral-muted">{n}</span>
        </div>
      ))}
    </div>
  ),
};
