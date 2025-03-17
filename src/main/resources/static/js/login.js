// Sự kiện click vào biểu tượng mắt ở trang login
function togglePasswordVisibility(element) {
    // Thay đổi class 'open'
    element.classList.toggle('open');

    // Thay đổi class của phần tử i con
    let iconElement = element.querySelector('i');
    iconElement.classList.toggle('fa-eye-slash');
    iconElement.classList.toggle('fa-eye');

    // Thay đổi kiểu input của phần tử trước đó
    let inputElement = element.previousElementSibling;
    if (element.classList.contains('open')) {
        inputElement.setAttribute('type', 'text');
    } else {
        inputElement.setAttribute('type', 'password');
    }
}

// Kiểm tra xem người dùng đã chọn "Ghi nhớ đăng nhập" hay không
if (localStorage.getItem("rememberLogin") === "true") {
// Đổ dữ liệu đã lưu vào trường input username và password
    document.getElementById("username").value = localStorage.getItem("savedUsername");
    document.getElementById("password").value = localStorage.getItem("savedPassword");
}

function hideErrorMessage() {
    var errorMessageDiv = document.getElementById("error-message");
    errorMessageDiv.textContent = '';
}

function forgotPassword() {
    document.getElementById("form-login").style.display = 'none';
    document.getElementById("forgot-password").style.display = 'block';
}

function cancelForgotPassword() {
    document.getElementById("forgot-password").style.display = 'none';
    document.getElementById("form-login").style.display = 'block';
}
//////////////////////////reCaptcha//////////
var flagCaptcha = 0;
function enableSubmitButton() {
    flagCaptcha = 1;
    if (flagCaptcha === 1 && flagEmail === 1) {
        var submitButton = document.getElementById("submitSend");
        submitButton.classList.remove("disabled-link");
    }
}

var flagEmail = 1; //mặc định là 0 test 1
function selectUserByEmail(obj) {
    let endpoint = window.location.origin + "/api/orders";
    let email = obj.value;
    endpoint += "?email=" + email;
    var submitButton = document.getElementById("submitSend");
    submitButton.classList.remove("disabled-link");
    submitButton.classList.add("disabled-link");
    fetch(endpoint, {
        method: "GET"
    }).then(res => {
        if (res.status === 404) {
            document.getElementById("user-email").style.color = "yellow";
            document.getElementById("user-email").style.fontSize = "14px";
            document.getElementById("user-email").textContent = "Không tìm thấy tài khoản người dùng";
            return;
        }
        return res.json();
    }).then(users => {
        if (!users) {
            flagEmail = 0;
        } else {
            let userContainer = document.getElementById("user-email");
            userContainer.innerHTML = "";
            users.forEach(user => {
                const radioInput = document.createElement("input");
                radioInput.type = "radio";
                radioInput.name = "user";
                radioInput.value = user.id;
                radioInput.style.marginRight = "10px";

                const img = document.createElement("img");
                img.src = user.avatar;
                img.width = 20;
                img.height = 20;
                img.style.borderRadius = "50%";
                img.style.marginRight = "10px";
                radioInput.onclick = function () {
                    document.getElementById("selectedUserId").value = user.id;
                    flagEmail = 1;
                    if (flagCaptcha === 1 && flagEmail === 1) {
                        submitButton.classList.remove("disabled-link");
                    }
                };

                userContainer.appendChild(radioInput);
                userContainer.appendChild(img);

                const label = document.createElement("label");
                label.textContent = user.fullname;
                label.style.color = "yellow";
                label.style.fontSize = "14px";
                userContainer.appendChild(label);

                userContainer.appendChild(document.createElement("br"));
            });

            if (flagCaptcha === 1 && flagEmail === 1) {
                submitButton.classList.remove("disabled-link");
            }
        }
    });
}

async function handleSubmit(event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    // Kiểm tra nếu username và password không trống
    if (!username || !password) {
        document.getElementById('error-message').innerText = "Vui lòng nhập tên đăng nhập và mật khẩu!";
        return;  // Dừng lại nếu có trường hợp không hợp lệ
    }
    let loginRequest = {
        username: username,
        password: password
    };
    let endpoint = window.location.origin + "/public/login";
    // Gửi yêu cầu API với fetch
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginRequest) // Gửi dữ liệu dưới dạng JSON
    }).then(async res => {
        if (res.status === 200) {
            let data = await res.json();
            // Lưu token vào localStorage hoặc sessionStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('fullname', data.fullname);
            localStorage.setItem('roleId', data.role);
            localStorage.setItem('expire', data.expire);
            let cookie = "jwt=" + data.token + "; path=/; max-age=3600; secure; samesite=strict";
            console.log('Login thành công! Token:', data.token);
            // Gọi endpoint để thiết lập cookie HttpOnly
            let createCookie = window.location.origin + "/public/set-cookie";
            fetch(createCookie, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: data.token,
                    cookie: cookie
                })
            }).then(async cookieResponse => {
                if (cookieResponse.status === 200) {
                    // Chuyển hướng tới trang chính hoặc xử lý tiếp
                    if (data.role === 1 || data.role === 2 || data.role === 3){
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/";
                    }
                } else {
                    alert("Không thể thiết lập phiên đăng nhập!");
                }
            }).catch(error => {
                // Xử lý lỗi nếu có (ví dụ: lỗi kết nối mạng)
                document.getElementById('error-message').innerText = "Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn";
                console.error('Lỗi kết nối:', error);
            });
        } else if (res.status === 401) {
            // Xử lý nếu có lỗi (ví dụ: thông báo sai username/password)
            document.getElementById('error-message').innerText = "Tên đăng nhập hoặc mật khẩu không đúng";
            console.log('Đăng nhập thất bại');
        }
    }).catch(error => {
        // Xử lý lỗi nếu có (ví dụ: lỗi kết nối mạng)
        document.getElementById('error-message').innerText = "Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn";
        console.error('Lỗi kết nối:', error);
    });
}
