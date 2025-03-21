document.addEventListener('DOMContentLoaded', () => {
    // Lấy thông tin từ localStorage
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    let fullname = localStorage.getItem('fullname');
    let role = parseInt(localStorage.getItem('roleId'));
    let expire = localStorage.getItem('expire');
    let userFullname = document.getElementById("user-fullname");
    userFullname.textContent = fullname;

    let currencyElementss = document.querySelectorAll(".currency .money");
    currencyElementss.forEach((element) => {
        const amountValue = parseFloat(element.textContent);
        element.textContent = numberWithCommas(amountValue);
    });

    //format date
    let createDate = document.querySelectorAll(".create-date");
    createDate.forEach((element) => {
        const dateValue = dayjs(element.textContent);
        element.textContent = dateValue.format('DD-MM-YYYY');
    });
});

function permissionAccount() {
    Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Tài khoản của bạn không có quyền này!"
    });
}

//format price  //
function numberWithCommas(x) {
    return parseFloat(x).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",").toString();
}

function accountView(endpoint, leveled) {
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    }).then(res =>
        res.text()
    ).then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'application/xml');
        const json = xmlToJson(xml);
        let js = document.getElementById("modal-account-img");
        js.innerHTML = `
            <img src="${json.users.avatar}" alt="avatar">
            <div class="level level-${json.users.id}">
            </div>
        `;
        let required = document.querySelector(`.required-exp-${json.users.id}`);
        let jss = document.getElementById("modal-account-about");
        let requiredExp = json.users.exp >= 12800 ? 99999 : parseInt(required.textContent) !== 0 ? parseInt(required.textContent) : 50;
        jss.innerHTML = `
            <span style="margin: 7px 0;">ID: #${json.users.id}</span>
            <span style="margin: 7px 0;">Họ và tên: <span class="text-info">${json.users.fullname}</span></span>
            <span style="margin: 7px 0;">Giới tính: ${json.users.gender === "1" ? `Nam` : json.users.gender === "2" ? `Nữ` : `Khác`}</span>
            <span style="margin: 7px 0;">Email: ${json.users.email}</span>
            <span style="margin: 7px 0;">Số điện thoại: ${json.users.phone}</span>
            <span style="margin: 7px 0;">Địa chỉ: ${json.users.address}</span>
            <span style="margin: 7px 0;">Loại tài khoản: ${json.users.userRole.id === "1" ? "Quản trị" : json.users.userRole.id === "2" ? "Quản lý" : "Người dùng"}</span>
            <span style="margin: 7px 0;">Trạng thái: <span class="${json.users.userstatus.id === "1" ? `text-customer-active` : json.users.userstatus.id === "2" ? `text-customer-warning` : `text-customer-danger`}">${json.users.userstatus.statusname}</span></span>
            <span style="margin: 7px 0;">Danh hiệu: ${json.users.userRole.id === "1" ? `<span class="badge bg-danger m-1 level-name-${json.users.id}" style="font-size: 11px;">Trùm cuối</span><span class="badge bg-success m-1 level-name-${json.users.id}" style="font-size: 11px;">Quản trị viên</span><span class="badge bg-primary m-1 level-name-${json.users.id}" style="font-size: 11px;">${json.users.exp}</span>`
                : json.users.userRole.id === "2" ? `<span class="badge bg-success m-1 level-name-${json.users.id}" style="font-size: 11px;">Quản trị viên</span><span class="badge bg-primary m-1 level-name-${json.users.id}" style="font-size: 11px;">${json.users.exp}</span>`
                : `<span class="badge bg-primary level-name-${json.users.id}" style="font-size: 11px;">${json.users.exp}</span>`}</span>
            <span style="margin: 7px 0;">Cấp độ: </span>
            <span class="profile-exp"><span class="profile-exp-bar" style="width: ${json.users.exp * 100 / requiredExp}%;">${json.users.exp * 100 / requiredExp}% (${json.users.exp}/${requiredExp})</span></span>
            <span style="margin: 14px 0;">Ngày tham gia: <span class="create-date">${json.users.createdDate}</span></span>
        `;
        let jsss = document.getElementById("modal-account-title");
        jsss.innerHTML = `
            <div class="text-account-title">
                <i class="fas fa-crown" style="color: yellow;"></i>
                <img class="rounded account-rank-img-${json.users.id}" src="https://res.cloudinary.com/dkmug1913/image/upload/v1709201059/WebApp/Rank/iron_abwewo.png" style="width: 60px; height: 60px;" alt="rank" />
                <i class="fas fa-crown" style="color: yellow;"></i>
            </div>
        `;
        levelCmt(leveled, json.users.id);
        let btns = document.querySelectorAll('.js-add-user');
        let cart = document.querySelector('.js-modal');
        let modalClose = document.querySelector('.js-modal-close');
        let modalContainer = document.querySelector('.js-modal-container');
        let createDated = document.querySelectorAll(".modal-content .create-date");
        createDated.forEach((element) => {
            const dateValue = dayjs(element.textContent);
            element.textContent = dateValue.format('DD-MM-YYYY');
        });
        for (const btn of btns) {
            btn.addEventListener('click', showProfile);
        }
        modalClose.addEventListener('click', hideProfile);
        cart.addEventListener('click', hideProfile);
        modalContainer.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
    ).catch(error => {
        console.info(error);
    });
}

function productView(endpoint) {
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    }).then(res =>
        res.json()
    ).then(data => {
        let js = document.getElementById("modal-account-img");
        js.innerHTML = `
            <img src="${data.product.image}" alt="avatar">
            <div class="js-currency level">
                <span class="money">${data.product.price}</span>
            </div>
        `;
        let jss = document.getElementById("modal-account-about");
        jss.innerHTML = `
            <span style="margin: 7px 0;">ID: #${data.product.id}</span>
            <span style="margin: 7px 0;">Sản phẩm: <span class="text-info">${data.product.name}</span></span>
            <span style="margin: 7px 0;">Phân loại: ${data.product.categorysubId.name}</span>
            <span style="margin: 7px 0;">Sản phẩm có sẵn: ${data.product.quantity}</span>
            <span style="margin: 7px 0;">Khuyến mãi: <span class="text-danger">${data.product.discount.discount}%</span></span>
            <span style="margin: 7px 0;">Điểm đánh giá: ${data.product.averageRating}</span>
            <span style="margin: 7px 0;">Số lượng đánh giá: ${data.product.reviewCount}</span>
            <span style="margin: 7px 0;">Sản phẩm đã bán: ${data.product.unitsSold}</span>
            <span style="margin: 7px 0 14px;">Trạng thái: <span class="${data.product.productstatus.id === "5" ? `text-customer-active` : data.product.productstatus.id === "6" ? `text-customer-warning` : data.product.productstatus.id === "7" ? `text-customer-danger` : `text-customer-primary`}">${data.product.productstatus.statusname}</span></span>
        `;
        let jsss = document.getElementById("modal-account-title");
        jsss.innerHTML = `
            <i class="fas fa-crown" style="color: yellow;"></i>
            <span class="text-account-title">
                #${data.product.id}
            </span>
            <i class="fas fa-crown" style="color: yellow;"></i>
        `;
        let btns = document.querySelectorAll('.js-add-cart');
        let cart = document.querySelector('.js-modal');
        let modalClose = document.querySelector('.js-modal-close');
        let modalContainer = document.querySelector('.js-modal-container');
        let createDated = document.querySelectorAll(".modal-content .create-date");
        let currencyElement = document.querySelectorAll(".js-currency .money");
        currencyElement.forEach((element) => {
            const amountValue = parseFloat(element.textContent);
            element.textContent = numberWithCommas(amountValue);
        });
        createDated.forEach((element) => {
            const dateValue = dayjs(element.textContent);
            element.textContent = dateValue.format('DD-MM-YYYY');
        });
        for (const btn of btns) {
            btn.addEventListener('click', showProfile);
        }
        modalClose.addEventListener('click', hideProfile);
        cart.addEventListener('click', hideProfile);
        modalContainer.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
    ).catch(error => {
        console.info(error);
    });
}

