document.getElementById('password').setCustomValidity('null');

// Reset trạng thái khi nhấn "Xác minh"
function accessSecret() {
    let appElement = document.querySelector('.app');
    let loginCheckbox = document.getElementById('login');
    let cancelCheckbox = document.getElementById('cancel');

    // Khi "Xác minh" được chọn, tự động bỏ chọn "Quay lại"
    if (loginCheckbox.checked) {
        cancelCheckbox.checked = false; // Bỏ chọn "Quay lại"
        appElement.style.transform = 'scale(1)';
        appElement.style.transition = 'transform 1s ease-in-out';
    } else {
        appElement.style.transform = 'scale(0)';
        appElement.style.transition = 'transform 1s ease-in-out';
    }
}

// Reset trạng thái khi nhấn "Quay lại"
function cancelSecret() {
    let appElement = document.querySelector('.app');
    let cancelCheckbox = document.getElementById('cancel');
    let loginCheckbox = document.getElementById('login');

    // Khi "Quay lại" được chọn, tự động bỏ chọn "Xác minh"
    if (cancelCheckbox.checked) {
        loginCheckbox.checked = false; // Bỏ chọn "Xác minh"
        appElement.style.transform = 'scale(0)';
        appElement.style.transition = 'transform 1s ease-in-out';
    } else if (!loginCheckbox.checked) {
        // Nếu "Quay lại" không được chọn và "Xác minh" không được chọn
        appElement.style.transform = 'scale(0)';
        appElement.style.transition = 'transform 1s ease-in-out';
    }
}

// checkSecretKey
async function checkSecretKey() {
    let endpoint = window.location.origin + "/public/check-secret-key";
    let passwordInput = document.getElementById('password');
    let secretKey = passwordInput.value;
    fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            "data": {
                "secretKey": secretKey
            }
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async res => {
        if (res.status === 200) {
            let dataJson = await res.json();
            // Xử lý khi mã key hợp lệ
            passwordInput.setCustomValidity('');
            let orderInfo = document.getElementById('order-info');
            orderInfo.innerHTML = `
                <p><strong>Kích hoạt: </strong><span id="paid-date" class="format-datetime">${dataJson.paidDate}</span></p>
                <p><strong>Hết hạn: </strong><span id="end-date" class="format-datetime">${dataJson.endDate}</span></p>
                <p><strong>Trạng thái: </strong><span id="status">${dataJson.status === 1 ? '<span class="text-success-light">Kích hoạt</span>' : dataJson.status === 2 ? '<span class="text-warning-light">Hết lượt</span>' : dataJson.status === 3 ? '<span class="text-danger-light">Hết hạn</span>' : '<span class="text-danger-light">Chưa kích hoạt</span>'}</span></p>
                <p class="text-center">Còn <strong id="sum-2fa" class="text-danger-light">${2 - dataJson.sum2fa}</strong> lượt lấy mã trong hôm nay</p>`;
            //format date
            let formatDatetime = document.querySelectorAll(".format-datetime");
            formatDatetime.forEach((element) => {
                const dateValue = dayjs(element.textContent);
                // Định dạng HH:mm:ss DD-MM-YYYY
                element.textContent = dateValue.format('HH:mm:ss DD-MM-YYYY');
            });
        } else {
            // Xử lý khi mã key không hợp lệ
            passwordInput.setCustomValidity('Mã secret key không hợp lệ');
        }
    }).catch(error => {
        passwordInput.setCustomValidity('Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!');
    });
}

