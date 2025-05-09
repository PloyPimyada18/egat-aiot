import { BellOutlined } from "@ant-design/icons";
import { Badge, Popover, List } from "antd";
import { useState } from "react";

const NotificationIcon = () => {
  const [notificationCount] = useState(5);

  const notifications = [
    {
      title: "New Message",
      content: "You have received a new message from John",
      time: "2 minutes ago",
    },
    {
      title: "Task Update",
      content: "Your task 'Project Review' has been updated",
      time: "1 hour ago",
    },
    {
      title: "Meeting Reminder",
      content: "Team meeting starts in 30 minutes",
      time: "2 hours ago",
    },
    {
      title: "System Update",
      content: "System maintenance scheduled for tomorrow",
      time: "1 day ago",
    },
    {
      title: "New Feature",
      content: "New dashboard features are now available",
      time: "2 days ago",
    },
  ];

  const content = (
    <div style={{ width: 300 }}>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={
                <div>
                  <p style={{ margin: 0 }}>{item.content}</p>
                  <small style={{ color: "#999" }}>{item.time}</small>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Popover content={content} title="Notifications" trigger="click">
      <Badge count={notificationCount}>
        <BellOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
      </Badge>
    </Popover>
  );
};

export default NotificationIcon;
