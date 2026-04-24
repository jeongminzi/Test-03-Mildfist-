import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { LikeButton } from "./LikeButton";

const meta: Meta<typeof LikeButton> = {
  title: "Molecules/LikeButton",
  component: LikeButton,
};
export default meta;

type Story = StoryObj<typeof LikeButton>;

export const Unliked: Story = { args: { liked: false, count: 0 } };
export const Liked: Story = { args: { liked: true, count: 12 } };
export const Toggle: Story = {
  render: () => {
    const Demo = () => {
      const [liked, setLiked] = useState(false);
      return <LikeButton liked={liked} count={liked ? 13 : 12} onClick={() => setLiked(!liked)} />;
    };
    return <Demo />;
  },
};
