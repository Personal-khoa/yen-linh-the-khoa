# public/assets

Thư mục này chứa các file media được dùng trong thiệp cưới.
Các file này **không được commit vào git** (xem `.gitignore`).

## Danh sách file cần có

| File | Mô tả | Kích thước gốc |
|------|-------|----------------|
| `cover-sleeve.webp` | Ảnh bìa ngoài thiệp (lotus sleeve) | ~114 KB |
| `logo-lk.webp` | Logo chữ L&K | ~18 KB |
| `lotus-bloom.webp` | Hoa sen nở (trang trí story) | ~149 KB |
| `lotus-leaf-bottom.webp` | Lá sen dưới | ~109 KB |
| `lotus-leaf-top.webp` | Lá sen trên | ~107 KB |
| `canon-in-d.mp3` | Nhạc nền Canon in D | ~4.2 MB |

## Cách thêm file

Đặt trực tiếp các file vào thư mục này với đúng tên như trên.
Khi build Docker, các file này sẽ được copy vào image và serve tại `/assets/<filename>`.
