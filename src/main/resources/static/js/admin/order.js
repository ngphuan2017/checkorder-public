// Lấy thông tin từ localStorage
var token = localStorage.getItem('token');
var userId = localStorage.getItem('userId');
var fullname = localStorage.getItem('fullname');
var role = parseInt(localStorage.getItem('roleId'));
var expire = localStorage.getItem('expire');
// Biến toàn cục để lưu trạng thái hiện tại
var currentPage = 1;
var currentLimit = 25;
var currentSearch = '';
// Biến để theo dõi trạng thái animation
var animationInProgress = false;
var finalSecret = '';
var currentPosition = 0; // từ trái sang phải
var animationInterval = null;
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Hàm khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo quản lý đơn hàng
    initOrderManagement();
    randomSecret('add');
    // Thiết lập sự kiện một lần cho modal
    let cart = document.querySelector('.js-modal');
    let modalClose = document.querySelector('.js-modal-close');
    let modalContainer = document.querySelector('.js-modal-container');
    modalClose.addEventListener('click', hideProfile);
    cart.addEventListener('click', hideProfile);
    modalContainer.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    let cartss = document.querySelector('.js-modal-add');
    let modalCloseAdd = document.querySelector('.js-modal-close-add');
    let modalContainerAdd = document.querySelector('.js-modal-container-add');
    modalCloseAdd.addEventListener('click', hideAddProfile);
    cartss.addEventListener('click', hideAddProfile);
    modalContainerAdd.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    let carts = document.querySelector('.js-modal-edit');
    let modalCloses = document.querySelector('.js-modal-close-edit');
    let modalContainers = document.querySelector('.js-modal-container-edit');
    modalCloses.addEventListener('click', hideEditProfile);
    carts.addEventListener('click', hideEditProfile);
    modalContainers.addEventListener('click', function (event) {
        event.stopPropagation();
    });
});

// Hàm khởi tạo quản lý đơn hàng
function initOrderManagement() {
    // Lấy thông số trang từ URL
    let endpoint = window.location.origin + "/api/orders";
    let urlParams = new URLSearchParams(window.location.search);
    currentPage = parseInt(urlParams.get('page')) || 1;
    currentLimit = parseInt(urlParams.get('limit')) || 25;

    // Cập nhật giá trị select box limit
    let limitSelect = document.querySelector('.dataTables_length .form-select');
    limitSelect.value = currentLimit.toString();

    // Thêm sự kiện cho việc thay đổi limit
    limitSelect.addEventListener('change', function() {
        loadOrders(endpoint, 1, parseInt(this.value), currentSearch); // Reset về trang 1 khi thay đổi limit
    });

    // Thêm sự kiện cho ô tìm kiếm
    let searchInput = document.querySelector('.dataTables_filter .form-control');
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            currentSearch = this.value;
            loadOrders(endpoint, 1, currentLimit, currentSearch);
        }
    });

    // Load dữ liệu ban đầu
    loadOrders(endpoint, currentPage, currentLimit);
}

// Hàm để tải dữ liệu đơn hàng - có thể gọi từ bất kỳ đâu
function loadOrders(endpoint, page, limit, search = currentSearch) {
    let url = `${endpoint}?page=${page}&limit=${limit}`;
    // Lưu giá trị tìm kiếm hiện tại
    currentSearch = search;

    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Cập nhật URL browser mà không reload trang
            let newUrl = `${window.location.pathname}?page=${page}&limit=${limit}`;
            if (search) {
                newUrl += `&search=${encodeURIComponent(search)}`;
            }
            history.pushState({page, limit, search}, "", newUrl);

            // Cập nhật biến toàn cục
            currentPage = page;
            currentLimit = limit;

            renderOrderTable(data.content, data.pageable, data.totalElements, data.totalPages);
        })
        .catch(error => console.error('Error:', error));
}

