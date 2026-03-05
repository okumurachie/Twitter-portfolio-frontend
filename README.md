# Twitter風SNSアプリ - (Frontend)

## 概要

Twitter風の簡易SNSアプリのフロントエンドです。
Nuxt 4 を使用してUIを構築し、LaravelのBackend APIと連携しています。

## トップ画面

![トップ画面](./docs/top.png)

## 作成した目的

- LaravelとNuxtのAPI連携によるモダンなWebアプリ構成の理解
- Firebase Authenticationを用いたトークン認証の実装経験
- フロントエンド／バックエンド分離構成での開発演習

## 関連リポジトリ

- Frontend: https://github.com/okumurachie/Twitter-frontend
- Backend: https://github.com/okumurachie/Twitter-backend

## アプリケーションURL

※ 本アプリはローカル環境での動作を前提としています。デプロイは行っていません。

## 動作前提

- 本アプリはバックエンドが起動している必要があります。先にBackend側READMEに従い、以下を実行してください。

```bash
php artisan serve
```

# 環境構築手順（ローカル開発用）

## 1.リポジトリをクローン

```bash
git clone git@github.com:okumurachie/Twitter-frontend.git
cd Twitter-frontend
```

## 2. .envファイル作成

```bash
cp .env.example .env
```

(.env.example ファイルから.env を作成し、環境変数を変更)

## 3. .envファイルにFirebase設定値を記入

- 以下の値は Firebaseコンソール → プロジェクト設定 → 全般 → マイアプリ から取得してください。

```env
NUXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxxxxxxxxxxx
NUXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxx
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxxxxxxxxxxx
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxxxxxxxxxx
NUXT_PUBLIC_FIREBASE_APP_ID=xxxxxxxxxxxxxxxxxxxxx
```

Backend API のURL：

```env
NUXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

## 4.依存パッケージインストール

```bash
npm install
```

## 5.開発サーバー起動

```bash
npm run dev
```

## 6.アクセス

```
http://localhost:3000
```

## 使用技術

- Nuxt 4.3(Vue 3ベース)
- Pinia(状態管理)
- Firebase 12系(認証)
- vee-validate + yup(フォームバリデーション)
- REST API（Laravel連携）

## 主な機能

- Firebase Authentication（フロント側ログイン管理）
- 投稿の一覧表示
- 投稿作成・削除(認証ユーザーのみ)
- いいね機能(重複防止)
- コメント機能
- 投稿追加・削除・コメント追加・いいね機能は認証ユーザーのみ操作可能
- 非同期通信(API連携)
- 状態管理(ログイン状態保持)
- 自身の投稿のみ削除可能

## UI設計

- Twitter/X ライクな SNS UI を Nuxt 4 で実装
- PC / スマートフォン両対応（レスポンシブ）
- スマートフォン表示では、ナビゲーション簡略化
- コンポーネント設計を意識し、責務分離を実施

## 使い方（ローカル確認）

1. バックエンドを起動
2. Firebaseでユーザー登録（例：Test User）
3. 登録したユーザーでログイン
4. 投稿・削除・いいね・コメントの動作確認

※ Seederユーザー（Test User1 / Test User2）は表示専用です。

## 注意事項

- Backendが起動していない場合、投稿や認証は動作しません。
- Firebase設定が正しくない場合、ログインできません。

## 開発環境

- Node.js 18.x 以上
- npm (Node付属)

#### ローカルURL:

```
トップ画面：http://localhost:3000/
会員登録：http://localhost:3000/register
ログイン:http://localhost:3000/login
```

# Twitter-frontend
