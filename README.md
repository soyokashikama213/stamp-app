# 🌸 スタンプ帳アプリ

毎日の達成をかわいくスタンプできるWebアプリです。  
**コピペ＋手順通りで、非エンジニアでも公開まで完結します！**

---

## 📸 機能一覧

- 📅 カレンダー形式で日付ごとにスタンプ管理
- 🌸 項目を自由に作成・削除
- 💫 タップでポワンとしたアニメーション
- 📊 達成率・連続日数の可視化
- 🔒 Googleログインでクラウド保存
- 📱 スマホ・PC両対応（レスポンシブ）

---

## 🏗️ アーキテクチャ

```
[ブラウザ] ←→ [Vercel（Next.js）] ←→ [Supabase（DB + Auth）]
```

| レイヤー | 技術 | 役割 |
|--------|------|------|
| フロント | Next.js 14 + React | UI・カレンダー表示 |
| スタイル | Tailwind CSS | パステルデザイン |
| 認証 | Supabase Auth (Google) | ログイン管理 |
| DB | Supabase PostgreSQL | 習慣・スタンプ保存 |
| ホスティング | Vercel | デプロイ・公開 |

---

## 🚀 セットアップ手順（初心者向け）

### ステップ 1：GitHubにリポジトリを作る

1. [github.com](https://github.com) でアカウント作成・ログイン
2. 右上の「+」→「New repository」をクリック
3. Repository name に `stamp-app` と入力
4. 「Create repository」をクリック

### ステップ 2：ファイルをGitHubにアップロード

このプロジェクトフォルダ全体を、GitHubにプッシュします。

```bash
# ターミナル（Macはターミナル、WindowsはGit Bash）で実行
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/あなたのユーザー名/stamp-app.git
git push -u origin main
```

### ステップ 3：Supabaseのプロジェクトを作る

1. [supabase.com](https://supabase.com) でアカウント作成・ログイン
2. 「New project」をクリック
3. プロジェクト名：`stamp-app`、パスワード：任意（メモしておく）、リージョン：`Northeast Asia (Tokyo)` を選択
4. 「Create new project」をクリック（数分かかります）

### ステップ 4：データベースを作る

1. Supabaseの左メニュー「SQL Editor」をクリック
2. 「New query」をクリック
3. このリポジトリの `supabase-schema.sql` の内容を全部コピー
4. エディタに貼り付けて「Run」ボタンをクリック
5. 「Success」と表示されればOK ✅

### ステップ 5：GoogleログインをSupabaseで有効化

1. Supabaseの左メニュー「Authentication」→「Providers」をクリック
2. 「Google」をクリックして展開
3. **Enable Sign in with Google** をONにする

#### Google Cloud Consoleで認証情報を作る

1. [console.cloud.google.com](https://console.cloud.google.com) にアクセス
2. 新しいプロジェクトを作成（名前は何でもOK）
3. 左メニュー「APIとサービス」→「認証情報」をクリック
4. 「認証情報を作成」→「OAuthクライアントID」を選択
5. アプリの種類：「ウェブアプリケーション」を選択
6. 承認済みリダイレクトURI に以下を追加：
   ```
   https://あなたのプロジェクトID.supabase.co/auth/v1/callback
   ```
   ※ プロジェクトIDはSupabaseのURL欄で確認できます
7. 「作成」をクリック → **クライアントID** と **クライアントシークレット** をコピー

#### SupabaseにGoogle認証情報を入力

1. Supabase「Authentication」→「Providers」→「Google」に戻る
2. コピーした **Client ID** と **Client Secret** を貼り付け
3. 「Save」をクリック ✅

### ステップ 6：APIキーをメモする

1. Supabaseの左メニュー「Settings」→「API」をクリック
2. 以下の2つをメモ（後でVercelに設定します）：
   - **Project URL**（例：`https://xxxxxxxxxxx.supabase.co`）
   - **anon public** キー（長い文字列）

### ステップ 7：Vercelにデプロイ

1. [vercel.com](https://vercel.com) でアカウント作成（GitHubでログイン推奨）
2. 「Add New...」→「Project」をクリック
3. GitHubのリポジトリ一覧から `stamp-app` を選択して「Import」
4. 「Environment Variables」を展開して以下を追加：

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | ステップ6でメモしたProject URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ステップ6でメモしたanon publicキー |

5. 「Deploy」をクリック！

数分後に公開URLが発行されます 🎉

### ステップ 8：リダイレクトURLを本番URLに更新

デプロイ後、Vercelから発行されたURL（例：`https://stamp-app-xxx.vercel.app`）を使って：

1. Google Cloud ConsoleのOAuth設定に、本番URLのリダイレクトも追加：
   ```
   https://stamp-app-xxx.vercel.app/
   ```

2. SupabaseのAuthentication → URL Configurationにも追加（必要な場合）

---

## 💻 ローカルで開発する場合

```bash
# 依存パッケージをインストール
npm install

# 環境変数ファイルを作成
cp .env.local.example .env.local
# .env.local を開いて、Supabaseの値を入力

# 開発サーバー起動
npm run dev

# http://localhost:3000 で確認
```

---

## 📂 ディレクトリ構成

```
stamp-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # メインページ（カレンダー）
│   │   ├── globals.css         # グローバルスタイル
│   │   └── auth/
│   │       └── page.tsx        # ログインページ
│   ├── components/
│   │   ├── Calendar.tsx        # カレンダーグリッド
│   │   ├── HabitManager.tsx    # 習慣の追加・削除モーダル
│   │   ├── StatsBar.tsx        # 達成率・連続日数の表示
│   │   └── Header.tsx          # ヘッダー（月ナビ）
│   ├── lib/
│   │   ├── supabase.ts         # Supabaseクライアント
│   │   └── supabase-server.ts  # サーバー用（ミドルウェア）
│   ├── types/
│   │   └── index.ts            # TypeScript型定義
│   └── middleware.ts            # 認証チェック
├── supabase-schema.sql          # DBスキーマ（SQLエディタに貼る）
├── .env.local.example           # 環境変数テンプレート
├── package.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🔧 よくあるトラブル

### ログインしてもトップページに戻れない
→ Supabaseの「Authentication」→「URL Configuration」に、  
  `https://あなたのVercelURL.app` を追加してください。

### Google認証でエラーが出る
→ Google Cloud ConsoleのOAuthリダイレクトURIが正しいか確認してください。

### デプロイ後に真っ白な画面が出る
→ Vercelの環境変数（NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY）が正しく設定されているか確認してください。

---

## 🌱 今後の機能追加アイデア

- 週次・年間ビュー
- 達成時の通知（PWA Push通知）
- 習慣の並び替え（ドラッグ&ドロップ）
- シェア機能（SNSに達成を投稿）
- テーマカラーの変更

---

## 📄 ライセンス

MIT License - 自由に使用・改変してください！
