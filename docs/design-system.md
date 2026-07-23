# Design System Foundation

## Muc tieu

Toan bo web app nay chuyen sang huong `Minimalist Modern` de:

- giu bo mat san pham sang, ro va de mo rong
- tao mot diem nhan thi giac manh bang accent xanh dien
- dong bo map, upload, dashboard va cac man hinh mo rong theo cung mot nhip layout, typography va motion

## Token cot loi

- Background: `#FAFAFA`
- Foreground: `#0F172A`
- Muted surface: `#F1F5F9`
- Muted text: `#64748B`
- Accent: `#0052FF`
- Accent secondary: `#4D7CFF`
- Border: `#E2E8F0`
- Card: `#FFFFFF`

Tat ca token nam trong [apps/web/src/app/globals.css](/Users/nhugiabach/Documents/Github/trafficdemo/apps/web/src/app/globals.css).

## Typography

- Display: `Calistoga`
- Body/UI: `Inter`
- Mono labels: `JetBrains Mono`

Nguyen tac:

- `h1`, `h2` dung display font
- UI, card title, body text dung `Inter`
- badge, label section, chi tiet ky thuat dung mono font

## Primitive uu tien tai su dung

- `.panel`: surface co border va shadow
- `.eyebrow`: section badge co cham accent
- `.action-button`: CTA chinh
- `.action-button.is-secondary`: CTA phu
- `.section-heading`: mo ta section co nhip doc ro rang
- `.feature-card`, `.placeholder`: card mo rong

## Nguyen tac mo rong

1. Accent xanh chi dung o diem quan trong, khong trai deu khap man hinh.
2. Moi trang moi nen bat dau tu `.shell`, `.page-intro`, `.panel`.
3. Card dung nen trang, border nhe, shadow mem. Khong quay lai flat grey surface cua he cu.
4. Section quan trong co the dung dark/inverted block de tao nhip scroll.
5. Motion nhe, co chu dich: hover, pulse, float, fade. Khong lam rung toan bo giao dien.
6. Typography la thanh phan nhan dien chinh, vi vay khong thay bang system font ngau nhien o cac man hinh moi.

## Huong tiep theo

- Chart that: dung card trang + accent trend + dark stat section khi can nhan manh KPI
- Upload that: dung state card, progress badge, preview table cung accent system
- Dashboard that: tao reusable filter bar, KPI tiles va insight cards dua tren primitive hien tai
