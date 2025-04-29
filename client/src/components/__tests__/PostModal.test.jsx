import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostModal from "../PostModal";
import api from "../../utils/api";
import { vi } from "vitest";

// Mock the API
vi.mock("../../utils/api");

describe("PostModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnPostCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <PostModal
        isOpen={false}
        onClose={mockOnClose}
        onPostCreated={mockOnPostCreated}
      />
    );
    expect(screen.queryByText("Create a Post")).not.toBeInTheDocument();
  });

  it("renders modal when isOpen is true", () => {
    render(
      <PostModal
        isOpen={true}
        onClose={mockOnClose}
        onPostCreated={mockOnPostCreated}
      />
    );
    expect(screen.getByText("Create a Post")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("What's the vibe today?")
    ).toBeInTheDocument();
    expect(screen.getByText("Choose File")).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    render(
      <PostModal
        isOpen={true}
        onClose={mockOnClose}
        onPostCreated={mockOnPostCreated}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /times/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("updates form fields correctly", () => {
    render(
      <PostModal
        isOpen={true}
        onClose={mockOnClose}
        onPostCreated={mockOnPostCreated}
      />
    );
    const textarea = screen.getByPlaceholderText("What's the vibe today?");
    fireEvent.change(textarea, { target: { value: "Test post" } });
    expect(textarea).toHaveValue("Test post");
  });

  it("displays error for invalid media type", () => {
    render(
      <PostModal
        isOpen={true}
        onClose={mockOnClose}
        onPostCreated={mockOnPostCreated}
      />
    );
    const fileInput = screen.getByLabelText("Upload Image/Video");
    const file = new File(["text"], "test.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(
      screen.getByText("Please upload an image or video")
    ).toBeInTheDocument();
  });

  it("submits post without media successfully", async () => {
    api.post.mockResolvedValueOnce({ data: {} });
    render(
      <PostModal
        isOpen={true}
        onClose={mockOnClose}
        onPostCreated={mockOnPostCreated}
      />
    );
    const textarea = screen.getByPlaceholderText("What's the vibe today?");
    const submitButton = screen.getByText("Post");
    fireEvent.change(textarea, { target: { value: "Test post" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/posts", {
        content: "Test post",
        media: [],
      });
      expect(mockOnPostCreated).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("submits post with media successfully", async () => {
    api.post
      .mockResolvedValueOnce({
        data: { url: "https://cloudinary.com/test.jpg" },
      })
      .mockResolvedValueOnce({ data: {} });
    render(
      <PostModal
        isOpen={true}
        onClose={mockOnClose}
        onPostCreated={mockOnPostCreated}
      />
    );
    const textarea = screen.getByPlaceholderText("What's the vibe today?");
    const fileInput = screen.getByLabelText("Upload Image/Video");
    const submitButton = screen.getByText("Post");
    const file = new File(["image"], "test.jpg", { type: "image/jpeg" });

    fireEvent.change(textarea, { target: { value: "Test post" } });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/uploads", expect.any(FormData), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(api.post).toHaveBeenCalledWith("/posts", {
        content: "Test post",
        media: ["https://cloudinary.com/test.jpg"],
      });
      expect(mockOnPostCreated).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("displays error on submission failure", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { error: "Failed to create post" } },
    });
    render(
      <PostModal
        isOpen={true}
        onClose={mockOnClose}
        onPostCreated={mockOnPostCreated}
      />
    );
    const textarea = screen.getByPlaceholderText("What's the vibe today?");
    const submitButton = screen.getByText("Post");
    fireEvent.change(textarea, { target: { value: "Test post" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to create post")).toBeInTheDocument();
    });
  });
});
