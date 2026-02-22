import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "@/components/Input.vue";

describe("Input", () => {
  it("renders label and input with correct id", () => {
    const wrapper = mount(Input, {
      props: { label: "Battery", id: "battery" },
    });
    const label = wrapper.find("label");
    const input = wrapper.find("input");

    expect(label.text()).toBe("Battery");
    expect(label.attributes("for")).toBe("battery");
    expect(input.attributes("id")).toBe("battery");
  });

  it("emits update:modelValue with string for text input", async () => {
    const wrapper = mount(Input, {
      props: { label: "UUID", id: "uuid", type: "text" },
    });
    const input = wrapper.find("input");

    await input.setValue("hello");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual(["hello"]);
  });

  it("emits update:modelValue with number for number input", async () => {
    const wrapper = mount(Input, {
      props: { label: "Battery", id: "battery", type: "number" },
    });
    const input = wrapper.find("input");
    const inputEl = input.element as HTMLInputElement;

    // happy-dom may not populate valueAsNumber from setValue, so set it directly
    Object.defineProperty(inputEl, "valueAsNumber", {
      get: () => 42,
      configurable: true,
    });
    await input.trigger("input");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([42]);
  });

  it("renders append slot content", () => {
    const wrapper = mount(Input, {
      props: { label: "UUID", id: "uuid" },
      slots: { append: "<button>Generate</button>" },
    });
    expect(wrapper.find("button").text()).toBe("Generate");
  });

  it("emits empty string when number input has NaN value", async () => {
    const wrapper = mount(Input, {
      props: { label: "Battery", id: "battery", type: "number" },
    });
    const input = wrapper.find("input");
    const inputEl = input.element as HTMLInputElement;

    Object.defineProperty(inputEl, "valueAsNumber", {
      get: () => NaN,
      configurable: true,
    });
    await input.trigger("input");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([""]);
  });
});