function productImages(endpoint, images) {
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    }).then(res =>
        res.json()
    ).then(data => {
        let js = document.getElementById("modal-account-img-images");
        js.innerHTML = `
            <div class="block-avatar">
                <a href="javascript:;" onclick="ProductImagesBrowse('product-images')"><img src="${data.product.image}" id="review-images" class="img-thumbnail" alt="avatar"></a>
                <span class="edit-text"><i class="fas fa-image"></i> Chỉnh sửa</span>
                <input type="file" id="product-images" onchange="showPreviewProductImages(event, 'review-images')" accept="image/*" class="form-input d-none" />
            </div>
        `;
        let jss = document.getElementById("modal-account-about-images");
        jss.innerHTML = `
            <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                    <span class="font-14 text-bold">Hình bổ sung 1</span>
                    <a href="javascript:;" class="block-avatar" onclick="ProductImagesBrowse('product-images1')">
                        <img src="${data.img !== null && data.img.img1 !== null ? data.img.img1 : 'https://res.cloudinary.com/dkmug1913/image/upload/v1708661567/WebApp/Product/Product_Image/404_sns2ep.png'}" id="review-images1" class="img-thumbnail" alt="avatar">
                        <span class="edit-text"><i class="fas fa-image"></i> Chỉnh sửa</span>
                    </a>
                    <input type="file" id="product-images1" onchange="showPreviewProductImages(event, 'review-images1')" accept="image/*" class="form-input d-none" />
                </div>
                <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                    <span class="font-14 text-bold">Hình bổ sung 2</span>
                    <a href="javascript:;" class="block-avatar" onclick="ProductImagesBrowse('product-images2')">
                        <img src="${data.img !== null && data.img.img2 !== null ? data.img.img2 : 'https://res.cloudinary.com/dkmug1913/image/upload/v1708661567/WebApp/Product/Product_Image/404_sns2ep.png'}" id="review-images2" class="img-thumbnail" alt="avatar">
                        <span class="edit-text"><i class="fas fa-image"></i> Chỉnh sửa</span>
                    </a>
                    <input type="file" id="product-images2" onchange="showPreviewProductImages(event, 'review-images2')" accept="image/*" class="form-input d-none" />
                </div>
                <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                    <span class="font-14 text-bold">Hình bổ sung 3</span>
                    <a href="javascript:;" class="block-avatar" onclick="ProductImagesBrowse('product-images3')">
                        <img src="${data.img !== null && data.img.img3 !== null ? data.img.img3 : 'https://res.cloudinary.com/dkmug1913/image/upload/v1708661567/WebApp/Product/Product_Image/404_sns2ep.png'}" id="review-images3" class="img-thumbnail" alt="avatar">
                        <span class="edit-text"><i class="fas fa-image"></i> Chỉnh sửa</span>
                    </a>
                    <input type="file" id="product-images3" onchange="showPreviewProductImages(event, 'review-images3')" accept="image/*" class="form-input d-none" />
                </div>
            </div>
        `;
        let button = document.getElementById("change-product-images");
        button.innerHTML = `
            <button type="button" class="m-1 btn btn-outline-success" id="save-product-images" onclick="saveProductImages('${images}')">Lưu</button>
            <button type="button" class="m-1 btn btn-outline-danger" onclick="hideProductImages()">Trở lại</button>
        `;
        let jsss = document.getElementById("modal-account-title-images");
        jsss.innerHTML = `
            <i class="fas fa-crown" style="color: yellow;"></i>
            <span class="text-account-title">
                #${data.product.id}
            </span>
            <i class="fas fa-crown" style="color: yellow;"></i>
        `;

        let btns = document.querySelectorAll('.js-add-cart-images');
        let carts = document.querySelector('.js-modal-images');
        let modalCloses = document.querySelector('.js-modal-close-images');
        let modalContainers = document.querySelector('.js-modal-container-images');
        for (const btn of btns) {
            btn.addEventListener('click', showProductImages);
        }
        modalCloses.addEventListener('click', hideProductImages);
        carts.addEventListener('click', hideProductImages);
        modalContainers.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
    ).catch(error => {
        console.info(error);
    });
}

function saveProductImages(endpoint) {
    const saveProductImages = document.getElementById("save-product-images");
    saveProductImages.classList.add('disabled');
    const avatarInput = document.getElementById("product-images");
    const avatarInput1 = document.getElementById("product-images1");
    const avatarInput2 = document.getElementById("product-images2");
    const avatarInput3 = document.getElementById("product-images3");
    const formData = new FormData();
    if (avatarInput.files.length > 0) {
        formData.append("file", avatarInput.files[0]);
    }
    if (avatarInput1.files.length > 0) {
        formData.append("file1", avatarInput1.files[0]);
    }
    if (avatarInput2.files.length > 0) {
        formData.append("file2", avatarInput2.files[0]);
    }
    if (avatarInput3.files.length > 0) {
        formData.append("file3", avatarInput3.files[0]);
    }
    fetch(endpoint, {
        method: "POST",
        body: formData
    }).then(res => {
        if (res.status === 200) {
            hideProductImages();
            Swal.fire('Cập nhật thành công!', 'Dữ liệu sẽ mất chút thời gian để thay đổi!', 'success');
        } else {
            saveProductImages.classList.remove('disabled');
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
        }
    });
}