// Hàm render bảng đơn hàng
function renderOrderTable(orders, pageable, totalElements, totalPages) {
    // Render bảng dữ liệu
    let tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = '';

    orders.forEach((o, index) => {
        // Tính STT dựa trên trang và limit
        let stt = (currentPage - 1) * currentLimit + index + 1;

        // Format dates
        let paidDate = o.paidDate ? dayjs(o.paidDate).format('DD-MM-YYYY') : 'N/A';
        let endDate = o.endDate ? dayjs(o.endDate).format('DD-MM-YYYY') : 'N/A';
        let updateDate = o.updateDate ? dayjs(o.updateDate).format('DD-MM-YYYY') : 'N/A';

        // Map status to text
        let statusText = getStatusText(o.status);

        let row = document.createElement('tr');
        row.innerHTML = `
            <td><a class="js-add-user" href="javascript:;" onclick="viewOrderDetail(${o.id})"><i class='fas fa-eye text-info'></i></a></td>
            <td>${stt}</td>
            <td class="text-user-name">${o.name}</td>
            <td>${paidDate}</td>
            <td>${endDate}</td>
            <td class="text-order-name">${o.secretKey}</td>
            <td>${o.accountId || 'N/A'}</td>
            <td id="order-status${o.status}">
              <span id="order-status-old${o.status}" class="text-customer-${o.status === 1 ? 'active' : o.status === 2 ? 'warning' : o.status === 3 ? 'danger' : 'primary'}">${statusText}</span>
              <select class="form-select d-none" id="order-status-new${o.id}" onchange="updateOrderStatus(${o.id})">
                <option value="1">Kích hoạt</option>
                <option value="2">Hết lượt</option>
                <option value="3">Hết hạn</option>
                <option value="0">Sẵn sàng</option>
              </select>
            </td>
            <td>${2 - o.sum2fa || 0}</td>
            <td>${updateDate}</td>
            <td>${o.updatedBy === 1 ? `<span class="badge bg-danger m-1 level-name-${o.id}" style="font-size: 11px;">Admin</span>`
            : o.updatedBy === 2 ? `<span class="badge bg-success m-1 level-name-${o.id}" style="font-size: 11px;">Manager</span>`
                : o.updatedBy === 3 ? `<span class="badge bg-primary m-1 level-name-${o.id}" style="font-size: 11px;">Sale</span>` : "N/A"}</td>
            <td>
                <a class="m-2" href="javascript:;" onclick="editOrder(${o.id})">
                    <i class="fas fa-edit text-primary"></i>
                </a>
                ${role === 1 ? `<a class="m-2" href="javascript:;" onclick="deleteOrder(${o.id})">
                    <i class='fas fa-trash text-danger'></i>
                </a>`
                : `<a class="m-2" href="javascript:;" onclick="permissionAccount()">
                    <i class='fas fa-trash text-danger'></i>
                </a>`}
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Cập nhật thông tin phân trang
    let infoElement = document.getElementById('dataTable_info');
    let startItem = orders.length > 0 ? (currentPage - 1) * currentLimit + 1 : 0;
    let endItem = Math.min(currentPage * currentLimit, totalElements);
    infoElement.textContent = `Hiển thị ${startItem} đến ${endItem} trong tổng số ${totalElements} đơn hàng`;

    // Render phân trang
    renderPagination(currentPage, totalPages);
}

// Hàm render phân trang
function renderPagination(currentPage, totalPages) {
    let endpoint = window.location.origin + "/api/orders";
    let paginationElement = document.querySelector('.pagination');
    paginationElement.innerHTML = '';

    // Nút Previous
    let prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    let prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = 'javascript:;';
    prevLink.textContent = '«';
    if (currentPage > 1) {
        prevLink.addEventListener('click', () => loadOrders(endpoint, currentPage - 1, currentLimit, currentSearch));
    }
    prevLi.appendChild(prevLink);
    paginationElement.appendChild(prevLi);

    // Tạo các nút số trang
    let maxPagesToShow = 5; // Số nút trang tối đa hiển thị
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Điều chỉnh lại startPage nếu endPage đã đạt giới hạn
    if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        let pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        let pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = 'javascript:;';
        pageLink.textContent = i;
        pageLink.addEventListener('click', () => loadOrders(endpoint, i, currentLimit, currentSearch));
        pageLi.appendChild(pageLink);
        paginationElement.appendChild(pageLi);
    }

    // Nút Next
    let nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    let nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = 'javascript:;';
    nextLink.textContent = '»';
    if (currentPage < totalPages) {
        nextLink.addEventListener('click', () => loadOrders(endpoint,currentPage + 1, currentLimit, currentSearch));
    }
    nextLi.appendChild(nextLink);
    paginationElement.appendChild(nextLi);
}

// Hàm chuyển đổi status code sang text
function getStatusText(status) {
    switch(status) {
        case 1: return 'Kích hoạt';
        case 2: return 'Hết lượt';
        case 3: return 'Hết hạn';
        default: return 'Sẵn sàng';
    }
}

// Hàm xem chi tiết đơn hàng
async function viewOrderDetail(orderId) {
    let origin = window.location.origin;
    try {
        hideProfile();
        let res = await fetch(`${origin}/api/orders/${orderId}`);
        if (res.status === 200) {
            let data = await res.json();
            let monthDiff = null;
            if (data.order.paidDate && data.order.endDate) {
                monthDiff = (dayjs(data.order.endDate).year() - dayjs(data.order.paidDate).year()) * 12 + (dayjs(data.order.endDate).month() - dayjs(data.order.paidDate).month());
            }
            let modalImg = document.getElementById("modal-account-img");
            modalImg.innerHTML = `
                <img src="${data.order.type === 1 ? 'https://res.cloudinary.com/dkmug1913/image/upload/v1741054452/WebApp/ChatGPT_Plus_vwg2mx.png' : 'https://res.cloudinary.com/dkmug1913/image/upload/v1741055026/WebApp/ea5908978ba947f3849eb19daa85c862_wgy2z0.jpg'}" alt="avatar">
                <div class="level level-${data.order.id}">${monthDiff} tháng</div>
            `;
            let paidDate = data.order.paidDate ? dayjs(data.order.paidDate).format('DD-MM-YYYY') : 'N/A';
            let endDate = data.order.endDate ? dayjs(data.order.endDate).format('DD-MM-YYYY') : 'N/A';
            let updateDate = data.order.updateDate ? dayjs(data.order.updateDate).format('DD-MM-YYYY') : 'N/A';
            let createdDate = data.order.createdDate ? dayjs(data.order.createdDate).format('DD-MM-YYYY') : 'N/A';
            let modalAbout  = document.getElementById("modal-account-about");
            modalAbout .innerHTML = `
                <span style="margin: 7px 0;">ID: #${data.order.id}</span>
                <span style="margin: 7px 0;">Khách hàng: <span class="text-info">${data.order.name}</span></span>
                <span style="margin: 7px 0;">Ngày kích hoạt: ${paidDate}</span>
                <span style="margin: 7px 0;">Ngày hết hạn: ${endDate}</span>
                <span style="margin: 7px 0;">Mã bí mật: ${data.order.secretKey} <a class="text-info" style="cursor: pointer;" onclick="clipboardCopy('${data.order.secretKey}')"><i class="fas fa-regular fa-copy"></i></a></span>
                <span style="margin: 7px 0;">Tài khoản liên kết: ${data.account.username}</span>
                <span style="margin: 7px 0;">Trạng thái: <span class="${data.order.status === 1 ? `text-customer-active` : data.order.status === 2 ? `text-customer-warning` : data.order.status === 3 ? `text-customer-danger` : 'text-customer-primary'}">${data.status.name}</span></span>
                <span style="margin: 7px 0;">Số lượt còn lại: <strong>${2 - data.order.sum2fa}</strong></span>
                <span style="margin: 7px 0;">Ngày truy cập: ${updateDate}</span>
                <span style="margin: 7px 0;">Người duyệt: ${data.role.permission === "ROLE_ADMIN" ? `<span class="badge bg-danger m-1 level-name-${data.order.id}" style="font-size: 11px;">${data.user.fullname}</span>`
                    : data.role.permission === "ROLE_MANAGER" ? `<span class="badge bg-success m-1 level-name-${data.order.id}" style="font-size: 11px;">${data.user.fullname}</span>`
                        : `<span class="badge bg-primary level-name-${data.order.id}" style="font-size: 11px;">${data.user.fullname}</span>`}</span>
                <span style="margin: 7px 0;">Loại tài khoản: ${data.masterData.name}</span>
                <span style="margin: 7px 0;" class="profile-exp"><span class="profile-exp-bar" style="width: 100%;">100%(1/1)</span></span>
            `;
            let modalTitle  = document.getElementById("modal-account-title");
            modalTitle.innerHTML = `
                <div class="text-account-title">
                    <i class="fas fa-crown" style="color: yellow;"></i>
                    <img class="rounded account-rank-img-${data.order.id}" src="https://res.cloudinary.com/dkmug1913/image/upload/v1709201059/WebApp/Rank/iron_abwewo.png" style="width: 60px; height: 60px;" alt="rank" />
                    <i class="fas fa-crown" style="color: yellow;"></i>
                </div>
            `;

            showProfile();
        } else {
            Swal.fire('Cảnh báo', 'Đơn hàng chưa có dữ liệu', 'warning');
        }
    } catch(error) {
        Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
    }
}

// Hàm thêm đơn hàng
async function addOrder() {
    let origin = window.location.origin;
    try {
        hideAddProfile();
        let res = await fetch(`${origin}/api/orders/master-data`);
        if (res.status === 200) {
            let data = await res.json();
            let js = document.getElementById("modal-account-img-add");
            js.innerHTML = `
                <div class="block-avatar">
                    <img id="img-preview" src="https://res.cloudinary.com/dkmug1913/image/upload/v1690819242/WebApp/Avatar/none_ibdmnr.png" alt="avatar">
                    <a style="cursor: pointer;" onclick="AvatarBrowse()"><span class="icon-camera-avatar"><i class="fas fa-camera"></i></span></a>
                    <input type="file" id="avatarBrowse" onchange="showPreviewDiv(event);" accept="image/*" class="form-input d-none" />
                </div>
                <div style="margin: 5px 0;">
                    <div class="level level-0">1 tháng</div>
                </div>
            `;
            let jss = document.getElementById("modal-account-about-add");
            jss.innerHTML = `
                <span style="margin: 7px 0;"></span>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Khách hàng: </span><input id="add-name" type="text" class="form-control" placeholder="Nhập tên khách hàng..." /></div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Phân loại: </span>
                    <select id="add-type" class="form-select">
                    
                    </select>
                </div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Mã bí mật: </span><strong id="add-random" class="form-control"></strong></div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Tài khoản liên kết: </span>
                    <select id="add-account" class="form-select">
                    
                    </select>
                </div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Trạng thái: </span>
                    <select id="add-status" class="form-select">
                    
                    </select>
                </div>
            `;
            let types = document.getElementById("add-type");
            let optionType = `<option value="">Không xác định</option>`;
            for (let c of data.masterData) {
                optionType += `
                    <option value="${c.code}">${c.name}</option>
                `;
            }
            types.innerHTML = optionType;
            let accounts = document.getElementById("add-account");
            let optionAccount = `<option value="">Không xác định</option>`;
            for (let p of data.accounts) {
                let endDate = p.endDate ? dayjs(p.endDate).format('DD-MM-YYYY') : 'N/A';
                optionAccount += `
                    <option value="${p.id}">${p.username} - ${endDate} (${data.countOrder["count" + p.id]})</option>
                `;
            }
            accounts.innerHTML = optionAccount;
            let status = document.getElementById("add-status");
            let optionStatus = "";
            for (let s of data.status) {
                optionStatus += `
                    <option value="${s.statusId}">${s.name}</option>
                `;
            }
            status.innerHTML = optionStatus;
            randomSecret('add');
            showAddProfile();
        } else {
            Swal.fire('Cảnh báo', 'Đơn hàng chưa có dữ liệu', 'warning');
        }
    } catch(error) {
        Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
    }
}

function saveAddOrder() {
    let origin = window.location.origin;
    let name = document.getElementById("add-name").value;
    let type = document.getElementById("add-type").selectedOptions[0].value;
    let secretKey = document.getElementById("add-secret").textContent;
    let accountId = document.getElementById("add-account").selectedOptions[0].value;
    let status = document.getElementById("add-status").selectedOptions[0].value;
    fetch(`${origin}/api/orders/add`, {
        method: "POST",
        body: JSON.stringify({
            "data": {
                "name": name,
                "type": type,
                "secretKey": secretKey,
                "accountId": accountId,
                "status": status,
                "endDate": null,
                "sum2fa": null,
                "userId": userId
            }
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.status === 200) {
            hideAddProfile();
            initOrderManagement();
            Swal.fire('Thêm thành công!', 'Dữ liệu sẽ mất chút thời gian để thay đổi!', 'success');
        } else {
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
        }
    });
}

async function editOrder(orderId) {
    try {
        hideEditProfile();
        let origin = window.location.origin;
        let res = await fetch(`${origin}/api/orders/${orderId}`);
        let result = await fetch(`${origin}/api/orders/master-data`);
        if (res.status === 200 && result.status === 200) {
            let data = await res.json();
            let dataMaster = await result.json();
            let monthDiff = null;
            if (data.order.paidDate && data.order.endDate) {
                monthDiff = (dayjs(data.order.endDate).year() - dayjs(data.order.paidDate).year()) * 12 + (dayjs(data.order.endDate).month() - dayjs(data.order.paidDate).month());
            }
            let js = document.getElementById("modal-account-img-edit");
            js.innerHTML = `
                <div class="block-avatar">
                    <img id="img-preview" src="https://res.cloudinary.com/dkmug1913/image/upload/v1690819242/WebApp/Avatar/none_ibdmnr.png" alt="avatar">
                    <a style="cursor: pointer;" onclick="AvatarBrowse()"><span class="icon-camera-avatar"><i class="fas fa-camera"></i></span></a>
                    <input type="file" id="avatarBrowse" onchange="showPreviewDiv(event);" accept="image/*" class="form-input d-none" />
                </div>
                <div style="margin: 5px 0;">
                    <div class="level level-0">${monthDiff} tháng</div>
                </div>
            `;
            let jss = document.getElementById("modal-account-about-edit");
            jss.innerHTML = `
                <span style="margin: 7px 0;"></span>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Khách hàng: </span><input id="edit-name" type="text" class="form-control" value="${data.order.name}" /></div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Phân loại: </span>
                    <select id="edit-type" class="form-select">
                    
                    </select>
                </div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Mã bí mật: </span>
                    <strong id="edit-random" class="form-control">
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                            <span id="edit-secret" class="secret-text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1;">${data.order.secretKey}</span>
                            <div style="display: flex; align-items: center; margin-left: 10px; white-space: nowrap;">
                                <a class="text-info" style="cursor: pointer; margin-right: 10px;" onclick="refreshSecret('edit')"><i class="text-secondary fas fa-sync-alt"></i></a>
                                <a class="text-info" style="cursor: pointer;" onclick="clipboardCopy('${data.order.secretKey}')"><i class="fas fa-regular fa-copy"></i></a>
                            </div>
                        </div>
                    </strong>
                </div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Tài khoản liên kết: </span>
                    <select id="edit-account" class="form-select">
                    
                    </select>
                </div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Trạng thái: </span>
                    <select id="edit-status" class="form-select">
                    
                    </select>
                </div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Ngày hết hạn: </span><input id="edit-end-date" type="datetime-local" class="form-control" value="${data.order.endDate ? dayjs(data.order.endDate).format('YYYY-MM-DDTHH:mm') : ''}" /></div>
                <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Số lượt còn lại: </span>
                    <select id="edit-sum2fa" class="form-select">
                        <option value="2" ${(2 - data.order.sum2fa) === 0 ? 'selected' : ''}>0</option>
                        <option value="1" ${(2 - data.order.sum2fa) === 1 ? 'selected' : ''}>1</option>
                        <option value="0" ${(2 - data.order.sum2fa) === 2 ? 'selected' : ''}>2</option>
                    </select>
                </div>
            `;
            let types = document.getElementById("edit-type");
            let optionType = `<option value="" ${data.order.type === '' ? 'selected' : ''}>Không xác định</option>`;
            for (let c of dataMaster.masterData) {
                optionType += `
                    <option value="${c.code}" ${data.order.type === c.code ? 'selected' : ''}>${c.name}</option>
                `;
            }
            types.innerHTML = optionType;
            let accounts = document.getElementById("edit-account");
            let optionAccount = `<option value="" ${data.order.accountId === '' ? 'selected' : ''}>Không xác định</option>`;
            for (let p of dataMaster.accounts) {
                let endDate = p.endDate ? dayjs(p.endDate).format('DD-MM-YYYY') : 'N/A';
                optionAccount += `
                    <option value="${p.id}" ${data.order.accountId === p.id ? 'selected' : ''}>${p.username} - ${endDate} (${dataMaster.countOrder["count" + p.id]})</option>
                `;
            }
            accounts.innerHTML = optionAccount;
            let status = document.getElementById("edit-status");
            let optionStatus = "";
            for (let s of dataMaster.status) {
                optionStatus += `
                    <option value="${s.statusId}" ${data.order.status === s.statusId ? 'selected' : ''}>${s.name}</option>
                `;
            }
            status.innerHTML = optionStatus;
            let buttonGroup = document.getElementById("change-profile-account");
            let optionButton = `
                <button type="button" class="m-1 btn btn-outline-success" onclick="saveEditOrder(${orderId})">Lưu</button>
                <button type="button" class="m-1 btn btn-outline-danger" onclick="hideEditProfile()">Trở lại</button>
            `;
            buttonGroup.innerHTML = optionButton;
            showEditProfile();
        } else {
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
        }
    } catch(error) {
        Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
    }
}

function saveEditOrder(orderId) {
    let origin = window.location.origin;
    let name = document.getElementById("edit-name").value;
    let type = document.getElementById("edit-type").selectedOptions[0].value;
    let secretKey = document.getElementById("edit-secret").textContent;
    let accountId = document.getElementById("edit-account").selectedOptions[0].value;
    let status = document.getElementById("edit-status").selectedOptions[0].value;
    let endDate = document.getElementById("edit-end-date").value;
    let sum2fa = document.getElementById("edit-sum2fa").selectedOptions[0].value;
    fetch(`${origin}/api/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({
            "data": {
                "name": name,
                "type": type,
                "secretKey": secretKey,
                "accountId": accountId,
                "status": status,
                "endDate": endDate ? dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss[Z]') : endDate,
                "sum2fa": sum2fa,
                "userId": userId
            }
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.status === 200) {
            hideEditProfile();
            initOrderManagement();
            Swal.fire('Cập nhật thành công!', 'Dữ liệu sẽ mất chút thời gian để thay đổi!', 'success');
        } else {
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
        }
    });
}

function deleteOrder(orderId) {
    Swal.fire({
        title: 'Hủy đơn',
        text: 'Bạn có chắc chắn muốn hủy đơn hàng này ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
            let origin = window.location.origin;
            fetch(`${origin}/api/orders/${orderId}`, {
                method: "DELETE"
            }).then(res => {
                if (res.status === 204) {
                    initOrderManagement();
                    Swal.fire('Hủy thành công!', 'Đơn hàng này đã được hủy!', 'success');
                } else {
                    Swal.fire('Hủy không thành công!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
                }
            });
        }
    });
}

function updateOrderStatus(id) {
    let select = document.getElementById(`order-status-new${id}`);
    let newStatus = select.value;
    // Gọi API cập nhật trạng thái
    console.log('Update order status:', id, 'New status:', newStatus);
}

// Hàm khởi tạo clipboard
function clipboardCopy(copy) {
    navigator.clipboard.writeText(copy)
        .then(function() {
            Swal.fire("Đã sao chép!", "", "success");
        })
        .catch(function() {
            Swal.fire("Sao chép thất bại. Hãy thử lại!", "", "error");
        });
}

// Hàm tạo ngẫu nhiên 32 ký tự
function generateRandomSecret(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const cryptoObj = window.crypto || window.msCrypto;
    const randomValues = new Uint32Array(length);

    cryptoObj.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += chars.charAt(randomValues[i] % chars.length);
    }

    return result;
}

