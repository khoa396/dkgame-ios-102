// api/index.js
const cheerio = require('cheerio');

export default async function handler(req, res) {
  const TARGET_URL = 'https://102games.mafiahax.net/';

  try {
    // 1. Lấy nội dung HTML từ trang gốc
    const response = await fetch(TARGET_URL);
    const html = await response.text();

    // 2. Load HTML vào cheerio để chỉnh sửa
    const $ = cheerio.load(html);

    // --- BẮT ĐẦU CHỈNH SỬA THEO YÊU CẦU ---

    // A. Thêm thẻ <base> để giữ nguyên CSS/JS/Hình ảnh từ trang gốc
    // Nếu không có bước này, web sẽ bị vỡ giao diện vì không tải được file css/ảnh
    $('head').prepend(`<base href="${TARGET_URL}">`);

    // B. Xoá logo
    // Tìm thẻ img có class brand-logo và xoá nó
    $('.brand-logo').remove();

    // C. Đổi tên MAFIAHAX thành DKGAME
    // Thay đổi tiêu đề trang (trên tab trình duyệt)
    $('title').text('DKGAME');
    // Thay đổi tên thương hiệu ở header (class .brand-title)
    $('.brand-title').text('DKGAME');
    // Thay đổi tên thương hiệu ở footer (class .footer-title)
    $('.footer-title').text('DKGAME');

    // D. Xoá phần "Tuyển cộng tác viên chênh lệch key"
    // Tìm thẻ section nào có chứa text này và xoá toàn bộ section đó
    $('.section').filter((i, el) => {
      return $(el).text().includes('Tuyển cộng tác viên chênh lệch key');
    }).remove();

    // --- KẾT THÚC CHỈNH SỬA ---

    // 3. Trả về nội dung HTML đã chỉnh sửa
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send($.html());

  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải trang nguồn.');
  }
}