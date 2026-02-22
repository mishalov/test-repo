import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "@/components/Button.vue";

describe("Button", () => {
  it("renders slot content", () => {
    const wrapper = mount(Button, { slots: { default: "Click me" } });
    expect(wrapper.text()).toBe("Click me");
  });

  it("applies variant class (primary by default, outline when specified)", () => {
    const primary = mount(Button);
    expect(primary.classes()).toContain("btn--primary");

    const outline = mount(Button, { props: { variant: "outline" } });
    expect(outline.classes()).toContain("btn--outline");
  });

  it("sets disabled attribute", () => {
    const wrapper = mount(Button, { props: { disabled: true } });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });
});
