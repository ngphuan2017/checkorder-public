function handleLogout() {
    let endpoint = window.location.origin + "/public/logout";
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        if (response.status === 200) {
            // Xóa token khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('fullname');
            localStorage.removeItem('roleId');
            localStorage.removeItem('expire');
            // Xóa cookie 'jwt'
            document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=strict; secure";
            // Chuyển hướng về trang login sau khi logout
            window.location.href = "/login";
        } else {
            console.error("Logout thất bại");
        }
    }).catch(error => {
        console.error("Lỗi khi logout:", error);
    });
}