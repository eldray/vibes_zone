import React, { useState, useEffect } from "react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications on component mount
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data || []);
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch notifications");
      }
    };

    fetchNotifications();

    // Socket.IO for real-time notifications
    const socket = initializeSocket(); // Assuming `initializeSocket` is globally available
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to mark notification as read");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔔 Notifications
      </h2>
      <div className="notifications-container">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications yet</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-item p-4 rounded-lg shadow-sm flex items-center justify-between ${
                  notif.read ? "bg-white" : "unread"
                }`}
              >
                <div className="flex items-center">
                  <img
                    src={
                      notif.userAvatar ||
                      "https://randomuser.me/api/portraits/women/22.jpg"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{notif.userUsername}</span>{" "}
                      {notif.type === "like" && "liked your post"}
                      {notif.type === "comment" && "commented on your post"}
                      {notif.type === "share" && "shared your post"}
                      {notif.type === "follow" && "followed you"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-pink-500 text-sm hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
