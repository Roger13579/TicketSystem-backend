#  Ticket-System（票務系統）－ 後端

## 專案介紹

## 專案團隊

| 開發人員        | 負責開發範圍 |
|-------------|--------|
| Jules       | 前端開發   |
| Muchuanhung | 前端開發   |
| Johnnim     | 前端開發   |
| Jennychiang | 前端開發   |
| Roger Li    | 後端開發   |
| YJ          | 後端開發   |

## 安裝本專案
- Node.js 版本必需為 v21
1. 取得專案
   ```
   git clone  https://github.com/Roger13579/TicketSystem-backend.git
   ```
2. 移動到專案中
   ```
   cd ticket-system-frontend
   ```
3. 安裝套件
   ```
   npm install
   ```
4. 根據 `.evn.example` 內容來調整設定
   ```
   PORT= # PORT號
   ```
5. 運行專案
   ```
   npm run start
   ```
6. 開啟專案
   在瀏覽器中前往 `http://localhost:3000` 後，輸入對應身份組的帳號密碼即可查看

## 資料夾說明
| 資料夾/檔案           | 說明                             |
|------------------|--------------------------------|
| `src/app`        | 根據身份組（路由）去開不同的資料夾，內有此專案主要的功能核心 |
| `src/assets`     | 圖片、svg 等放置於此                   |
| `src/components` | 此資料夾中含有共用的頁面配置、元件              |
| `src/hooks`      | 此資料夾中放置共用的 React custom hooks  |
| `src/pages`      | 路由在此資料夾設定                      |
| `src/services`   | 像後端取得資料的 api 在此資料夾設定           |
| `src/stores`     | 於此資料夾中設定全域共用的狀態管理              |
| `src/styles`     | 全域的樣式檔                         |
| `src/types`      | TypeScript 的型別統一於此設定           |
| `src/utils`      | 全域共用的函示會放在此資料夾中                |

在每個 `src/apps` 的元件中，通常會包含以下幾個檔案：
- `components/*`：此頁面所需的元件
- `hooks/*`：定義此頁面所需的 React custom hooks
- `index.tsx`：此頁面的進入點
- `stores.ts`：此頁面所需的狀態管理

## 專案使用技術
- Node.js: v21
- Next.js: v14.1
- TypeScript: v5
- Vite: v5.2.8
- React hook form: v7
- TailwindCSS: v3.4.3
- ESlint: v8