// call2fa
async function call2fa() {
    let endpoint = window.location.origin + "/public/secret-key/code-2fa";
    let buttonAuthenticationInput = document.getElementById('button-authentication');
    buttonAuthenticationInput.classList.add("d-none");
    let spinnerLoading = document.getElementById('spinner-loading');
    spinnerLoading.classList.remove("d-none");
    let passwordInput = document.getElementById('password');
    let secretKey = passwordInput.value;
    fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            "data": {
                "secretKey": secretKey
            }
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async res => {
        if (res.status === 200) {
            let dataJson = await res.json();
            let sum2fa = document.getElementById('sum-2fa');
            let status = document.getElementById('status');
            sum2fa.textContent = 2 - dataJson.data.sum2fa;
            status.innerHTML = `${dataJson.data.status === 1 ? '<span class="text-success-light">Kích hoạt</span>' : dataJson.data.status === 2 ? '<span class="text-warning-light">Hết lượt</span>' : dataJson.data.status === 3 ? '<span class="text-danger-light">Hết hạn</span>' : '<span class="text-danger-light">Chưa kích hoạt</span>'}`;
            Swal.fire({
                icon: "success",
                title: "Mã xác minh của bạn là",
                html: `<span class="m-2 text-danger">${dataJson.data.code2fa}</span><a class="copy-button"><i class="fa-regular fa-copy"></i></a><h5>Truy cập <a href="javascript:;">gian hàng</a> để xem các sản phẩm khác.</h5>`,
                imageUrl: "https://res.cloudinary.com/dkmug1913/image/upload/v1699388134/328241962_655855299628009_5274335886148343582_n_saagka.jpg",
                imageHeight: 200,
                footer: "Cảm ơn bạn đã sử dụng dịch vụ",
                didOpen: () => {
                    // Lấy chuỗi cần copy
                    const textToCopy = dataJson.data.code2fa;
                    // Cấu hình Clipboard.js
                    const clipboard = new ClipboardJS('.copy-button', {
                        text: () => textToCopy
                    });
                    // Xử lý sự kiện khi copy thành công
                    clipboard.on('success', (e) => {
                        e.clearSelection();
                        Swal.fire("Đã sao chép!", "", "success");
                    });
                    // Xử lý sự kiện khi copy thất bại
                    clipboard.on('error', () => {
                        Swal.fire("Sao chép thất bại. Hãy thử lại!", "", "error");
                    });
                }
            });
        } else if (res.status === 401) {
            Swal.fire('Thông báo!', 'Bạn đã lấy mã đủ 2 lần trong ngày. Hãy thử lại vào ngày mai!', 'info');
        } else if (res.status === 402) {
            Swal.fire('Thông báo!', 'Thời hạn sử dụng đơn hàng của quý khách đã kết thúc. Chúng tôi xin cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ. Kính chúc quý khách sức khỏe và thành công!', 'info');
        } else {
            Swal.fire('Cảnh báo!', 'Mã bí mật không hợp lệ!', 'warning');
        }
    }).catch(error => {
        Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
    }).finally(() => {
        // Ẩn spinner và hiển thị lại nút sau khi mọi thứ hoàn tất
        spinnerLoading.classList.add("d-none");
        buttonAuthenticationInput.classList.remove("d-none");
    });
}

// Hiển thị modal với ảnh
function showImage() {
    let modal = document.getElementById("image-modal");
    modal.classList.add("show"); // Thêm lớp show để áp dụng hiệu ứng mở modal
}

// Đóng modal
function closeImage() {
    let modal = document.getElementById("image-modal");
    modal.classList.remove("show"); // Xóa lớp show để ẩn modal
}

// Hiển thị modal với ảnh
function showError() {
    let modal = document.getElementById("error-modal");
    modal.classList.add("show"); // Thêm lớp show để áp dụng hiệu ứng mở modal
}

// Đóng modal
function closeError() {
    let modal = document.getElementById("error-modal");
    modal.classList.remove("show"); // Xóa lớp show để ẩn modal
}

// Đóng modal nếu người dùng click ra ngoài modal
window.onclick = function(event) {
    let modal = document.getElementById("image-modal");
    let error = document.getElementById("error-modal");
    if (event.target === modal) {
        modal.classList.remove("show"); // Đóng modal khi click bên ngoài
    }
    if (event.target === error) {
        error.classList.remove("show"); // Đóng modal khi click bên ngoài
    }
}
