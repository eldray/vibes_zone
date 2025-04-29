import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Register from "../Register";
import api from "../../utils/api";
import { vi } from "vitest";

vi.mock("../../utils/api");

describe("Register Component", () => {
  const mockRegister = vi.fn();
  const mockNavigate = vi.fn();

  it("submits registration form successfully", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "fake-token",
        user: { username: "testuser", email: "test@example.com" },
      },
    });

    render(
      <AuthContext.Provider value={{ register: mockRegister }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "testuser",
        "test@example.com",
        "password123"
      );
    });
  });

  it("displays error on registration failure", async () => {
    api.post.mockRejectedValue({
      response: { data: { error: "Registration failed" } },
    });

    render(
      <AuthContext.Provider value={{ register: mockRegister }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(screen.getByText("Registration failed")).toBeInTheDocument();
    });
  });
});