function editProduct(endpoint, edited) {
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    }).then(res =>
        res.json()
    ).then(data => {
        let js = document.getElementById("modal-account-img-edit");
        js.innerHTML = `
            <div class="block-avatar">
                <img id="img-preview" src="${data.product.image}" alt="avatar">
                <button type="button" onclick="AvatarBrowse()"><span class="icon-camera-avatar"><i class="fas fa-camera"></i></span></button>
                <input type="file" id="avatarBrowse" onchange="showPreviewDiv(event);" accept="image/*" class="form-input d-none" />
            </div>
            <div class="input-group" style="margin: 5px 0;">
                <span class="input-group-text">Giá: </span>
                <input id="edit-price" type="number" class="form-control" value="${data.product.price}" />
            </div>
        `;
        let jss = document.getElementById("modal-account-about-edit");
        jss.innerHTML = `
            <span style="margin: 7px 0;">ID: #${data.product.id}</span>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Sản phẩm: </span><input id="edit-name" type="text" class="form-control" value="${data.product.name}" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Phân loại: </span>
                <select id="edit-categorySub" class="form-select">
                </select>
            </div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Sản phẩm có sẵn: </span><input id="edit-quantity" type="number" class="form-control" value="${data.product.quantity}" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Khuyến mãi: </span>
                <select id="edit-discount" class="form-select">
                </select>
            </div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Trạng thái: </span>
                <select id="edit-productstatus" class="form-select">
                </select>
            </div>
        `;
        let cateSub = document.getElementById("edit-categorySub");
        let optionCateSub = "";
        for (let c of data.listCategorySub) {
            optionCateSub += `
                <option value="${c.id}" ${data.product.categorysubId.id === c.id ? "selected" : ""}>${c.name}</option>
            `;
        }
        cateSub.innerHTML = optionCateSub;
        let discount = document.getElementById("edit-discount");
        let optionDiscount = "";
        for (let p of data.listPromotion) {
            if (p.type.id === 20) {
                optionDiscount += `
                    <option value="${p.id}" ${data.product.discount.id === p.id ? "selected" : ""}>${p.note} - ${p.discount}%</option>
                `;
            }
        }
        discount.innerHTML = optionDiscount;
        let status = document.getElementById("edit-productstatus");
        let optionStatus = "";
        for (let s of data.listStatus) {
            optionStatus += `
                <option value="${s.id}" ${data.product.productstatus.id === s.id ? "selected" : ""}>${s.statusname}</option>
            `;
        }
        status.innerHTML = optionStatus;
        let button = document.getElementById("change-profile-user");
        button.innerHTML = `
            <button type="button" class="m-1 btn btn-outline-success" id="save-edit-product" onclick="saveEditProduct('${edited}')">Lưu</button>
            <button type="button" class="m-1 btn btn-outline-danger" onclick="hideEditProfile()">Trở lại</button>
        `;
        let jsss = document.getElementById("modal-account-title-edit");
        jsss.innerHTML = `
            <i class="fas fa-crown" style="color: yellow;"></i>
            <span class="text-account-title">
                #${data.product.id}
            </span>
            <i class="fas fa-crown" style="color: yellow;"></i>
        `;
        let btns = document.querySelectorAll('.js-add-cart-edit');
        let carts = document.querySelector('.js-modal-edit');
        let modalCloses = document.querySelector('.js-modal-close-edit');
        let modalContainer = document.querySelector('.js-modal-container-edit');
        for (const btn of btns) {
            btn.addEventListener('click', showEditProfile);
        }
        modalCloses.addEventListener('click', hideEditProfile);
        carts.addEventListener('click', hideEditProfile);
        modalContainer.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
    ).catch(error => {
        console.info(error);
    });
}

function saveEditProduct(endpoint) {
    const saveEditProduct = document.getElementById("save-edit-product");
    saveEditProduct.classList.add('disabled');
    const avatarInput = document.getElementById("avatarBrowse");
    const formData = new FormData();
    if (avatarInput.files.length > 0) {
        formData.append("file", avatarInput.files[0]);
    }
    formData.append("price", document.getElementById("edit-price").value);
    formData.append("name", document.getElementById("edit-name").value);
    formData.append("quantity", document.getElementById("edit-quantity").value);
    formData.append("categorysubId", document.getElementById("edit-categorySub").selectedOptions[0].value);
    formData.append("productstatus", document.getElementById("edit-productstatus").selectedOptions[0].value);
    formData.append("discount", document.getElementById("edit-discount").selectedOptions[0].value);
    fetch(endpoint, {
        method: "POST",
        body: formData
    }).then(res => {
        if (res.status === 200) {
            hideEditProfile();
            Swal.fire('Cập nhật thành công!', 'Dữ liệu sẽ mất chút thời gian để thay đổi!', 'success');
        } else {
            saveEditProduct.classList.remove('disabled');
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
        }
    });
}

function addProduct(endpoint, added) {
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    }).then(res =>
        res.json()
    ).then(data => {
        let js = document.getElementById("modal-account-img-add");
        js.innerHTML = `
            <div class="block-avatar">
                <img id="img-preview" src="https://res.cloudinary.com/dkmug1913/image/upload/v1690819242/WebApp/Avatar/none_ibdmnr.png" alt="avatar">
                <button type="button" onclick="AvatarBrowse()"><span class="icon-camera-avatar"><i class="fas fa-camera"></i></span></button>
                <input type="file" id="avatarBrowse" onchange="showPreviewDiv(event);" accept="image/*" class="form-input d-none" />
            </div>
            <div class="input-group" style="margin: 5px 0;">
                <span class="input-group-text">Giá: </span>
                <input id="add-price" type="number" class="form-control" placeholder="Nhập giá sản phẩm..." />
            </div>
        `;
        let jss = document.getElementById("modal-account-about-add");
        jss.innerHTML = `
            <span style="margin: 7px 0;"></span>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Sản phẩm: </span><input id="add-name" type="text" class="form-control" placeholder="Nhập tên sản phẩm..." /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Phân loại: </span>
                <select id="add-categorySub" class="form-select">
                </select>
            </div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Sản phẩm có sẵn: </span><input id="add-quantity" type="number" class="form-control" placeholder="Nhập số lượng sản phẩm có sẳn..." /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Khuyến mãi: </span>
                <select id="add-discount" class="form-select">
                </select>
            </div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Trạng thái: </span>
                <select id="add-productstatus" class="form-select">
                </select>
            </div>
        `;
        let cateSub = document.getElementById("add-categorySub");
        let optionCateSub = "";
        for (let c of data.listCategorySub) {
            optionCateSub += `
                <option value="${c.id}">${c.name}</option>
            `;
        }
        cateSub.innerHTML = optionCateSub;
        let discount = document.getElementById("add-discount");
        let optionDiscount = "";
        for (let p of data.listPromotion) {
            if (p.type.id === 20) {
                optionDiscount += `
                    <option value="${p.id}">${p.note} - ${p.discount}%</option>
                `;
            }
        }
        discount.innerHTML = optionDiscount;
        let status = document.getElementById("add-productstatus");
        let optionStatus = "";
        for (let s of data.listStatus) {
            optionStatus += `
                <option value="${s.id}">${s.statusname}</option>
            `;
        }
        status.innerHTML = optionStatus;
        let button = document.getElementById("change-profile-add");
        button.innerHTML = `
            <button type="button" class="m-1 btn btn-outline-success" onclick="saveAddProduct('${added}')">Lưu</button>
            <button type="button" class="m-1 btn btn-outline-danger" onclick="hideAddProfile()">Trở lại</button>
        `;
        let jsss = document.getElementById("modal-account-title-add");
        jsss.innerHTML = `
            <i class="fas fa-crown" style="color: yellow;"></i>
            <span class="text-account-title">
                #*****#
            </span>
            <i class="fas fa-crown" style="color: yellow;"></i>
        `;
        let btns = document.querySelectorAll('.js-add-cart-add');
        let cartss = document.querySelector('.js-modal-add');
        let modalClose = document.querySelector('.js-modal-close-add');
        let modalContainer = document.querySelector('.js-modal-container-add');
        for (const btn of btns) {
            btn.addEventListener('click', showAddProfile);
        }
        modalClose.addEventListener('click', hideAddProfile);
        cartss.addEventListener('click', hideAddProfile);
        modalContainer.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
    ).catch(error => {
        console.info(error);
    });
}

