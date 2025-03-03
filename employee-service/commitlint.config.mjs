export default {
  extends: ['@commitlint/config-conventional'],
  // rules: {
  //   'type-enum': [
  //     2, // Mức độ nghiêm ngặt: 2 (error), 1 (warning), 0 (tắt)
  //     'always', // Luôn áp dụng
  //     [
  //       'feat', // Tính năng mới
  //       'fix', // Sửa lỗi
  //       'docs', // Cập nhật tài liệu
  //       'style', // Định dạng code (không ảnh hưởng logic)
  //       'refactor', // Tái cấu trúc code
  //       'test', // Thêm hoặc sửa test
  //       'chore', // Công việc lặt vặt (cập nhật config, dependencies)
  //       'revert', // Hoàn tác commit
  //     ],
  //   ],
  //   'subject-case': [2, 'always', 'sentence-case'], // Tiêu đề phải viết hoa chữ cái đầu
  //   'header-max-length': [2, 'always', 72], // Giới hạn độ dài tiêu đề là 72 ký tự
};