// Hàm làm mới mã bí mật
function refreshSecret(modal) {
    // Xóa interval cũ nếu còn tồn tại
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    if (animationInProgress) return; // Ngăn chặn nhiều lần click trong quá trình animation

    animationInProgress = true;
    finalSecret = generateRandomSecret(); // Tạo secret cuối cùng
    currentPosition = 0; // Bắt đầu từ ký tự đầu tiên

    // Bắt đầu animation
    animationInterval = setInterval(() => {
        // Hiển thị hiệu ứng
        displayAnimatedSecret(modal);

        // Dừng animation sau khi đã hoàn thành tất cả ký tự
        if (currentPosition >= finalSecret.length) {
            clearInterval(animationInterval);
            animationInterval = null; // Reset biến interval
            displayFinalSecret(modal);
            animationInProgress = false; // Reset trạng thái để có thể bấm lại
        }
    }, 30);
}

// Hiển thị các ký tự ngẫu nhiên trong quá trình animation
function displayAnimatedSecret(modal) {
    let textSecret = document.getElementById(`${modal}-random`);
    if (!textSecret) return;
    // Kết hợp các ký tự từ chuỗi cuối cùng và chuỗi tạm thời
    let animatedSecret = '';
    for (let i = 0; i < finalSecret.length; i++) {
        // Tăng dần số ký tự giữ nguyên từ chuỗi cuối cùng
        if (i < currentPosition) {
            // Các ký tự đã hoàn thành hiệu ứng
            animatedSecret += finalSecret[i];
        } else if (i === currentPosition) {
            // Ký tự đang chạy hiệu ứng - hiển thị ngẫu nhiên
            const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
            animatedSecret += randomChar;
        } else {
            // Các ký tự chưa bắt đầu hiệu ứng - hiển thị ngẫu nhiên
            const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
            animatedSecret += randomChar;
        }
    }

    // Cập nhật vị trí hiện tại cho lần tiếp theo
    currentPosition++;

    // Hiển thị chuỗi animation
    textSecret.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span id="add-secret" class="secret-text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1;">${animatedSecret}</span>
            <div style="display: flex; align-items: center; margin-left: 10px; white-space: nowrap;">
                <a class="text-info" style="cursor: pointer; margin-right: 10px;" onclick="refreshSecret('${modal}')"><i class="text-secondary fas fa-sync-alt"></i></a>
                <a class="text-info" style="cursor: pointer;"><i class="fas fa-regular fa-copy"></i></a>
            </div>
        </div>
    `;
}

// Hiển thị kết quả cuối cùng
function displayFinalSecret(modal) {
    let textSecret = document.getElementById(`${modal}-random`);
    if (!textSecret) return;

    textSecret.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span id="add-secret" class="secret-text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1;">${finalSecret}</span>
            <div style="display: flex; align-items: center; margin-left: 10px; white-space: nowrap;">
                <a class="text-info" style="cursor: pointer; margin-right: 10px;" onclick="refreshSecret('${modal}')"><i class="text-secondary fas fa-sync-alt"></i></a>
                <a class="text-info" style="cursor: pointer;" onclick="clipboardCopy('${finalSecret}')"><i class="fas fa-regular fa-copy"></i></a>
            </div>
        </div>
    `;
}

// Hàm hiển thị mã bí mật và thiết lập chức năng
function randomSecret(modal) {
    finalSecret = generateRandomSecret();
    displayFinalSecret(modal);
}