function saveAddProduct(endpoint) {
    const avatarInput = document.getElementById("avatarBrowse");
    const formData = new FormData();
    if (avatarInput.files.length > 0) {
        formData.append("file", avatarInput.files[0]);
    }
    formData.append("price", document.getElementById("add-price").value);
    formData.append("name", document.getElementById("add-name").value);
    formData.append("quantity", document.getElementById("add-quantity").value);
    formData.append("categorysubId", document.getElementById("add-categorySub").selectedOptions[0].value);
    formData.append("productstatus", document.getElementById("add-productstatus").selectedOptions[0].value);
    formData.append("discount", document.getElementById("add-discount").selectedOptions[0].value);
    fetch(endpoint, {
        method: "POST",
        body: formData
    }).then(res => {
        if (res.status === 200) {
            hideAddProfile();
            Swal.fire('Thêm sản phẩm thành công!', 'Dữ liệu sẽ mất chút thời gian để thay đổi!', 'success');
        } else {
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
        }
    });
}

let cart = document.querySelector('.js-modal');
function showProfile() {
    // alert('Modal opened successfully');
    cart.classList.add('js-modal-open');
}
function hideProfile() {
    cart.classList.remove('js-modal-open');
}

let carts = document.querySelector('.js-modal-edit');
function showEditProfile() {
    carts.classList.add('js-modal-open');
}
function hideEditProfile() {
    carts.classList.remove('js-modal-open');
}

let cartss = document.querySelector('.js-modal-add');
function showAddProfile() {
    cartss.classList.add('js-modal-open');
}
function hideAddProfile() {
    cartss.classList.remove('js-modal-open');
}

let cartsss = document.querySelector('.js-modal-images');
function showProductImages() {
    cartsss.classList.add('js-modal-open');
}
function hideProductImages() {
    cartsss.classList.remove('js-modal-open');
}

function permissionAccount() {
    Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Tài khoản của bạn không có quyền này!"
    });
}

function warningReport() {
    Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Yêu cầu này đã được xử lý trước đó!"
    });
}

function agreeReport(endpoint, id) {
    Swal.fire({
        icon: "warning",
        title: "Xử phạt!",
        text: "Tài khoản bị báo cáo này sẽ bị cấm bình luận trong 7 ngày tiếp theo!",
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Hành động khi người dùng xác nhận
            requestReport(endpoint, id, 16);
        }
    });
}

function refuseReport(endpoint, id) {
    Swal.fire({
        icon: "question",
        title: "Từ chối!",
        text: "Báo cáo này sẽ bị vô hiệu!",
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'NO'
    }).then((result) => {
        if (result.isConfirmed) {
            // Hành động khi người dùng xác nhận
            requestReport(endpoint, id, 15);
        }
    });
}

function requestReport(endpoint, id, statusId) {
    fetch(endpoint, {
        method: "Put",
        body: JSON.stringify({
            "statusId": statusId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.status === 200) {
            let reportStatus = document.getElementById(`report-status${id}`);
            if (statusId === 16) {
                reportStatus.innerHTML = `<span class="text-customer-active">Đã xử lý</span>`;
            } else {
                reportStatus.innerHTML = `<span class="text-customer-primary">Từ chối</span>`;
            }
            Swal.fire('Thành công!', 'Thao tác xử lý thành công!', 'success');
        } else {
            Swal.fire('Không thành công!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
        }
    });
}

function editCustomer(endpoint, edited, leveled) {
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    }).then(res =>
        res.text()
    ).then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'application/xml');
        const json = xmlToJson(xml);
        let js = document.getElementById("modal-account-img-edit");
        js.innerHTML = `
            <div class="block-avatar">
                <img id="img-preview" src="${json.users.avatar}" alt="avatar">
                <button type="button" onclick="AvatarBrowse()"><span class="icon-camera-avatar"><i class="fas fa-camera"></i></span></button>
                <input type="file" id="avatarBrowse" onchange="showPreviewDiv(event);" accept="image/*" class="form-input d-none" />
            </div>
            <div class="level level-${json.users.id}">
            </div>
        `;
        let jss = document.getElementById("modal-account-about-edit");
        jss.innerHTML = `
            <span style="margin: 5px 0;">ID: #${json.users.id}</span>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Họ và tên: </span><input id="edit-fullname" type="text" class="form-control" value="${json.users.fullname}" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Giới tính: </span>
                <select id="edit-gender" class="form-select">
                    <option value="" ${json.users.gender === "" ? "selected" : ""}>Giới tính</option>
                    <option value="1" ${json.users.gender === "1" ? "selected" : ""}>Nam</option>
                    <option value="2" ${json.users.gender === "2" ? "selected" : ""}>Nữ</option>
                    <option value="3" ${json.users.gender === "3" ? "selected" : ""}>Khác</option>
                </select>
            </div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Email: </span><input id="edit-email" type="email" class="form-control" value="${json.users.email}" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Số điện thoại: </span><input id="edit-phone" type="text" class="form-control" value="${json.users.phone}" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Địa chỉ: </span><input id="edit-address" type="text" class="form-control" value="${json.users.address}" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Trạng thái: </span>
                <select id="edit-userstatus" class="form-select">
                    <option value="1" ${json.users.userstatus.id === "1" ? "selected" : ""}>Hoạt động</option>
                    <option value="2" ${json.users.userstatus.id === "2" ? "selected" : ""}>Cấm bình luận</option>
                    <option value="3" ${json.users.userstatus.id === "3" ? "selected" : ""}>Bị khóa</option>
                    <option value="4" ${json.users.userstatus.id === "4" ? "selected" : ""}>Bị xóa</option>
                </select>
            </div>
        `;
        let adminedit = document.getElementById("modal-role-admin-edit");
        if (adminedit !== null) {
            if (json.users.userRole.id !== "1") {
                adminedit.innerHTML = `
                    <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Loại tài khoản: </span>
                        <select id="edit-role" class="form-select">
                            <option value="1" ${json.users.userRole.id === "1" ? "selected" : ""}>Quản trị</option>
                            <option value="2" ${json.users.userRole.id === "2" ? "selected" : ""}>Quản lý</option>
                            <option value="3" ${json.users.userRole.id === "3" ? "selected" : ""}>Người dùng</option>
                        </select>
                    </div>
                `;
            } else {
                adminedit.innerHTML = `
                    <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Loại tài khoản: </span>
                        <select id="edit-role" class="form-select" disabled>
                            <option value="1" ${json.users.userRole.id === "1" ? "selected" : ""}>Quản trị</option>
                            <option value="2" ${json.users.userRole.id === "2" ? "selected" : ""}>Quản lý</option>
                            <option value="3" ${json.users.userRole.id === "3" ? "selected" : ""}>Người dùng</option>
                        </select>
                    </div>
                `;
            }
        }
        let button = document.getElementById("change-profile-user");
        button.innerHTML = `
            <button type="button" class="m-1 btn btn-outline-success" id="save-edit-user" onclick="saveEditUser('${edited}')">Lưu</button>
            <button type="button" class="m-1 btn btn-outline-danger" onclick="hideEditProfile()">Trở lại</button>
        `;
        let jsss = document.getElementById("modal-account-title-edit");
        jsss.innerHTML = `
            <div class="text-account-title">
                <i class="fas fa-crown" style="color: yellow;"></i>
                <img class="rounded account-rank-img-${json.users.id}" src="https://res.cloudinary.com/dkmug1913/image/upload/v1709201059/WebApp/Rank/iron_abwewo.png" style="width: 60px; height: 60px;" alt="rank" />
                <i class="fas fa-crown" style="color: yellow;"></i>
            </div>
        `;
        levelCmt(leveled, json.users.id);
        let btns = document.querySelectorAll('.js-add-cart-edit');
        let carts = document.querySelector('.js-modal-edit');
        let modalCloses = document.querySelector('.js-modal-close-edit');
        let modalContainer = document.querySelector('.js-modal-container-edit');
        let createDated = document.querySelectorAll(".modal-content .create-date");
        createDated.forEach((element) => {
            const dateValue = dayjs(element.textContent);
            element.textContent = dateValue.format('DD-MM-YYYY');
        });
        for (const btn of btns) {
            btn.addEventListener('click', showEditProfile);
        }
        modalCloses.addEventListener('click', hideEditProfile);
        carts.addEventListener('click', hideEditProfile);
        modalContainer.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
    ).catch(error => {
        console.info(error);
    });
}

