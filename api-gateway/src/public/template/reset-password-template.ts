export const reset_password_template = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        h2 {
            margin-bottom: 20px;
            color: #333;
        }
        .form-group {
            margin-bottom: 15px;
            text-align: left;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .error {
            color: red;
            font-size: 14px;
            margin-top: 10px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Đặt lại mật khẩu</h2>
        <form id="resetPasswordForm" action="reset-password" method="POST">
            <div class="form-group">
                <label for="newPassword">Mật khẩu mới</label>
                <input type="password" id="newPassword" name="newPassword" required placeholder="Nhập mật khẩu mới">
            </div>
            <div class="form-group">
                <label for="confirmPassword">Xác nhận mật khẩu</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Xác nhận mật khẩu">
            </div>
            <input type="hidden" id="authToken" name="authToken"> <!-- Token ẩn -->
            <button type="submit">Xác nhận</button>
            <p class="error" id="errorMessage">Mật khẩu không khớp. Vui lòng thử lại.</p>
        </form>
    </div>

    <script>
        const form = document.getElementById('resetPasswordForm');
        const errorMessage = document.getElementById('errorMessage');

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const urlParams = new URLSearchParams(window.location.search);
            const authToken = urlParams.get('token'); // Lấy token từ URL
            if (newPassword !== confirmPassword) {
                errorMessage.style.display = 'block';
            } else {
                errorMessage.style.display = 'none';
                // Gửi dữ liệu đến server (cần xử lý backend)
                alert('Mật khẩu đã được cập nhật thành công!');
                form.submit(); // Gửi form nếu backend đã sẵn sàng
            }
        });
    </script>
</body>
</html>
`