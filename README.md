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
   cd ticket-system-backend
   ```
3. 安裝套件
   ```
   npm install
   ```
4. 根據 `.evn.example` 內容來調整設定
   ```
   PORT= # PORT號
   MONGO_DB_URL= # DB連線
   ```
5. 運行專案
   ```
   npm run build
   npm run start
   ```
6. 開啟專案
   在瀏覽器中前往 `http://localhost:3000` 後，輸入對應身份組的帳號密碼即可查看

## 資料夾說明
| 資料夾/檔案           | 說明                  |
|------------------|---------------------|
| `src/bin`        | 內含server初始化入口www.ts |
| `src/config`     | 此專案設定如DB連線資訊        |
| `src/controller` | 存放各功能controller     |
| `src/middleware` | 存放專案使用的middleware   |
| `src/models`     | DB Schema 物件定義      |
| `src/routes`     | 存放各功能路由             |
| `src/service`    | 存放各功能業務邏輯           |
| `src/utils`      | 全域共用的函式工具           |

## 專案使用技術
- Node.js: v21
- Express: v4.19
- TypeScript: v5
- ESlint: v8