function saveEditUser(endpoint) {
    const saveEditUser = document.getElementById("save-edit-user");
    saveEditUser.classList.add('disabled');
    const avatarInput = document.getElementById("avatarBrowse");
    const formData = new FormData();
    if (avatarInput.files.length > 0) {
        formData.append("file", avatarInput.files[0]);
    }
    formData.append("fullname", document.getElementById("edit-fullname").value);
    formData.append("gender", document.getElementById("edit-gender").selectedOptions[0].value);
    formData.append("email", document.getElementById("edit-email").value);
    formData.append("phone", document.getElementById("edit-phone").value);
    formData.append("address", document.getElementById("edit-address").value);
    formData.append("userstatus", document.getElementById("edit-userstatus").selectedOptions[0].value);
    if (document.getElementById("edit-role") !== null) {
        formData.append("userRole", document.getElementById("edit-role").value);
    }
    fetch(endpoint, {
        method: "POST",
        body: formData
    }).then(res => {
        if (res.status === 200) {
            hideEditProfile();
            Swal.fire('Cập nhật thành công!', 'Dữ liệu sẽ mất chút thời gian để thay đổi!', 'success');
        } else {
            saveEditUser.classList.remove('disabled');
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
        }
    });
}

function deleteCustomer(endpoint, id) {
    Swal.fire({
        title: 'Xóa',
        text: 'Bạn có chắc chắn muốn xóa tài khoản này ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Hành động khi người dùng xác nhận
            fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status === 200) {
                    let customerStatus = document.getElementById(`customer-status${id}`);
                    customerStatus.innerHTML = `<span class="text-customer-danger">Bị xóa</span>`;
                    Swal.fire('Xóa thành công!', 'Tài khoản sẽ bị xóa vĩnh viễn sau 30 ngày!', 'success');
                } else {
                    Swal.fire('Xóa không thành công!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
                }
            });
        }
    });
}

function levelCmt(endpoint, id) {
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    }).then(res =>
        res.json()
    ).then(data => {
        var levels = document.querySelectorAll(`.level-${id}`);
        var titleRanks = document.querySelectorAll(`.account-rank-img-${id}`);
        var requiredExps = document.querySelectorAll(`.required-exp-${id}`);
        var levelsCmt = document.querySelectorAll(`.level-name-${id}`);
        levelsCmt.forEach(levelCmt => {
            if (levelCmt.textContent !== "Trùm cuối" && levelCmt.textContent !== "Quản trị viên") {
                levelCmt.textContent = data.level.userRank;
            }
        });
        titleRanks.forEach(titleRank => {
            titleRank.src = data.level.rankImg;
        });
        levels.forEach(level => {
            level.style.color = data.level.rankColor;
            level.textContent = data.level.levelName;
        });
        requiredExps.forEach(requiredExp => {
            requiredExp.textContent = data.level.requiredExp * 2;
        });
    });
}

function productOrderView(endpoint) {
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    }).then(res =>
        res.text()
    ).then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'application/xml');
        const json = xmlToJson(xml);
        let js = document.getElementById("modal-account-img");
        js.innerHTML = `
            <img src="${json.product.image}" alt="avatar">
            <div class="js-currency level">
                <span class="money">${json.product.price}</span>
            </div>
        `;
        let jss = document.getElementById("modal-account-about");
        jss.innerHTML = `
            <span style="margin: 7px 0;">ID: #${json.product.id}</span>
            <span style="margin: 7px 0;">Sản phẩm: <span class="text-info">${json.product.name}</span></span>
            <span style="margin: 7px 0;">Phân loại: ${json.product.categorysubId.name}</span>
            <span style="margin: 7px 0;">Sản phẩm có sẵn: ${json.product.quantity}</span>
            <span style="margin: 7px 0;">Khuyến mãi: <span class="text-danger">${json.product.discount.discount}%</span></span>
            <span style="margin: 7px 0;">Điểm đánh giá: ${json.product.averageRating}</span>
            <span style="margin: 7px 0;">Số lượng đánh giá: ${json.product.reviewCount}</span>
            <span style="margin: 7px 0;">Sản phẩm đã bán: ${json.product.unitsSold}</span>
            <span style="margin: 7px 0 14px;">Trạng thái: <span class="${json.product.productstatus.id === "5" ? `text-customer-active` : json.product.productstatus.id === "6" ? `text-customer-warning` : json.product.productstatus.id === "7" ? `text-customer-danger` : `text-customer-primary`}">${json.product.productstatus.statusname}</span></span>
        `;
        let jsss = document.getElementById("modal-account-title");
        jsss.innerHTML = `
            <i class="fas fa-crown" style="color: yellow;"></i>
            <span class="text-account-title">
                #${json.product.id}
            </span>
            <i class="fas fa-crown" style="color: yellow;"></i>
        `;
        let btns = document.querySelectorAll('.js-add-cart');
        let cart = document.querySelector('.js-modal');
        let modalClose = document.querySelector('.js-modal-close');
        let modalContainer = document.querySelector('.js-modal-container');
        let createDated = document.querySelectorAll(".modal-content .create-date");
        let currencyElement = document.querySelectorAll(".js-currency .money");
        currencyElement.forEach((element) => {
            const amountValue = parseFloat(element.textContent);
            element.textContent = numberWithCommas(amountValue);
        });
        createDated.forEach((element) => {
            const dateValue = dayjs(element.textContent);
            element.textContent = dateValue.format('DD-MM-YYYY');
        });
        for (const btn of btns) {
            btn.addEventListener('click', showProfile);
        }
        modalClose.addEventListener('click', hideProfile);
        cart.addEventListener('click', hideProfile);
        modalContainer.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
    ).catch(error => {
        console.info(error);
    });
}

