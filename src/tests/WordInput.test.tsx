import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import WordInput from "@/components/semantix/wordinput";

describe("WordInput Component", () => {
  it("error meldung sollte auftauchen, wenn keine buchstaben eingegeben werden", async () => {
    const onGuessMock = jest.fn();
    render(<WordInput onGuess={onGuessMock} />);

    const input = screen.getByPlaceholderText("Ein Wort eingeben");
    const form = input.closest("form");
    expect(form).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Test123" } });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText("Bitte nur Buchstaben verwenden.")
      ).toBeInTheDocument();
    });

    expect(onGuessMock).not.toHaveBeenCalled();
  });

  it("eingabe nur mit buchstaben, sollte form abschicken können", async () => {
    const onGuessMock = jest.fn();
    render(<WordInput onGuess={onGuessMock} />);

    const input = screen.getByPlaceholderText("Ein Wort eingeben");
    const form = input.closest("form");
    expect(form).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Test" } });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(onGuessMock).toHaveBeenCalledWith("test");
    });
  });
});
