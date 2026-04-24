import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioGroup } from "./Radio";

const meta: Meta<typeof RadioGroup> = {
  title: "Atoms/RadioGroup",
  component: RadioGroup,
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [v, setV] = useState<"basic" | "pro" | "team">("basic");
      return (
        <RadioGroup
          value={v}
          onChange={setV}
          options={[
            { value: "basic", label: "Basic", description: "월 0원 · 기본 기능" },
            { value: "pro", label: "Pro", description: "월 9,900원 · 가상 피팅 무제한" },
            { value: "team", label: "Team", description: "별도 문의 · 팀 협업" },
          ]}
        />
      );
    };
    return <Demo />;
  },
};

export const ReportReason: Story = {
  render: () => {
    const Demo = () => {
      const [v, setV] = useState<string>("부적절한 이미지");
      return (
        <RadioGroup
          value={v}
          onChange={setV}
          options={[
            { value: "부적절한 이미지", label: "부적절한 이미지" },
            { value: "저작권 침해", label: "저작권 침해" },
            { value: "스팸/광고", label: "스팸/광고" },
            { value: "기타", label: "기타" },
          ]}
        />
      );
    };
    return <Demo />;
  },
};