function deleteOrder(endpoint, id) {
    Swal.fire({
        title: 'Hủy đơn',
        text: 'Bạn có chắc chắn muốn hủy đơn hàng này ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
// Hành động khi người dùng xác nhận
            fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status === 200) {
                    let orderStatus = document.getElementById(`order-status-old${id}`);
                    orderStatus.textContent = "Đã hủy";
                    orderStatus.classList.add("text-customer-danger");
                    Swal.fire('Hủy thành công!', 'Đơn hàng này đã được hủy!', 'success');
                } else {
                    Swal.fire('Hủy không thành công!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
                }
            });
        }
    });
}

function deleteProduct(endpoint, id) {
    Swal.fire({
        title: 'Ngừng bán',
        text: 'Bạn có chắc chắn muốn ngừng cung cấp sản phẩm này ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
// Hành động khi người dùng xác nhận
            fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status === 200) {
                    let productStatus = document.getElementById(`product-status${id}`);
                    productStatus.innerHTML = `<span class="text-customer-danger">Ngừng sản xuất</span>`;
                    Swal.fire('Thao tác thành công!', 'Sản phẩm này đã ngừng cung cấp!', 'success');
                } else {
                    Swal.fire('Thao tác không thành công!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
                }
            });
        }
    });
}

function editCategorySub(id) {
    let categorySubNameOld = document.getElementById(`categorysub-name-old${id}`);
    categorySubNameOld.classList.add('d-none');
    let categorySubNameNew = document.getElementById(`categorysub-name-new${id}`);
    categorySubNameNew.classList.remove('d-none');
    let categoryNameOld = document.getElementById(`category-name-old${id}`);
    categoryNameOld.classList.add('d-none');
    let categoryNameNew = document.getElementById(`category-name-new${id}`);
    categoryNameNew.classList.remove('d-none');
    let categoryEdit = document.getElementById(`categorysub-edit${id}`);
    categoryEdit.classList.add('d-none');
    let categorySuccess = document.getElementById(`categorysub-success${id}`);
    categorySuccess.classList.remove('d-none');
    let categoryDanger = document.getElementById(`categorysub-danger${id}`);
    categoryDanger.classList.remove('d-none');
}

