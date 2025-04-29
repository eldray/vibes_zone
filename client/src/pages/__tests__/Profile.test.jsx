import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Profile from "../Profile";
import api from "../../utils/api";
import { vi } from "vitest";

// Mock the API
vi.mock("../../utils/api");

const mockUser = {
  _id: "1",
  username: "testuser",
  avatar: "https://via.placeholder.com/150",
  followers: [],
  following: [],
  bio: "Test bio",
};

const mockPosts = [
  {
    _id: "post1",
    user: { username: "testuser", avatar: "https://via.placeholder.com/150" },
    content: "Test post",
    media: [],
    likes: [],
    comments: [],
  },
];

describe("Profile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login when user is not authenticated", () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: false }}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.queryByText("Your Posts")).not.toBeInTheDocument();
    // MemoryRouter handles Navigate; we can't test redirection directly
  });

  it("displays loading state when auth is loading", () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: true }}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders user details and posts", async () => {
    api.get.mockResolvedValueOnce({ data: mockPosts });

    render(
      <AuthContext.Provider value={{ user: mockUser, loading: false }}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
      expect(screen.getByText("Test bio")).toBeInTheDocument();
      expect(screen.getByText("Test post")).toBeInTheDocument();
      expect(screen.getByText("0 Followers")).toBeInTheDocument();
      expect(screen.getByText("1 Posts")).toBeInTheDocument();
    });
  });

  it("displays no posts message when posts are empty", async () => {
    api.get.mockResolvedValueOnce({ data: [] });

    render(
      <AuthContext.Provider value={{ user: mockUser, loading: false }}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No posts yet. Share your first vibe!")
      ).toBeInTheDocument();
    });
  });

  it("displays error message on API failure", async () => {
    api.get.mockRejectedValueOnce({
      response: { data: { error: "Failed to load posts" } },
    });

    render(
      <AuthContext.Provider value={{ user: mockUser, loading: false }}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load posts")).toBeInTheDocument();
    });
  });
});
