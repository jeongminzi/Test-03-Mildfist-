import type { Meta, StoryObj } from "@storybook/react";
import { SectionTitle } from "./SectionTitle";

const meta: Meta<typeof SectionTitle> = {
  title: "Molecules/SectionTitle",
  component: SectionTitle,
  argTypes: {
    variant: { control: "select", options: ["captionAbove", "headingOnly", "headingWithSub"] },
    align: { control: "radio", options: ["start", "center"] },
  },
  args: {
    heading: "AI 패션 스타일 피드",
    subtext: "다양한 스타일을 탐색하고, AI 가상 피팅을 체험하세요",
    caption: "TODAY",
  },
};
export default meta;

type Story = StoryObj<typeof SectionTitle>;

export const HeadingWithSub: Story = { args: { variant: "headingWithSub", align: "center" } };
export const CaptionAbove: Story = { args: { variant: "captionAbove" } };
export const HeadingOnly: Story = { args: { variant: "headingOnly" } };
