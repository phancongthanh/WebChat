import { ReactNode, useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";

export default function MessageContainer({
  length,
  onLoad,
  children,
}: {
  length: number;
  onLoad: () => boolean | Promise<boolean>;
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBottom, setIsBottom] = useState(true); // Biến để kiểm tra xem scroll có ở cuối không

  // Tải tin nhắn
  const loadMoreMessages = async () => {
    const element = containerRef.current;
    if (!element) return;
    // Lưu trữ khoảng cách từ bottom trước khi tải tin nhắn mới
    const oldDistanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    const hasMessages = await onLoad();
    if (hasMessages)
      // Tính toán vị trí mới của scrollTop sao cho khoảng cách từ bottom không thay đổi
      setTimeout(() => (element.scrollTop = element.scrollHeight - element.clientHeight - oldDistanceFromBottom), 100);
  };

  // Hàm để xử lý scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const scrollHeight = containerRef.current.scrollHeight;
    const clientHeight = containerRef.current.clientHeight;

    if (scrollTop === 0) {
      // Nếu scroll ở đầu, thực hiện load thêm tin nhắn
      loadMoreMessages();
    }

    // Sử dụng ngưỡng để xác định xem scroll có ở gần cuối hay không
    const threshold = 50; // Ngưỡng,có thể điều chỉnh giá trị này tùy ý
    setIsBottom(scrollHeight - scrollTop <= clientHeight + threshold);
  };

  // Kéo thanh scroll xuống cuối khi có thay đổi messages
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    // Nếu scroll ở cuối, tự động cuộn xuống khi có tin nhắn mới
    if (isBottom) {
      setTimeout(() => (element.scrollTop = element.scrollHeight), 100);
    }
  }, [length, isBottom]);

  // // Tự động kéo thanh scroll xuống cuối lúc mới mở
  // useEffect(() => {
  //   if (!messageListRef.current) return;
  //   messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  //   setIsBottom(true);
  // }, []);

  return (
    <Box className="bg-gray-300 flex-1 relative overflow-hidden h-0">
      <Box
        className="hover-scroll-bar scroll-smooth overflow-x-auto overflow-y-visible max-h-full h-full"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <Stack direction="column" gap={1} justifyContent="end" minHeight="100%" padding={2}>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
