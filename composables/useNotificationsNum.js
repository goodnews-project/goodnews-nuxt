const useNotificationsNum = () => {
  return useState('notificationsNum', () => {
    return { notifications: 0, direct_messages: 0, follow_requests: 0 };
  });
};

export default useNotificationsNum;
