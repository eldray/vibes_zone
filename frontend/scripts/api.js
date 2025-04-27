const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  isFormData = false
) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const options = { method, headers };
  if (data) {
    options.body = isFormData ? data : JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return response.json();
}

// Auth
export async function register(email, username, password) {
  return apiRequest("/auth/register", "POST", { email, username, password });
}

export async function login(email, password) {
  return apiRequest("/auth/login", "POST", { email, password });
}

export async function getProfile() {
  return apiRequest("/auth/profile");
}

export async function updateProfile(username, bio, avatar) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("bio", bio);
  if (avatar) {
    formData.append("avatar", avatar);
  }
  return apiRequest("/auth/profile", "POST", formData, true);
}

// Posts
export async function createPost(content, hashtags, media) {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("hashtags", hashtags);
  if (media) {
    formData.append("media", media);
  }
  return apiRequest("/posts", "POST", formData, true);
}

export async function getPosts(page = 1, limit = 10) {
  return apiRequest(`/posts?page=${page}&limit=${limit}`);
}

// Reels
export async function createReel(description, hashtags, video) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("hashtags", hashtags);
  if (video) {
    formData.append("video", video);
  }
  return apiRequest("/reels", "POST", formData, true);
}

export async function getReels(page = 1, limit = 10) {
  return apiRequest(`/reels?page=${page}&limit=${limit}`);
}

// Stories
export async function createStory(media) {
  const formData = new FormData();
  if (media) {
    formData.append("media", media);
  }
  return apiRequest("/stories", "POST", formData, true);
}

export async function getStories() {
  return apiRequest("/stories");
}

// Messages
export async function sendMessage(receiverId, content) {
  return apiRequest("/messages", "POST", { receiverId, content });
}

export async function getMessages(receiverId) {
  return apiRequest(`/messages/${receiverId}`);
}

// Notifications
export async function getNotifications() {
  return apiRequest("/notifications");
}

// Hashtags
export async function getTrendingHashtags() {
  return apiRequest("/hashtags");
}

export async function getHashtagPosts(name) {
  return apiRequest(`/hashtags/${name}`);
}

// Users
export async function followUser(id) {
  return apiRequest(`/users/${id}/follow`, "POST");
}

export async function getRecommendedUsers() {
  return apiRequest("/users/recommended");
}