function saveCategorySub(endpoint, id) {
    Swal.fire({
        title: 'Lưu',
        text: 'Lưu thay đổi ?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
// Hành động khi người dùng xác nhận
            let categorySubNameOld = document.getElementById(`categorysub-name-old${id}`);
            let categorySubNameNew = document.getElementById(`categorysub-name-new${id}`);
            let categoryNameOld = document.getElementById(`category-name-old${id}`);
            let categoryNameNew = document.getElementById(`category-name-new${id}`);
            fetch(endpoint, {
                method: "Put",
                body: JSON.stringify({
                    "name": categorySubNameNew.value,
                    "categoryId": categoryNameNew.selectedOptions[0].value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    categorySubNameOld.textContent = categorySubNameNew.value;
                    categoryNameOld.textContent = categoryNameNew.selectedOptions[0].textContent;
                    Swal.fire('Thành công!', 'Bạn đã cập nhật thành công!', 'success');
                } else {
                    Swal.fire('Không thành công!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
                }
                cancelCategorySub(id);
            });
        }
    });
}

function cancelCategorySub(id) {
    let categorySubNameOld = document.getElementById(`categorysub-name-old${id}`);
    categorySubNameOld.classList.remove('d-none');
    let categorySubNameNew = document.getElementById(`categorysub-name-new${id}`);
    categorySubNameNew.classList.add('d-none');
    let categoryNameOld = document.getElementById(`category-name-old${id}`);
    categoryNameOld.classList.remove('d-none');
    let categoryNameNew = document.getElementById(`category-name-new${id}`);
    categoryNameNew.classList.add('d-none');
    let categoryEdit = document.getElementById(`categorysub-edit${id}`);
    categoryEdit.classList.remove('d-none');
    let categorySuccess = document.getElementById(`categorysub-success${id}`);
    categorySuccess.classList.add('d-none');
    let categoryDanger = document.getElementById(`categorysub-danger${id}`);
    categoryDanger.classList.add('d-none');
}

function editPromotion(id) {
    let promotionNameOld = document.getElementById(`promotion-name-old${id}`);
    promotionNameOld.classList.add('d-none');
    let promotionNameNew = document.getElementById(`promotion-name-new${id}`);
    promotionNameNew.classList.remove('d-none');
    let promotionCodeOld = document.getElementById(`promotion-code-old${id}`);
    promotionCodeOld.classList.add('d-none');
    let promotionCodeNew = document.getElementById(`promotion-code-new${id}`);
    promotionCodeNew.classList.remove('d-none');
    let promotionDiscountOld = document.getElementById(`promotion-discount-old${id}`);
    promotionDiscountOld.classList.add('d-none');
    let promotionDiscountNew = document.getElementById(`promotion-discount-new${id}`);
    promotionDiscountNew.classList.remove('d-none');
    let promotionBeginOld = document.getElementById(`promotion-begin-old${id}`);
    promotionBeginOld.classList.add('d-none');
    let promotionBeginNew = document.getElementById(`promotion-begin-new${id}`);
    promotionBeginNew.classList.remove('d-none');
    let promotionEndOld = document.getElementById(`promotion-end-old${id}`);
    promotionEndOld.classList.add('d-none');
    let promotionEndNew = document.getElementById(`promotion-end-new${id}`);
    promotionEndNew.classList.remove('d-none');
    let promotionTypeOld = document.getElementById(`promotion-type-old${id}`);
    promotionTypeOld.classList.add('d-none');
    let promotionTypeNew = document.getElementById(`promotion-type-new${id}`);
    promotionTypeNew.classList.remove('d-none');
    let promotionQuantityOld = document.getElementById(`promotion-quantity-old${id}`);
    promotionQuantityOld.classList.add('d-none');
    let promotionQuantityNew = document.getElementById(`promotion-quantity-new${id}`);
    promotionQuantityNew.classList.remove('d-none');
    let promotionVipOld = document.getElementById(`promotion-vip-old${id}`);
    promotionVipOld.classList.add('d-none');
    let promotionVipNew = document.getElementById(`promotion-vip-new${id}`);
    promotionVipNew.classList.remove('d-none');
    let promotionEdit = document.getElementById(`promotion-edit${id}`);
    promotionEdit.classList.add('d-none');
    let promotionSuccess = document.getElementById(`promotion-success${id}`);
    promotionSuccess.classList.remove('d-none');
    let promotionDanger = document.getElementById(`promotion-danger${id}`);
    promotionDanger.classList.remove('d-none');
}

function savePromotion(endpoint, id) {
    Swal.fire({
        title: 'Lưu',
        text: 'Lưu thay đổi ?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
// Hành động khi người dùng xác nhận
            let promotionNameOld = document.getElementById(`promotion-name-old${id}`);
            let promotionNameNew = document.getElementById(`promotion-name-new${id}`);
            let promotionCodeOld = document.getElementById(`promotion-code-old${id}`);
            let promotionCodeNew = document.getElementById(`promotion-code-new${id}`);
            let promotionDiscountOld = document.getElementById(`promotion-discount-old${id}`);
            let promotionDiscountNew = document.getElementById(`promotion-discount-new${id}`);
            let promotionBeginOld = document.getElementById(`promotion-begin-old${id}`);
            let promotionBeginNew = document.getElementById(`promotion-begin-new${id}`);
            let promotionEndOld = document.getElementById(`promotion-end-old${id}`);
            let promotionEndNew = document.getElementById(`promotion-end-new${id}`);
            let promotionTypeOld = document.getElementById(`promotion-type-old${id}`);
            let promotionTypeNew = document.getElementById(`promotion-type-new${id}`);
            let promotionQuantityOld = document.getElementById(`promotion-quantity-old${id}`);
            let promotionQuantityNew = document.getElementById(`promotion-quantity-new${id}`);
            let promotionVipOld = document.getElementById(`promotion-vip-old${id}`);
            let promotionVipNew = document.getElementById(`promotion-vip-new${id}`);
            fetch(endpoint, {
                method: "Put",
                body: JSON.stringify({
                    "note": promotionNameNew.value,
                    "code": promotionCodeNew.value,
                    "discount": promotionDiscountNew.value,
                    "beginDate": promotionBeginNew.value,
                    "endDate": promotionEndNew.value,
                    "type": promotionTypeNew.selectedOptions[0].value,
                    "quantity": promotionQuantityNew.value,
                    "levelVip": promotionVipNew.selectedOptions[0].value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    promotionNameOld.textContent = promotionNameNew.value;
                    promotionCodeOld.textContent = promotionCodeNew.value;
                    promotionDiscountOld.textContent = promotionDiscountNew.value + "%";
                    promotionBeginOld.textContent = promotionBeginNew.value;
                    promotionEndOld.textContent = promotionEndNew.value;
                    promotionBeginOld.textContent = dayjs(promotionBeginOld.textContent).format('DD-MM-YYYY');
                    promotionEndOld.textContent = dayjs(promotionEndOld.textContent).format('DD-MM-YYYY');
                    promotionTypeOld.textContent = promotionTypeNew.selectedOptions[0].textContent;
                    promotionQuantityOld.textContent = promotionQuantityNew.value;
                    promotionVipOld.textContent = promotionVipNew.selectedOptions[0].textContent;
                    Swal.fire('Thành công!', 'Bạn đã cập nhật thành công!', 'success');
                } else {
                    Swal.fire('Không thành công!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
                }
                cancelPromotion(id);
            });
        }
    });
}

function cancelPromotion(id) {
    let promotionNameOld = document.getElementById(`promotion-name-old${id}`);
    promotionNameOld.classList.remove('d-none');
    let promotionNameNew = document.getElementById(`promotion-name-new${id}`);
    promotionNameNew.classList.add('d-none');
    let promotionCodeOld = document.getElementById(`promotion-code-old${id}`);
    promotionCodeOld.classList.remove('d-none');
    let promotionCodeNew = document.getElementById(`promotion-code-new${id}`);
    promotionCodeNew.classList.add('d-none');
    let promotionDiscountOld = document.getElementById(`promotion-discount-old${id}`);
    promotionDiscountOld.classList.remove('d-none');
    let promotionDiscountNew = document.getElementById(`promotion-discount-new${id}`);
    promotionDiscountNew.classList.add('d-none');
    let promotionBeginOld = document.getElementById(`promotion-begin-old${id}`);
    promotionBeginOld.classList.remove('d-none');
    let promotionBeginNew = document.getElementById(`promotion-begin-new${id}`);
    promotionBeginNew.classList.add('d-none');
    let promotionEndOld = document.getElementById(`promotion-end-old${id}`);
    promotionEndOld.classList.remove('d-none');
    let promotionEndNew = document.getElementById(`promotion-end-new${id}`);
    promotionEndNew.classList.add('d-none');
    let promotionTypeOld = document.getElementById(`promotion-type-old${id}`);
    promotionTypeOld.classList.remove('d-none');
    let promotionTypeNew = document.getElementById(`promotion-type-new${id}`);
    promotionTypeNew.classList.add('d-none');
    let promotionQuantityOld = document.getElementById(`promotion-quantity-old${id}`);
    promotionQuantityOld.classList.remove('d-none');
    let promotionQuantityNew = document.getElementById(`promotion-quantity-new${id}`);
    promotionQuantityNew.classList.add('d-none');
    let promotionVipOld = document.getElementById(`promotion-vip-old${id}`);
    promotionVipOld.classList.remove('d-none');
    let promotionVipNew = document.getElementById(`promotion-vip-new${id}`);
    promotionVipNew.classList.add('d-none');
    let promotionEdit = document.getElementById(`promotion-edit${id}`);
    promotionEdit.classList.remove('d-none');
    let promotionSuccess = document.getElementById(`promotion-success${id}`);
    promotionSuccess.classList.add('d-none');
    let promotionDanger = document.getElementById(`promotion-danger${id}`);
    promotionDanger.classList.add('d-none');
}

function addPromotion(endpoint) {
    let js = document.getElementById("modal-account-img-edit");
    js.innerHTML = `
            <div class="block-avatar">
                <img id="img-preview" src="https://res.cloudinary.com/dkmug1913/image/upload/v1690819242/WebApp/Avatar/none_ibdmnr.png" alt="avatar">
                <button type="button" onclick="AvatarBrowse()"><span class="icon-camera-avatar"><i class="fas fa-camera"></i></span></button>
                <input type="file" id="avatarBrowse" onchange="showPreviewDiv(event);" accept="image/*" class="form-input d-none" />
            </div>
            <div class="level">
                Banner
            </div>
        `;
    let jss = document.getElementById("modal-account-about-edit");
    jss.innerHTML = `
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Tiêu đề: </span><input id="add-name" type="text" class="form-control" value="" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Loại áp dụng: </span>
                <select id="add-type-promotion" class="form-select" onchange="selectTypePromotion()">
                    <option value="19">Thanh toán</option>
                    <option value="20">Sản phẩm</option>
                    <option value="21">Giải thưởng</option>
                </select>
            </div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">CODE: </span><input id="add-code" type="text" class="form-control" value="" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Giá trị khuyến mãi: </span><input id="add-discount" type="number" class="form-control" value="" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Ngày bắt đầu: </span><input id="add-begin-date" type="date" class="form-control" value="" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Ngày kết thúc: </span><input id="add-end-date" type="date" class="form-control" value="" /></div>
            <div class="input-group" style="margin: 5px 0;"><span class="input-group-text">Số lượng: </span><input id="add-quantity" type="number" class="form-control" value="" /></div>
            <div class="input-group d-none" style="margin: 5px 0;" id="d-add-percentpage"><span class="input-group-text">Tỉ lệ (chỉ áp dụng giải thưởng): </span><input id="add-percentpage" type="number" class="form-control" value="" /></div>
        `;
    let button = document.getElementById("change-profile-user");
    button.innerHTML = `
            <button type="button" class="m-1 btn btn-outline-success" id="save-add-promotion" onclick="saveAddPromotion('${endpoint}')">Lưu</button>
            <button type="button" class="m-1 btn btn-outline-danger" onclick="hideEditProfile()">Trở lại</button>
        `;
    let btns = document.querySelectorAll('.js-add-cart-edit');
    let carts = document.querySelector('.js-modal-edit');
    let modalCloses = document.querySelector('.js-modal-close-edit');
    let modalContainer = document.querySelector('.js-modal-container-edit');
    for (const btn of btns) {
        btn.addEventListener('click', showEditProfile);
    }
    modalCloses.addEventListener('click', hideEditProfile);
    carts.addEventListener('click', hideEditProfile);
    modalContainer.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

function selectTypePromotion() {
    let selectTypePromotion = document.getElementById("add-type-promotion");
    let percentpage = document.getElementById("d-add-percentpage");
    if (selectTypePromotion.selectedOptions[0].value === "21") {
        percentpage.classList.remove('d-none');
    } else {
        percentpage.classList.add('d-none');
        document.getElementById("add-percentpage").value = "";
    }
}

function saveAddPromotion(endpoint) {
    const saveAddPromotion = document.getElementById("save-add-promotion");
    saveAddPromotion.classList.add('disabled');
    const avatarInput = document.getElementById("avatarBrowse");
    const formData = new FormData();
    if (avatarInput.files.length > 0) {
        formData.append("file", avatarInput.files[0]);
    }
    formData.append("note", document.getElementById("add-name").value);
    formData.append("code", document.getElementById('add-code').value);
    formData.append("discount", document.getElementById('add-discount').value);
    formData.append("beginDate", document.getElementById('add-begin-date').value);
    formData.append("endDate", document.getElementById('add-end-date').value);
    formData.append("type", document.getElementById('add-type-promotion').selectedOptions[0].value);
    formData.append("quantity", document.getElementById('add-quantity').value);
    if (document.getElementById('add-percentpage').value !== "") {
        formData.append("percentpage", document.getElementById('add-percentpage').value);
    }
    if (document.getElementById('add-vip-promotion').value !== "") {
        formData.append("levelVip", document.getElementById('add-vip-promotion').selectedOptions[0].value);
    }
    fetch(endpoint, {
        method: "POST",
        body: formData
    }).then(res => {
        if (res.status === 201) {
            hideEditProfile();
            Swal.fire('Thao tác thành công!', 'Đã thêm 1 khuyến mãi mới thành công!', 'success');
        } else {
            saveAddPromotion.classList.remove('disabled');
            Swal.fire('Thao tác không thành công!', 'Vui lòng nhập đầy đủ thông tin và thử lại!', 'error');
        }
    });
}

function deletedItem(endpoint, id) {
    Swal.fire({
        title: 'Xóa',
        text: 'Bạn có chắc chắn muốn xóa ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
// Hành động khi người dùng xác nhận
            fetch(endpoint, {
                method: "Delete"
            }).then(res => {
                if (res.status === 200) {
                    let orderTr = document.getElementById(`promotion-${id}`);
                    if (orderTr !== null) {
                        orderTr.innerHTML = ``;
                    }
                    let categoryTr = document.getElementById(`category-${id}`);
                    if (categoryTr !== null) {
                        categoryTr.innerHTML = ``;
                    }
                    let reportTr = document.getElementById(`report-${id}`);
                    if (reportTr !== null) {
                        reportTr.innerHTML = ``;
                    }
                    let commentTr = document.getElementById(`comment-${id}`);
                    if (commentTr !== null) {
                        commentTr.innerHTML = ``;
                    }
                    Swal.fire('Xóa thành công!', 'Bạn đã xóa thành công!', 'success');
                } else {
                    Swal.fire('Xóa không thành công!', 'Danh mục này đang được áp dụng!', 'error');
                }
            });
        }
    });
}

function showStatus(id) {
    let orderStatusOld = document.getElementById(`order-status-old${id}`);
    orderStatusOld.classList.add('d-none');
    let orderStatusNew = document.getElementById(`order-status-new${id}`);
    orderStatusNew.classList.remove('d-none');
    let orderEdit = document.getElementById(`order-edit${id}`);
    orderEdit.classList.add('d-none');
    let orderCancel = document.getElementById(`order-cancel${id}`);
    orderCancel.classList.remove('d-none');
}

function cancelStatus(id) {
    let orderStatusOld = document.getElementById(`order-status-old${id}`);
    orderStatusOld.classList.remove('d-none');
    let orderStatusNew = document.getElementById(`order-status-new${id}`);
    orderStatusNew.classList.add('d-none');
    let orderEdit = document.getElementById(`order-edit${id}`);
    orderEdit.classList.remove('d-none');
    let orderCancel = document.getElementById(`order-cancel${id}`);
    orderCancel.classList.add('d-none');
}

function updateOrderStatus(endpoint, id) {
    Swal.fire({
        title: 'Cập nhật',
        text: 'Bạn có chắc chắn muốn cập nhật đơn hàng ?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
    }).then((result) => {
        let orderStatusOld = document.getElementById(`order-status-old${id}`);
        let orderStatusNew = document.getElementById(`order-status-new${id}`);
        let orderEdit = document.getElementById(`order-edit${id}`);
        let orderCancel = document.getElementById(`order-cancel${id}`);
        if (result.isConfirmed) {
// Hành động khi người dùng xác nhận
            fetch(endpoint, {
                method: "Put",
                body: JSON.stringify({
                    "orderStatus": orderStatusNew.selectedOptions[0].value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    let cls = orderStatusNew.selectedOptions[0].value === "9" ? "warning" :
                            orderStatusNew.selectedOptions[0].value === "10" ? "primary" :
                            orderStatusNew.selectedOptions[0].value === "11" ? "active" :
                            orderStatusNew.selectedOptions[0].value === "12" ? "danger" :
                            orderStatusNew.selectedOptions[0].value === "17" ? "primary" : "active";
                    orderStatusOld.classList.remove(...orderStatusOld.classList);
                    orderStatusOld.classList.add("text-customer-" + cls);
                    orderStatusOld.textContent = orderStatusNew.selectedOptions[0].textContent;
                    Swal.fire('Thành công!', 'Bạn đã cập nhật thành công!', 'success');
                } else {
                    Swal.fire('Không thành công!', 'Đã xảy ra lỗi, nhưng đừng bực mình - đây không phải là lỗi của bạn!', 'error');
                }
            });
        }
        orderStatusOld.classList.remove('d-none');
        orderStatusNew.classList.add('d-none');
        orderEdit.classList.remove('d-none');
        orderCancel.classList.add('d-none');
    });
}

function AvatarBrowse() {
    document.getElementById("avatarBrowse").click();
}

function showPreviewDiv(event) {
    let preview = document.getElementById("img-preview");
    if (event.target.files.length > 0) {
        let src = URL.createObjectURL(event.target.files[0]);
        preview.src = src;
    }
}

function ProductImagesBrowse(id) {
    document.getElementById(id).click();
}

function showPreviewProductImages(event, id) {
    let preview = document.getElementById(id);
    if (event.target.files.length > 0) {
        let src = URL.createObjectURL(event.target.files[0]);
        preview.src = src;
    }
}

function xmlToJson(xml) {
    var obj = {};
    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        obj = xml.nodeValue.trim();
    }
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (nodeName == "#text") {
                obj = item.nodeValue.trim();
                continue;
            }
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}
