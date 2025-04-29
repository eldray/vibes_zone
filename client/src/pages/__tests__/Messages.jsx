import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Messages from "../Messages";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

vi.mock("socket.io-client");

describe("Messages Component", () => {
  const mockUser = { username: "@testuser" };
  const mockSocket = {
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
  };

  beforeEach(() => {
    io.mockReturnValue(mockSocket);
  });

  it("sends and displays messages", async () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Messages />
      </AuthContext.Provider>
    );

    // Select a contact
    fireEvent.click(screen.getByText("@cryptoqueen"));

    // Send a message
    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello!" } });
    fireEvent.click(screen.getByRole("button", { name: /paper-plane/i }));

    // Verify optimistic update
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "message",
      expect.objectContaining({
        to: "@cryptoqueen",
        from: "@testuser",
        text: "Hello!",
      })
    );
  });

  it("displays received messages", async () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Messages />
      </AuthContext.Provider>
    );

    // Select a contact
    fireEvent.click(screen.getByText("@cryptoqueen"));

    // Simulate receiving a message
    const messageHandler = mockSocket.on.mock.calls.find(
      (call) => call[0] === "message"
    )[1];
    messageHandler({
      from: "cryptoqueen",
      text: "Hi there!",
      timestamp: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(screen.getByText("Hi there!")).toBeInTheDocument();
    });
  });
});
